---
title: "探索 | 我只是想保存一个 Key！"
slug: "i-just-want-to-save-keys"
date: 2024-05-03T14:14:21+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "javascript"
tags: ["service worker"]
gemini: true
showSummary: true
summary: 在 Service Worker 中储存数据的探索
---

最近在写 [BlogOnNpm][1] 自动更新版本号功能的时候在储存数据方面遇到了个问题，就有了这篇文章

## 正文

如题，如何在 Service Worker 中储存数据？

当我们在写普通的 JavaScript 时，我们肯定会这样储存和读取数据：

```javascript
localStorage.setItem("Information", "Token BBB-BBB-BBB");
localStorage.getItem("Information");
```

这种方法是使用 `localStorage` 进行的数据储存和读取，这里是 MDN 对于 `localStorage` 的文档：

[Window.localStorage - Web API | MDN][2]

但如果我想要在 Service Worker 中进行数据的储存和读取，使用 `localStorage`，就会发生这样的事情

![](https://p.yurl.eu.org/i/2024/05/03/6634858478b2a.webp)

对，你没看错，`sw.js` 中会报 `localStorage is not defined`

根据 StackOverflow 上的帖子，为了安全，浏览器禁止从 `Web Worker` 进程（也就是 Service Worker 运行的进程）访问 `localStorage` 和 `sessionStorage`

但是我们还需要储存数据，要怎么办呢？

这就可以使用替代方案了

### 使用 Message Channel API & Broadcast Channel API 储存数据

这种方法本质上也是使用了 `localStorage`，但是和直接使用 `localStorage` 不同的是，这种方法是 Service Worker 将需要储存的数据发送到 `Window` 线程，在 `Window` 线程中进行数据的存储

这是 Message Channel API 和 Broadcast Channel API 的伪代码，可供参考（代码来自 StackOverflow）：

```javascript
// Message Channel API
 // include your worker
 var myWorker = new Worker('YourWorker.js'),
   data,
   changeData = function() {
     // save data to local storage
     localStorage.setItem('data', (new Date).getTime().toString());
     // get data from local storage
     data = localStorage.getItem('data');
     sendToWorker();
   },
   sendToWorker = function() {
     // send data to your worker
     myWorker.postMessage({
       data: data
     });
   };
 setInterval(changeData, 1000)
```

```javascript
// Broadcast Channel API

// sw.js
const channel4Broadcast = new BroadcastChannel('channel4');
channel4Broadcast.postMessage({key: value});

// Window
channel4Broadcast.onmessage = (event) => {
    value = event.data.key;
}
```

### 使用 IndexedDB 储存数据

[IndexedDB][4] 类似于 RDBMS，是一个基于 JavaScript 的面向对象数据库，用于在客户端存储大量的结构化数据

但是，直接使用 IndexedDB 会很复杂，所以我推荐使用 [localForage][3] 这个库简化操作

`localForage` 具有两种方法，回调 API 和 Promise，你可以根据需求自行选择

这里是一个简单的示例：

```javascript
// sw.js
self.importScripts("https://registry.npmmirror.com/localforage/1.10.0/files/dist/localforage.js");

self.addEventListener("fetch", (event) => {
  localforage.setItem("Information", "Token BBB-BBB-BBB").then(() => {
    localforage.getItem("Information").then((e) => {
      console.log(e);
    });
  });
});

```

输出结果如下：

![](https://p.yurl.eu.org/i/2024/05/03/66348cb7b8cf8.webp)

当然，`localforage` 还提供了无 Promise 版（同步函数），但是由于 Service Worker 基于 Promise 实现，所以 `localforage` 无法使用 `localStorage` 这类同步函数，因此，你获得的返回结果仍然为 Promise（因为 `Cache API` 和 `IndexedDB` 也是异步执行）

### 使用 Cache 储存数据

Service Worker 中的 [Cache][5] API 也可以用来储存数据，常规的 Cache 是用来缓存一些资源（比如 html），因此，如果你要直接使用 Cache API，**你需要把网络请求放入 Cache**

这是 MDN 的一段演示代码

```javascript
var cachedResponse = caches
  .match(event.request)
  .catch(function () {
    return fetch(event.request);
  })
  .then(function (response) {
    caches.open("v1").then(function (cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  })
  .catch(function () {
    return caches.match("/sw-test/gallery/myLittleVader.jpg");
  });
```

如果你需要用 Cache 储存键值，就需要一些特殊的方法，这里我们使用 ChenYFan 大佬的 [Cache-DB][6] 库来实现

这个库返回的仍然是 Promise，因此用法和 `localForage` 类似

这里是一段演示代码：

```javascript
// sw.js
self.importScripts('https://registry.npmmirror.com/@chenyfan/cache-db/1.1.3/files')

const mainCache = new CacheDB("mainCache", "mainPrefix", { auto: 1})

self.addEventListener("fetch", (event) => {{
  mainCache.write("information", "Token BBB-BBB-BBB").then(() => {
      mainCache.read("information").then((e) => {
          console.log(e);
      })
  });
)}

```

或者使用 await 替代 then

```javascript
// sw.js
self.importScripts('https://registry.npmmirror.com/@chenyfan/cache-db/1.1.3/files')

const mainCache = new CacheDB("mainCache", "mainPrefix", { auto: 1 })

await mainCache.write("information", "Token BBB-BBB-BBB");
await mainCache.read("information");
```

输出内容如下：

![](https://p.yurl.eu.org/i/2024/05/03/6634916f25945.webp)

![](https://p.yurl.eu.org/i/2024/05/03/663493b7ea38f.webp)

{{< heimu >}}在 ChenYFan 的墙裂推荐下{{< /heimu >}}[BlogOnNpm][1] 采用的是 Cache-DB 进行数据储存

这些是 Service Worker 进行数据储存的可行方法，可能还有更多


[1]: <https://github.com/FloatSheep/BlogOnNpm>
[2]: <https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage>
[3]: <https://github.com/localForage/localForage>
[4]: <https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API>
[5]: <https://developer.mozilla.org/zh-CN/docs/Web/API/Cache>
[6]: <https://github.com/CrazyCreativeDream/CacheDB>
