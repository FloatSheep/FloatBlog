---
title: "记录一下捣鼓语雀文章同步到 Hexo 的过程"
slug: "yuque-sync-to-hexo"
date: 2020-01-20T18:36:07+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "yuque"
tags: ["hexo"]
gemini: true
showSummary: true
summary: 将语雀文章同步到 Hexo 时踩的坑
---

本文章首发于[语雀](https://www.yuque.com/ladjeek/ygg4q6) !

通过各种高科技功能同步到 [Hajeekn 的博客](https://blog.slqwq.cn/)

{{< alert "circle-info" >}}
本文章来源于 SL's Blog（本博客早期版本），仅作文章迁移处理

{{< /alert >}}

起初啦，我本来是想在语雀写文章同步到 Hexo 很方便。
可是呢？捣鼓的过程中踩了一系列的坑，这篇文章主要记录一下踩的那些坑

## 1. 文章 Cover 自动被转为链接格式

这个也是最头疼的事情
在我同步文章上去后，文章的 cover 地址全部亮亮的，起初我没注意，不过 GitHub Actions 编译静态文件的时候我注意到了。

**请大家注意看！**

在 cover 处，原本的

```
xxxx.com/xxx.png
```

变成了 `[]()` 格式，也就是说语雀平台把这个 cover 配置识别为了一串链接，导致 Hexo 同步下来时渲染失败了。

### 解决办法

在语雀内部点击这个被识别为链接的图片地址，选择删除链接 (最后一个) 即可

## 2. 写法错误

同步到语雀后 `front-matter` 格式和 Hexo 本地格式不是一样的。
也就是说本地和云端要放两套不同的模板 (建议还是把本地的数据备份一下到 OneDrive 之类的网盘)

### 解决办法

使用如下模板

```markdown
---
title: #文章标题
tags: [tag1, tag2]
categories: [cate1,cate2]
cover: #文章Cover
top_img: false #是否启用顶部大图
copyright_author_href: #作者网站
keywords: #关键字
description: #介绍
id: #第几篇文章
date: #编写日期
updated: #更新日期
---
```

