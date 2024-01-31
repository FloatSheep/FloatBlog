const NPM_REGISTRY_BASE_URL = "https://registry.npmmirror.com/";
const packageName = "fsl-blog"; // npm包名，根据实际情况替换
const blogDomain = "blog.hesiy.cn"; // 博客域名，根据实际情况替换
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

  // 检查请求的 Accept 头部是否为 EventSource 的 MIME 类型
  const isEventSource = event.request.headers.get('Accept') === 'text/event-stream';

  // 不拦截 EventSource 请求
  if (isEventSource) {
    // 如果是 EventSource 请求则不拦截，让浏览器直接处理
    return;
  }

  // 判断当前是否处于本地开发模式或者请求的域名是否为博客域名
  const shouldIntercept = localMode || url.hostname === blogDomain;

  // 判断请求是否需要通过NPM镜像获取且不是对Service Worker本身的请求
  const shouldHandleFetch =
    shouldIntercept &&
    url.origin === self.location.origin &&
    !url.pathname.includes("sw.js");

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
  }
  // 不需要else，因为我们不打算使用event.respondWith()
});

// 处理CORS的函数
function corsResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*"); // 在生产环境中，这个值应该设为特定的来源而非通配符 "*"
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    headers: headers,
  });
}