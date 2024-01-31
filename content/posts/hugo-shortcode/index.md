---
title: "Hugo Shortcodes"
slug: "hugo-shortcodes"
date: 2023-08-26T10:10:04+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "Shortcodes"
tags: ["Hugo", "Blog"]
gemini: true
showSummary: true
summary: 什么是 Shortcodes & 如何编写自己的 Shortcodes
---

## 什么是 Shortcodes

**Shortcodes（简码或短代码）** 是 **Hugo** 为了避免内容作者因为 **Markdown** 语法的不足而插入 **HTML** 到内容中所创建的

简单地说，**Shortcodes** 就好比 **Hexo** 中的 **外挂标签（Tag Plugins）**

我们可以随意的编写属于自己的 **Shortcodes**

## 如何使用 Shortcodes

你使用的 **Hugo Theme** 可能自带了一些 **Shortcodes**

通过翻阅主题文档，我们可以通过简短的语法在 **Markdown** 中使用这些 **Shortcodes**

### Shortcodes 的调用方式

我们可以通过

```go
{{</* shortcodename parameters */>}}
```



直接调用短代码

## Shortcodes 目录

编写 **Shortcodes** 就像编写 **Tag Plugins** 一样简单

我们首先需要了解 **Shortcodes** 目录

**Shortcodes** 目录位于 **~/layouts/** 下,我们可以通过创建 **HTML** 文件编写自己的 **Shortcodes**

了解完目录，我们就可以尝试编写自己的 **Shortcodes** 了

## 编写 Shortcodes

在  `~/layouts/shortcodes`  下新建一个 **HTML** 文件

**HTML** 文件的名称就是短代码的名称

譬如: 

* myShortcodes
* codeDemo

我们在 **Markdown** 中写作时就可以通过 `{{</* myShortcodes parameters */>}}` 的方式调用

现在我们将它命名为 **colorfont**

![image-20230826104235937](https://rmt.ladydaily.com/fetch/hajeekn/storage/202308261042959.png)

我们在里面写一段简单的 **HTML** 

让我们可以通过 `color=colorname` 的方式传参给 **Shortcodes**，所以我们使用  `{{ with .Get "color" }}`

![image-20230826104800765](https://rmt.ladydaily.com/fetch/hajeekn/storage/202308261048844.png)

接着，我们使用 **Shortcodes** 让文字变红，这时候，我们就需要使用 `{{ .Inner }}` 来获取我们传给 **Shortcodes** 的文字

![image-20230826105125474](https://rmt.ladydaily.com/fetch/hajeekn/storage/202308261051551.png)

这样我们就完成了一个简单的 **Shortcodes**

来试试效果吧！

在 **Markdown** 中使用 `{{</* colorfont color="red" */>}} Content {{</*/ colorfont */>}}` 来调用

{{< colorfont color="red" >}} Content {{</ colorfont >}}

看，成功了！

它还有更多用法，比如插入一个 **Emoji**

{{< emoji data="face_with_tongue_color" / >}}

我们还可以将它们融合在一起

{{< colorfont color="green" >}} 泰库拉！{{< emoji data="smiling_face_with_sunglasses_color" / >}}{{</ colorfont >}}

它还有许多的用法，就等各位去一一发掘了

{{< alert >}}
**警告!** 如果你想要自定义 **Shortcodes** 的样式，你应该在另外的 **CSS** 文件中书写样式，你不应该在 **Shortcodes** 文件中直接使用  `<style />` 语法，也不应该在 **Shortcodes** 中引入样式，那将会浪费不必要的流量
{{< /alert >}}

