---
title: "技巧 ++ | 巧妙绕过 Referer 限制"
slug: "referer-skip"
date: 2024-01-30T18:56:27+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "hello"
tags: ["hello world"]
showSummary: true
summary: 用一种很巧妙的方法绕过 Referer 限制
---

> 本文代码实现以图片为例

Referer 限制，老生常谈了，也就是防盗链

对于如何绕过这个东西，目前最好的方式估计是写一个 API 代替请求，毕竟 Service Worker 不能修改 Referer，浏览器也限制了 JavaScript 对 Referer 进行修改，所以我们可以用一个 API 代替请求

## 确定实现目标

1. 接受请求参数
2. 提取请求参数中的 url 和所需要的 referer
3. 对 url 进行请求
4. 将请求后的内容返回前端

## 实现

我们首先造出一个简单的事件处理程序

```javascript
import https from 'https';

export default async function handler(request, response) {
  const { fetch: fetchUrl } = request.query;

    response.setHeader('Content-Type', 'text/plain');
    response.send(fetchUrl);
    response.statusCode = 200;
}
```



![image-20240130192002831](https://storage.yurl.eu.org/pumpkin/blogger/202401301920918.png)

已经给我们返回了我们所请求的值，那么接下来请求这个值，然后返回请求的结果

将代码稍作更改

```javascript
  try {
    https.get(fetchUrl);

    response.setHeader("Content-Type", "application/json");
    response.json({ status: "ojbk" });
  } catch (error) {
    response.setHeader("Content-Type", "application/json");
    response.json({ error: error.message });
    response.statusCode = 500;
  }
```

![image-20240130192838766](https://storage.yurl.eu.org/pumpkin/blogger/202401301928837.png)

接着我们让它返回请求的数据 

```javascript
  try {
    const responseData = await new Promise((resolve, reject) => {
      https
        .get(fetchUrl, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resolve(data);
          });
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    response.setHeader("Content-Type", "application/json");
    response.send(responseData);
  } catch (error) {
    response.setHeader("Content-Type", "application/json");
    response.json({ error: error.message });
    response.statusCode = 500;
  }
```

![image-20240130193549946](https://storage.yurl.eu.org/pumpkin/blogger/202401301935048.png)

然后我们加上 referer 设定

把请求改成这样就行

```javascript
const options = {
    headers: {
        "Referer": "https://blog.hesiy.cn/"
    }
}

https.get(fetchUrl, options, (res) => {
    ...
})
```

然后我们请求一张图片看看吧

![image-20240130194040084](https://storage.yurl.eu.org/pumpkin/blogger/202401301940173.png)

返回了一堆乱码就算成功了

接着我们针对图片进行一下优化

```javascript
import https from 'https';

export default async function handler(request, response) {
  const { fetch: imageUrl } = request.query;

  if (!imageUrl) {
    return response.status(400).json({ error: 'No image URL provided' });
  }

  const options = {
    headers: {
      'Referer': 'https://blog.hesiy.cn'
    }
  };

  try {
    https.get(imageUrl, options, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        return response.status(res.statusCode).json({ error: '你请求个屁' });
      }

      response.setHeader('Content-Type', res.headers['content-type']);

      res.pipe(response);
    }).on('error', (error) => {
      response.status(500).json({ error: error.message });
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
```

![image-20240130194336097](https://storage.yurl.eu.org/pumpkin/blogger/202401301943182.png)

好了，收工~ :smiling_face_color:
