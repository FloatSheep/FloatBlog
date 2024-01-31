const NPM_REGISTRY_BASE_URL = "https://registry.npmmirror.com/";
const packageName = "packageName"; // npm包名，根据实际情况替换
const blogDomain = "blog.example.com"; // 博客域名，根据实际情况替换
const blogVersion = "latest"; // 博客版本，根据实际情况替换
const localMode = false; // 本地模式标志，设置为true时将忽略域名检查

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
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

    const npmPath = `${NPM_REGISTRY_BASE_URL}${packageName}/${blogVersion}/files${relPath}`;

    event.respondWith(
      fetch(npmPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("NPM mirror response not ok.");
          }
          return corsResponse(response);
        })
        .catch((error) => {
          console.error("Failed to fetch from NPM mirror:", error.message);
          return fetch(event.request); // 如果失败，则回退到原始请求
        })
    );
  } else {
    // 对于不符合条件的请求，保持原样不做处理，实现透明代理
    return fetch(event.request);
  }
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
