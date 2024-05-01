self.importScripts("/js/localforage.min.js");

let blogVersion = "";
let checkJson = {};
let isDataFetched = false;

const NPM_REGISTRY_BASE_URL = "https://registry.npmmirror.com/";
const packageName = "fsl-blog"; // 博客包名，根据实际情况替换
const blogDomain = "blog.hesiy.cn"; // 博客域名，根据实际情况替换
const localMode = false; // 本地模式标志，设置为true时将忽略域名检查

// 检查版本并更新
function storageOperation(newVersion) {
  // 定义 storageOperation 函数
  return localforage
    .getItem("version")
    .then((nowVersion) => {
      // 通过 localforage 操作 IndexedDB
      if (!nowVersion || nowVersion !== newVersion) {
        // 条件判断 最新版本不存在 & 当前版本不等于传入参数：newVersion
        return localforage.setItem("version", newVersion).then(() => {
          // 调用 localforage 更新 IndexedDB 中的值并回调
          console.log(`版本已更新到：${newVersion}`);
          return true; // 表示有新的版本更新
        });
      } else {
        console.log("当前是最新版本");
        return false; // 表示当前版本已是最新，无需更新
      }
    })
    .catch((error) => {
      console.error("获取或设置版本信息时出现错误:", error);
      throw error; // 抛出错误
    });
}

function checkUpdate(data) {
  // 定义一个 checkUpdate 函数
  const latestVersion = data["dist-tags"].latest; // 从传入参数：data 数组的 dist-tags 中读取 latest 值

  storageOperation(latestVersion) // 调用 storageOperation 进行 IndexedDB 的更新操作
    .then((isUpdated) => {
      if (isUpdated) {
        // 如果 storageOperation(data) 比对并进行了版本修改
        console.log("博客缓存版本已更新");
      } else {
        // 如果 storageOperation(data) 无操作
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

    // 处理版本信息
    localforage
      .getItem("version")
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
            throw new Error("NPM Mirror 响应出现问题：范围脱离 200 ~ 299");
          }
          return corsResponse(response);
        })
        .catch((error) => {
          console.log(
            "从 NPM Mirror 获取数据失败，退回到原请求：",
            error.message
          );
          return fetch(event.request); // 如果失败，则回退到原始请求
        })
    );
  } else {
    // 对于不符合条件的请求，保持原样不做处理
    return fetch(event.request);
  }
});

self.addEventListener("terminate", (event) => {
  isDataFetched = false; // 重置数据获取标志
});

// 处理CORS的函数
function corsResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    headers: headers,
  });
}
