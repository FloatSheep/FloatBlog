self.importScripts("/js/cache-db.min.js");

let blogVersion = "";
let checkJson = {};
let isDataFetched = false;

const NPM_REGISTRY_BASE_URL = "https://registry.npmmirror.com/";
const packageName = "@floatsheep/fsl-blog"; // 博客包名，根据实际情况替换
const blogDomain = "blog.hesiy.cn"; // 博客域名，根据实际情况替换
const localMode = true; // 本地模式标志，设置为true时将忽略域名检查

const cacheObject = new CacheDB("ServiceStorage", "objectPrefix", { auto: 1 });

// Cache-DB used(the result of ai generated)
async function cacheOperation(newVersion) {
  async function initializeCacheDB() {
    try {
      await cacheObject.write("initCheck", "initialized");
    } catch (error) {
      console.error("初始化缓存数据库时发生错误:", error);
    }
  }

  async function checkAndInitializeVersionKey() {
    try {
      // 明确尝试读取version，期望它抛出错误以表明version不存在
      let versionExists = await cacheObject.read("version");
      if (versionExists === null || versionExists === undefined) {
        throw new Error("Version key not found.");
      }
    } catch (error) {
      console.log("version键不存在，将进行初始化...");
      try {
        await cacheObject.write("version", newVersion);
        console.log("Version 初始化成功。");
      } catch (err) {
        console.error("初始化version键时发生错误:", err);
      }
    }
  }

  await initializeCacheDB();
  await checkAndInitializeVersionKey();

  try {
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
    console.error("在执行 cacheOperation 时发生错误:", error);
    return false;
  }
}

function checkUpdate(data) {
  // 定义一个 checkUpdate 函数
  const latestVersion = data["dist-tags"].latest; // 从传入参数：data 数组的 dist-tags 中读取 latest 值

  cacheOperation(latestVersion) // 调用 cacheOperation 进行 IndexedDB 的更新操作
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

function getNewestData() {
  // 获得最新的版本信息
  const checkURL = `${NPM_REGISTRY_BASE_URL}${packageName}`; // 拼接 API 字符串
  self
    .fetch(checkURL)
    .then((response) => response.json())
    .then((data) => checkUpdate(data)) // 将请求返回的数据：data 传给 checkUpdate 函数
    .catch((error) => console.error("Fetch 更新信息失败:", error));
}

function fetchNewestDataIfNeeded() {
  if (!isDataFetched) {
    getNewestData();
    isDataFetched = true; // 标记为已获取数据
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      fetchNewestDataIfNeeded();
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
      fetch(npmPath)
        .then((response) => {
          if (!response.ok) {
            // 如果第一个请求不成功，则尝试原始请求
            throw new Error(
              `NPM Mirror 响应出现问题, 状态码返回：${response.status}`
            );
          }
          return corsResponse(response);
        })
        .catch((error) => {
          console.log(
            "从 NPM Mirror 获取数据失败，退回到原请求：",
            error.message
          );
          return fetch(event.request)
            .then((response) => {
              if (!response.ok) {
                // 如果原始请求也不成功，返回404页面
                throw new Error("原始请求失败");
              }
              return corsResponse(response);
            })
            .catch((error) => {
              console.log("原始请求失败，返回404页面：", error.message);
              // 返回404页面
              return fetch(
                `${NPM_REGISTRY_BASE_URL}${packageName}/${blogVersion}/files/404.html.json`
              ).then((response) => corsResponse(response));
            });
        })
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
