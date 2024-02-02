---
title: "追溯 | Blog 回忆录"
slug: "blogging-memories"
date: 2023-08-25T20:33:10+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "Deploy"
tags: ["Blog", "History"]
gemini: true
showSummary: true
summary: 告别以前，迎接未来
---

## 博客的开始

2019 年，我跟着互联网上的教程，使用 [Hexo][1] 搭建起了我的博客

当时的域名选用的还是 **Freenom** 的 `slblog.ga`

主题是 [hexo-theme-miho][2]

{{< figure
  src="https://rmt.ladydaily.com/fetch/hajeekn/storage/image-20230825164555898.png"
    caption="主题 Demo"
    >}}

后来博客文章慢慢变多，需求也随着扩大，基本的博客功能已经满足不了我了,于是开始了我的第一次换主题之旅

### 第一次更换主题

当时为了兼顾好看和功能多样,我在 [Hexo Themes][3] 上挑选了很久，最后看上了一款名为 [Butterfly][4] 的主题

> OS: 当时 Butterfly 的版本还是 **2.3.0**，现在 [Butterfly][4] 的版本已经迭代到 **4.9.0** 了，时间过的真快啊

{{< figure
  src="https://rmt.ladydaily.com/fetch/hajeekn/storage/image-20230825170541711.png"
    caption="主题 Demo"
    >}}

使用 [Butterfly][4] 的这段时间，我学会了一点 **HTML**、**CSS**、**JavaScript**

也知道怎么修改主题达到自己满意的效果了

记得当时看的第一篇修改主题的文章是小康的 《Hexo 魔改日记》

之后，我也学着修改主题，当时我做的{{< heimu >}}弱智{{< /heimu >}}操作包括但不限于: 

* 给全站的所有卡片添加毛玻璃样式（结果：导致风扇呼呼抱怨）
* 修改暗黑模式背景（结果：配色十分有一百分的不协调{{< heimu >}}看起来和老年人表情包的配色没什么两样{{< /heimu >}}）

### 第二次更换主题

这次更换主题主要是别的主题实在是太炫酷了

更换的主题叫 [Aurora][5]

{{< figure
  src="https://rmt.ladydaily.com/fetch/hajeekn/storage/image-20230825175857040.png"
    caption="主题 Demo"
    >}}

不过由于一些不可抗力因素{{< heimu >}}其实就是懒{{< /heimu >}}，这次换主题没有成功{{< emoji data="face_with_steam_from_nose_color" >}}{{< /emoji >}}

## 交叉路口

看到 [苏卡卡][6] 和 [宝硕][7] 都是 **Next.js**

我也不能闲着，于是找了个模板套了进去，顺便给它添加了友链的功能

{{< figure
  src="https://rmt.ladydaily.com/fetch/hajeekn/storage/202308251958607.png"
    caption="主页"
    >}}

{{< figure
  src="https://rmt.ladydaily.com/fetch/hajeekn/storage/202308251959147.png"
    caption="友链页面"
    >}}

后来因为维护太麻烦了{{< heimu >}}主要是 React 让我头疼，加上我的技术栈不是 React{{< /heimu >}}于是果断抛弃

## 安稳之路

最后我选择了 [Hugo][8] 作为 [Hexo][1] 的替代品

为什么选择 [Hugo][8] 作为 [Hexo][1] 的替代品:

1. Fast - 快,推送之后秒部署
2. Diverse - Go 模板语法
3. Simple - 主题源码可以通过新建 **HTML** 进行修改
4. Convenient - **Hugo Module** 让我们需要修改主题某处只需本地新建对应的文件即可,无需克隆整个仓库,也无需担心无法 **Pull**

{{< heimu >}}编不下去了 ＞︿＜{{< /heimu >}}

在选择了 [Hugo][8] 之后,我用了 [Congo][9] 作为博客主题

{{< figure
  src="https://rmt.ladydaily.com/fetch/hajeekn/storage/202308252020632.png"
    caption="主题 Demo"
    >}}

也许之后还会换上其他的构建工具,

也许会一直保持这样{{< emoji data="face_with_tongue_color" >}}{{< /emoji >}}

[1]: https://hexo.io
[2]: https://github.com/WongMinHo/hexo-theme-miho
[3]: https://hexo.io/themes/
[4]:  https://github.com/jerryc127/hexo-theme-butterfly
[5]: https://github.com/auroral-ui/hexo-theme-aurora
[6]: https://skk.moe
[7]: https://baoshuo.ren
[8]: https://gohugo.io
[9]: https://github.com/jpanther/congo



