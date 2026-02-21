---
title: "探索 | 使用 Cloudflare Worker + Vercel 无成本实现 AI 摘要"
slug: "qwen-summary"
date: 2024-08-31T19:35:38+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "ai"
tags: ["cloudflare", "vercel"]
gemini: true
showSummary: true
summary: 赛博活佛 Cloudflare😁
---

TianliGPT 已经出来好长一段时间了，无奈囊中羞涩，只好另寻他法

~~等孩子有钱了肯定大力支持😭~~

正好 Cloudflare Worker AI 已经有了经过量化的通义千问 14B 模型，并且还

是 Beta 测试，不消耗 Neurons，就折腾了 Qwen-Post-Summary，不过最初的一版有缺陷，浪费资源，这两天缝缝补补，做出来了一个完整版的摘要😁

{{< alert >}}
因为属于 Beta 测试，不消耗 Neurons，但是会计入 Worker 用量。缓存后也会计入 KV 用量
{{< /alert >}}

## 实现

用 Vercel 作为中间件，不让访客直接请求 Cloudflare，拉取完成后存入 KV。

项目：[FloatSheep/Qwen-Post-Summary][1]

### Cloudflare Worker AI 实现

复制 [worker.js][2] 中的内容，进入 Cloudflare，创建 Worker

![image-20240831194736813](https://7.isyangs.cn/55/66d302e00ebc9-55.png)

模板分类选择 AI，选择 **LLM App** 模板进行部署

![image-20240831194841205](https://7.isyangs.cn/55/66d303202ceb5-55.png)

创建完成后，点击右上角 **编辑代码**

并将复制的 `worker.js` 内容**粘贴**进去

如果有兴趣，可以看看提示词（系统消息），你想要 AI 如何做出摘要，以及风格、长短，都可以通过系统消息进行配置

完成后，点击右上角蓝色的部署，并复制 Cloudflare 提供的域名（**xxx.xxx.workers.dev**）

### Vercel 中间件实现

中间件其实就是起到中转和缓存的作用，我是用一个 `.ts` 文件实现的，具体实现在 `api/summary.ts` ~~不过代码有点太乱了，其实应该把可以提出来的函数放一边去~~

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFloatSheep%2FQwen-Post-Summary%2Ftree%2Fvercel&env=SUMMARY_API,PROXY_ENABLE&envDescription=SUMMARY_API%20%E4%B8%BA%20Cloudflare%20Worker%20%E6%89%80%E7%BB%99%E5%87%BA%E7%9A%84%E5%9F%9F%E5%90%8D%EF%BC%8CPROXY_ENABLE%20%E8%AF%B7%E5%A1%AB%E5%86%99%20false)

点击按钮进行部署

![image-20240831194459938](https://7.isyangs.cn/55/66d30242d5461-55.png)

看 Vercel 的提示填写就好了

关于这个 `PROXY_ENABLE`，是因为我本地调试的时候连不上 Worker🤣，必须开个代理，但是不知道为什么，条件判断里面的 ProxyAgent 把外面污染了（我部署的时候 `PROXY_ENABLE` 写的 false），导致 Vercel 请求全走 127.0.0.1（我 debug 了好久，最后还是朋友让输出详细日志才发现的😡），于是我把实现注释掉了。现在 `PROXY_ENABLE` 完全是废弃掉的状态😅

部署完成后，进入项目设置，绑定域名

{{< alert >}}
**绑定域名是非常重要的，因为 vercel.app 被 SNI 阻断 和 DNS 污染**

详见 [GitHub Discussions 803](https://github.com/orgs/vercel/discussions/803)

{{< /alert >}}

绑定完域名后添加 KV 储存，选择工具栏中的 `Storage`，创建一个数据库，类型为 KV

![image-20240831204154631](https://7.isyangs.cn/55/66d30f9a5b104-55.png)

名称随意，创建后进入 KV 设置界面，选择 `Projects`，并连接到你刚才部署的项目

![image-20240831204301648](https://7.isyangs.cn/55/66d30fdc97e95-55.png)

下拉框中即可选择

完成后进入设置，找到 `Read Regions` 设置，选择为 `sin1`

![image-20240831204358576](https://7.isyangs.cn/55/66d31015a00ad-55.png)

下拉框中即可选择

### 前端实现

我在项目的 `client` 文件夹中提供了简易的实现方式，我博客的实现方式在它的基础上~~抄袭~~借鉴了[無名大佬][3]的样式和内容

如果你有兴趣看我的~~屎山~~代码，可以前往 [FloatBlog / cfai.html][4]，实现非常简单

大佬们也可以自己根据 API 写前端实现😀

### API 接口

可以查看 [APIFox - Qwen Vercel Middle][5] 了解更多

[1]: <https://github.com/FloatSheep/Qwen-Post-Summary/tree/vercel>
[2]: <https://github.com/FloatSheep/Qwen-Post-Summary/blob/vercel/worker/worker.js>
[3]: <https://blog.imsyy.top>
[4]: <https://github.com/FloatSheep/FloatBlog/blob/main/layouts/partials/cfai.html>
[5]: <https://apifox.com/apidoc/shared-20d0a640-a6d3-40b2-87ba-fddfa1c10cc9>

