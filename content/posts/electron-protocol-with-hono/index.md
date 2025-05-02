---
title: "使用 Hono 简化 Electron 自定义协议处理"
slug: "electron-protocol-with-hono"
date: 2025-02-05T19:50:23+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "unless"
tags: ["Electron", "Hono"]
gemini: false
showSummary: true
summary: 看到 Electron 自定义协议的 handler 也是 Request/Response，便突发奇想🤓👆
---

## 前情提要

{{< alert >}}

阅读本文需要对 `Electron`、`Hono` 以及 `Service Worker` 等技术有一定了解

{{< /alert >}}

## 引入

开发 `Electron` 应用的都知道，在其模块 `protocol` 中提供了一个方法`protocol.registerSchemesAsPrivileged(customSchemes)` 用于自定义协议

而后，可以通过 `protocol.handle(scheme, handler)` [^1]对请求进行处理

本文所说的，即发生在 `handler` 中

## 正文

一般写法如下

```javascript
app.whenReady().then(() => {
  protocol.handle("app", (req) => {
    const { host, pathname } = new URL(req.url);
    if (host === "bundle") {
      if (pathname === "/") {
        return new Response("hello, world!"});
      }
    }
  });
});

```

熟悉 **Service Worker** 的都知道，在 SW 中也有一个 [FetchEvent][2]，用于拦截请求并自定义响应，其写法大致（省略部分代码）如下

```javascript
self.addEventListener("fetch", (event) => {
    event.respondWith(new Response("hello, world!"));
});

```

这样可能不能说明什么，但如果我们将响应提到 `handler` 中呢？

```javascript
const fetchHandler = () => {
	return new Response("hello, world!");
};

self.addEventListener("fetch", (event) => {
    event.respondWith(fetchHandler());
});

```

这时候，我们发现 `handler` 部分就和 `protocol.handle` 的 `handler` 一致了

既然它们很相像，那么 `Service Worker` 上的 `handler` 是不是也能给 `Electron` 用？

这时候，我突然想起 `Hono` 这个框架，它不也是 `handler` 么？

而且 `Hono` 用起来更加简洁，还支持链式路由，比写一大堆 `if-else` 好多了

于是，我就尝试用 `Hono` 来作为 `protocol.handle` 的 `handler`

### 尝试适配

理所当然，我们应该查看 `Hono` 文档中关于 [Service Worker 适配器][3] 的部分，文档中 `self.addEventListener('fetch', handle(app))` 的 `handle(app)` 就是 `handler` 了

定位到 `handle` 函数的来源：[src/adapter/service-worker/handler.ts][4]

其实最后就是传入了一个类型为 `Hono` 的对象 `app`，调用 `app.fetch()`

而 Hono 文档：[App - Hono - Hono][5] 的解释：「 `app.fetch` will be entry point of your application. 」也说明 `app.fetch` 就是我们需要的东西

所以，直接传入 **`Request`**[^2]就好了

......吗？

我们简单变换代码，并把 `Hono` 的逻辑移到 `protocolHandler.js` 中

```javascript
// main.js
import { app, protocol } from "electron";
import { protocolApp } from "./utils/protocolHandler.js";

app.whenReady().then(() => {
  protocol.handle("app", async (req) => {
      await protocolApp.fetch(req);
  });
});

// protocolHandler.js
import { Hono } from "hono";

const app = new Hono();

app.get("/bundle/", (c) => {
    return c.text("hello, world!");
});

export const protocolApp = app;

```

请求 `app://bundle/`，会发现得到 404，是 `Hono` 没生效吗？但是我们如果定义 `notFound`

```javascript
app.notFound((c) => {
  return c.text(`You're trying to get response from: ${c.req.path}, But it's undefined.`, 404);
});

```

会发现 `Hono` 已经成功处理了请求，但是为什么还是 404？

我们看看响应：`You're trying to get response from: //bundle/, But it's undefined.`

咦，路由怎么变成这样了，关键点在 `//bundle/`，我们想要访问 `app://bundle/` 能被 `Hono` 响应，那我们将路由修改为 `//bundle/` 呢？

发现 `Hono` 能够响应了，但是每次这样写路由也太阴间了，所以我们需要简化一下

通过输出日志判断，`Hono` 将 `macaron:` 删除，把 `//bundle/` 当作 `path`，因此，只需要指定 `Hono` 的工作路径（`basePath`）就可以解决

但 `basePath` 不能为 `/`，因为 `Hono` 默认路径就是 `/`，不知道为什么需要写阴间路由

不过我们可以指定 `basePath` 为 `//`

```javascript
const app = new Hono().basePath("//");

```

然后修改路由

```javascript
app.get('bundle/', async (c) => {
  return c.text('hello, world!');
});

```

请求，发现完美解决问题

又是麻烦的一天呢😡

## 参考

- [protocol | Electron](https://www.electronjs.org/zh/docs/latest/api/protocol)
- [Fetch Handler · Cloudflare Workers docs](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/)
- [FetchEvent - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FetchEvent)

[1]: <https://www.electronjs.org/zh/docs/latest/api/protocol#protocolhandlescheme-handler>
[2]: <https://developer.mozilla.org/zh-CN/docs/Web/API/FetchEvent>
[3]: <https://hono.dev/docs/getting-started/service-worker>
[4]: <https://github.com/honojs/hono/blob/main/src/adapter/service-worker/handler.ts>
[5]: <https://hono.dev/docs/api/hono#fetch>

[^1]: handler: https://developers.cloudflare.com/workers/runtime-apis/handlers/
[^2]: Request: https://developer.mozilla.org/zh-CN/docs/Web/API/Request
