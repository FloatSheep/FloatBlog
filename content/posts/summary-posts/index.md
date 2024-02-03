---
title: "为 Hugo 添加文章摘要"
slug: "summary-posts"
date: 2024-02-03T12:29:19+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "hugo"
tags: ["hugo"]
showSummary: true
gemini: true
summary: 为 Hugo 添加文章摘要
---

> 这篇文章适用于所有 Hugo 主题，对于不同的主题，你需要按需更改前端代码
>
> 对于 Hexo，你可以用 Tianli 的文章摘要

## 写这篇文章的原因？

看到木木的博客上更新了篇利用 Gemini Pro 添加摘要的文章，所以就折腾了一下

## 准备

需要这些东西

1. API 密钥（Gemini）
2. 一个合适的网络，因为会用到 GitHub、Google、Vercel、Cloudflare
3. 脑子

## 获取 Gemini Pro 的 API 密钥

[Google AI Studio][1]

访问之后选中左边的 **Get API Key** 选项卡，选择 **Create API Key in new project**

复制下来即可

## 部署 API Proxy

这里有两个选择，Netlify 和 Vercel

目前 Netlify 注册（似乎只针对 +86 区号）需要拍身份证上传，毕竟是个境外平台

本文以 Vercel 演示

[antergone/palm-proxy][2]

访问，复制仓库，Import 仓库为自己的，改个名字，完美

https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fantergone%2Fpalm-proxy

把这串链接的 **antergone** 和 **palm-proxy**改为你自己的用户名和仓库名，然后访问

## 部署 API 转换

我们需要把 **Google** 的 API 转换成 **OpenAI** 的 **API** 格式

[zuisong/gemini-openai-proxy][3]

进入 `dist` 目录，复制 **main_cloudflare-workers.mjs** 的内容，粘贴到新创建的 Cloudflare Worker 里面就行

然后修改一下内容，全局搜索 `BASE_URL` 把值改成你部署的 API Proxy

全局搜索 `apiKey` 把代码改成字符串，值写为你的 Gemini Pro API Key

自用设置（防盗链），全局搜索 `origin` 修改值为你的博客地址（可选）

## 前端代码

> 本节仅适用于 Hugo

进入博客根目录，进入文件夹 **layouts/partials**

新建 `gemini.html`

内容如下

```html
<div class="post-ai" onclick="geminiAI()">
  <img alt="Static Badge" src="/gemini.svg" />
</div>
<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .post-summary-result svg {
    animation: spin 1s infinite linear;
  }
  .post-summary-result {
    box-shadow: rgba(0, 0, 0, 0.05) 0 0 0 1px;
    background-color: var(--light-header);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    min-height: 3rem;
    max-width: 41rem;
  }
  .post-ai {
    margin-bottom: 1rem;
  }
</style>
<script>
  let postAI = document.querySelector(".post-ai");
  let postTile = document.getElementById("title").innerHTML; // 此处修改为你的博客 Title id
  let element-posts = `<div class="post-summary-result">加载中...</div>`;

  async function geminiAI() {
    // 尝试获取现有的摘要或错误信息元素并移除
    const existingResult = document.querySelector(".post-summary-result");
    if (existingResult) {
      existingResult.remove();
    } else {
      postAI.insertAdjacentHTML(
        "afterend",
        element-ai
      );
    }
    let GeminiFetch = "你部署的地址";

    try {
      let postAIResult = document.querySelector(".post-summary-result");
      let input = document.getElementById("posts-content").innerHTML; // 此处修改为你的博客内容 ID
      let inputHanzi = input
        .replace(/\n/g, "")
        .replace(/[ ]+/g, " ")
        .replace(/<pre>[\s\S]*?<\/pre>/g, "")
        .substring(0, 30000);
      let toAI = `"文章标题：${postTile}，具体内容：${inputHanzi}"`;
      const res = await fetch(GeminiFetch, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "gemini-pro",
          messages: [
            {
              role: "system",
              content: `You are a highly skilled AI trained in language comprehension and summarization. I want you to read the text separated by triple quotes and summarize it into a concise abstract paragraph. The aim is to retain the most important points and provide a coherent and readable summary that can help one understand the main points of discussion without having to read the entire text. Avoid unnecessary details or tangent points.
Just give me output and nothing else. Do not enclose responses in quotation marks. Answer in Chinese. You must read the whole article and make the most concise summary possible, which summarizes the content well.You should output the content in its entirety, not leave some behind, and when you are complete, you should issue the DONE command. `,
            },
            { role: "user", content: toAI },
          ],
          temperature: 0.7,
          stream: true,
        }),
      });
      const reader = res.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const text = new TextDecoder().decode(value);
        const match = text.match(/DONE/);
        if (!match) {
          const textJson = JSON.parse(text.substring(5));
          const resData = textJson.choices[0].delta.content;
          if (resData.length > 0) {
            postAIResult.textContent += resData;
          }
        }
      }
    } catch (error) {
      // 在 post-summary-result 元素内部显示错误信息
      let postAIResult = document.querySelector(".post-summary-result");
      postAIResult.innerHTML =
        '<div class="post-ai-error">生成摘要时出错，请重试。</div>';
      console.log(error);
    }
  }
</script>
```

参照注释修改即可

对于 Hugo 中文章 id 和标题 id 的获取方法，可以打开 F12，用鼠标指针定位文章内容元素和标题元素，记录下类，进入 **layouts/_default/single.html** 中修改这些地方，加入 `id="title"` 和 `id="posts-content"` 就好

然后添加 svg 徽章，这里是一个可以用的示例

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="121" height="20" role="img" aria-label="Gemini: 文章摘要"><title>Gemini: 文章摘要</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="121" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="66" height="20" fill="#555"/><rect x="66" width="55" height="20" fill="#007ec6"/><rect width="121" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><image x="5" y="3" width="14" height="14" xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im0yMS42NCAzLjY0bC0xLjI4LTEuMjhhMS4yMSAxLjIxIDAgMCAwLTEuNzIgMEwyLjM2IDE4LjY0YTEuMjEgMS4yMSAwIDAgMCAwIDEuNzJsMS4yOCAxLjI4YTEuMiAxLjIgMCAwIDAgMS43MiAwTDIxLjY0IDUuMzZhMS4yIDEuMiAwIDAgMCAwLTEuNzJNMTQgN2wzIDNNNSA2djRtMTQgNHY0TTEwIDJ2Mk03IDhIM20xOCA4aC00TTExIDNIOSIvPjwvc3ZnPg=="/><text aria-hidden="true" x="425" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="390">Gemini</text><text x="425" y="140" transform="scale(.1)" fill="#fff" textLength="390">Gemini</text><text aria-hidden="true" x="925" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="450">文章摘要</text><text x="925" y="140" transform="scale(.1)" fill="#fff" textLength="450">文章摘要</text></g></svg>
```

部署完成！



[1]: <https://makersuite.google.com/>
[2]: <https://github.com/antergone/palm-proxy>
[3]: <https://github.com/zuisong/gemini-openai-proxy>
