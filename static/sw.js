self.importScripts("/js/cache-db.min.js");

let blogVersion = "";
let checkJson = {};
let isDataFetched = false;

const NPM_REGISTRY_BASE_URL = "https://registry.npmmirror.com/";
const packageName = "@floatsheep/fsl-blog"; // 博客包名，根据实际情况替换
const blogDomain = "blog.hesiy.cn"; // 博客域名，根据实际情况替换
const localMode = false; // 本地模式标志，设置为true时将忽略域名检查

const shouldUpdate = 1; // 没太大用处

const cacheObject = new CacheDB("ServiceStorage", "objectPrefix", { auto: 1 });

async function initializeDB() {
  try {
    await cacheObject.write("initCheck", "initialized");
    return true;
  } catch (error) {
    console.error("初始化缓存数据库时发生错误:", error);
    return false;
  }
}

async function checkAndInitializeVersionKey() {
  try {
    // 确保数据库被初始化
    await initializeDB();

    let versionExists;
    try {
      versionExists = await cacheObject.read("version");
    } catch (readError) {
      console.log("读取version键时发生错误:", readError);
      versionExists = null;
    }

    if (versionExists === null || versionExists === undefined) {
      await cacheObject.write("version", "0.0.0-0");
      console.log("Version 初始化成功。");
    }
    return Promise.resolve();
  } catch (error) {
    console.error("初始化或读取version键时发生错误:", error);
    return Promise.resolve();
  }
}

async function cacheOperation(newVersion) {
  try {
    await initializeDB(); // 确保数据库被初始化

    let nowVersionRaw = await cacheObject.read("version");
    if (nowVersionRaw === null || nowVersionRaw === undefined) {
      console.error("读取version后仍未能找到该键，这是一个不应该出现的情况。");
      return false;
    }

    let nowVersionNum = Number(nowVersionRaw.split("-")[1]);
    let newVersionNum = Number(newVersion.split("-")[1]);

    if (isNaN(newVersionNum)) {
      console.error("新版本号格式错误，无法正确转换为数字进行比较。");
      return false;
    }

    if (isNaN(nowVersionNum)) {
      console.log("当前版本信息不完整，将直接设置新版本为初始版本");
      await cacheObject.write("version", newVersion);
      return true;
    }

    if (newVersionNum !== nowVersionNum) {
      await cacheObject.write("version", newVersion);
      console.log(`版本已更新：${newVersion}`);
      return true;
    } else {
      console.log("当前是最新版本");
      return false;
    }
  } catch (error) {
    console.error("cacheOperation 发生错误:", error);
    return false;
  }
}

function checkUpdate(data) {
  const latestVersion = data["dist-tags"].latest; // 从传入参数：data 数组的 dist-tags 中读取 latest 值

  cacheOperation(String(latestVersion)) // 调用 cacheOperation 进行 IndexedDB 的更新操作
    .then((isUpdated) => {
      if (isUpdated) {
        // 如果 cacheOperation(data) 比对并进行了版本修改
        console.log("博客缓存版本已更新");
      } else {
        // 如果 cacheOperation(data) 无操作
        console.log(`当前版本: ${latestVersion} 是最新的`);
      }
    })
    .catch((error) => {
      console.error("更新检查失败:", error);
    });
}

async function getNewestData() {
  const checkURL = `${NPM_REGISTRY_BASE_URL}${packageName}`;

  try {
    const response = await fetch(checkURL);
    if (!response.ok) {
      throw new Error(`fetch 请求失败，状态码：${response.status}`);
    }
    const pkgData = await response.text();

    try {
      const jsonData = JSON.parse(pkgData);
      checkUpdate(jsonData); // 仅在解析成功时调用 checkUpdate
      return true;
    } catch (e) {
      console.error("收到的数据不是有效的JSON:", pkgData);
      return false;
    }
  } catch (error) {
    console.error("Fetch 更新信息失败:", error);
    return false;
  }
}

async function fetchNewestDataIfNeeded() {
  if (!isDataFetched) {
    const getData = await getNewestData();
    if (getData) {
      isDataFetched = true; // 只有当数据成功获取时才设置为 true
    } else {
      console.log("获得新版本数据时发生了一些问题, 函数返回：", getData);
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (() => {
      checkAndInitializeVersionKey(); //检查和初始化
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(async () => {
      await fetchNewestDataIfNeeded();
      await checkAndInitializeVersionKey();
    })
  );
});

self.addEventListener("fetch", (event) => {
  fetchNewestDataIfNeeded(); // 更新版本信息

  const url = new URL(event.request.url);

  // 检查请求的 Accept 头部是否为 EventSource 的 MIME 类型
  const isEventSource =
    event.request.headers.get("Accept") === "text/event-stream";

  if (isEventSource) {
    // 如果是 EventSource 请求则不拦截，让浏览器直接处理
    return;
  }

  // 判断当前是否处于本地开发模式或者请求的域名是否为博客域名
  const shouldIntercept = localMode || url.hostname === blogDomain;

  // 判断请求是否需要通过NPM镜像获取且不是对Service Worker本身的请求
  const shouldHandleFetch =
    shouldIntercept &&
    event.request.url.startsWith(self.location.origin) &&
    !event.request.url.includes("sw.js");

  if (shouldHandleFetch) {
    let relPath = url.pathname; // 获取相对路径

    // 如果路径以斜杠结尾，那么视它为目录请求并自动加上 'index.html'
    if (relPath.endsWith("/")) {
      relPath += "index.html";
    }

    // 转换 HTML 为数据请求以绕开扩展名限制
    if (relPath.endsWith(".html")) {
      let fileNameWithExt = relPath.split("/").pop(); // 提取文件名包括扩展名
      let fileNameWithoutExt = fileNameWithExt.slice(
        0,
        fileNameWithExt.lastIndexOf(".")
      ); // 移除扩展名
      relPath = relPath.replace(
        fileNameWithExt,
        `${fileNameWithoutExt}-html.json`
      ); // 替换为新格式
    }

    // 处理版本信息
    cacheObject
      .read("version")
      .then((nowVersion) => {
        if (nowVersion) {
          // 如果存在版本信息，则使用该版本
          blogVersion = nowVersion;
        } else {
          // 如果不存在本地版本信息，则从远程获取最新数据
          getNewestData();
        }
      })
      .catch((error) => {
        console.error("获取版本信息失败:", error);
      });

    const npmPath = `${NPM_REGISTRY_BASE_URL}${packageName}/${blogVersion}/files${relPath}`;

    event.respondWith(
      (async () => {
        let response;
        try {
          if (isDataFetched) {
            const npmPath = `${NPM_REGISTRY_BASE_URL}${packageName}/${blogVersion}/files${relPath}`;
            response = await fetch(npmPath);
            if (!response.ok) {
              throw new Error(
                `NPM Mirror 响应出现问题, 状态码返回：${response.status}`
              );
            }
          } else {
            response = await fetch(event.request);
            if (!response.ok) {
              throw new Error("原始请求失败");
            }
          }
          return corsResponse(response);
        } catch (error) {
          console.log(
            "从 NPM Mirror 获取数据失败，退回到原请求：",
            error.message
          );
          try {
            response = await fetch(event.request);
            if (!response.ok) {
              throw new Error("原始请求失败");
            }
            return corsResponse(response);
          } catch (error) {
            console.log("原始请求失败，返回404页面：", error.message);
            // 返回404页面
            response = await fetch(
              `${NPM_REGISTRY_BASE_URL}${packageName}/${blogVersion}/files/404.html.json`
            );
            return corsResponse(response);
          }
        }
      })()
    );
  }
});

self.addEventListener("terminate", (event) => {
  isDataFetched = false; // 重置数据获取标志
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "force-refresh") {
    // 执行刷新逻辑
    self.registration.update().then(() => {
      // 清理 IndexedDB
      cacheObject
        .delete("version")
        .then(function () {
          console.log("版本缓存清除");
        })
        .catch(function (err) {
          console.log(err);
        });

      // 清理旧的缓存
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
        })
        .then(() => {
          // 更新成功后，通过 postMessage 通知客户端
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => client.postMessage("sw-updated"));
          });
        });
    });
  }
});

// 处理CORS的函数
function corsResponse(response) {
  const headers = new Headers(response.headers);

  // 检查响应URL是否指向.html.json文件
  const isHtmlJson = response.url.endsWith("-html.json");
  if (isHtmlJson) {
    // 如果是.html.json文件，设置Content-Type为text/html
    headers.set("Content-Type", "text/html; charset=utf-8");
  }
  // 跨域
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    headers: headers,
  });
}
