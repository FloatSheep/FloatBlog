---
title: 小记 | Electron + Vue + Mdui
sticky: 1
tags:
  - electron
categories:
  - electron
slug: electron-vue-mdui
date: 2022-07-22 16:23:03
thumbnail: cover.svg
gemini: true
summary: 将 Electron 集成到 Vue 项目中的指南
showSummary: true
---
文章迁移计划，样式可能出错

> 开始前注意,这是将 Electron 集成到 Vue 项目中的演示,如果你没有基础,建议使用[样板代码](https://github.com/SimulatedGREG/electron-vue)

## Part 0.1: 什么是 Electron

**Electron 可以让你使用纯 JavaScript 调用丰富的原生 APIs 来创造桌面应用。**你可以把它看作一个专注于桌面应用的 Node.js 的变体，而不是 Web 服务器。

这不意味着 Electron 是绑定了 GUI 库的 JavaScript。相反，Electron 使用 web 页面作为它的GUI，**所以你能把它看作成一个被 JavaScript 控制的，精简版的 Chromium 浏览器。**

## Part 0.5: 先决条件

- [x] 良好的网络

## Part 1: 安装 Node.js

**Electron 是基于 Node.js 构建的** / 并且使用 Node.js 还能完成平时 Web 程序所做不到的事情: `与系统打交道`

[Node.js](https://nodejs.org/)

进入上述地址下载并安装 Node.js

## Part 2: 安装 Vue-cli

由于我更喜欢 Vue,所以我选择用 Vue 创建项目

```bash
$ npm install @vue/cli --global
```

安装 `vue-cli`

## Part 3: 创建项目

```bash
$ vue create electron-vue-mdui
```

创建自己的项目

![image-20220722164718559](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/c059674e13fba60852652ed9c48c1c52fe95cc63.png)

这里选择最后一项(Manually select features)

![image-20220722164803927](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/d6078ce2c01f0c180ca9d7a1c32f47c271ea0071.png)

这里依照自己的需要,我选择了 Babel(语法编译器) | Router(Vue 路由) | CSS Pre-processors(CSS预处理器) Linter / Formatter(代码风格、格式校验)

![image-20220722164939866](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/678861d38a4bf074dae2925aef1364f51342badc.png)

这一步选择 3.x(或更高版本)

![image-20220722165006031](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/6cddc5515bcc6b84457abb099d24a03db8032e3c.png)

History 模式选择 `Y` 

![image-20220722165039090](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/8324dcb626a202b1e3374280197ca9d378be4b10.png)

CSS 预处理器我更喜欢 Stlyus, 这里依照自己的喜好选择

![image-20220722165120215](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/5358d1dc61a13dd9734947d2ba923c9cf1ef1fe4.png)

这里墙裂建议使用 ESLint

我选择的是 ESLint + Prettier

![image-20220722165200782](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/98c501aa53b8a0856b7e6db9c71ae71f01c98c27.png)

在这一步建议两个都选择

![image-20220722165233900](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/994a084bcb79e8409741914c30237611b5ad45df.png)

这一步我们选择单独放置在文件夹下

![image-20220722165254250](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/971f5038fc1d36d7f2d4e7439ca40f6bd8082e26.png)

然后这里是最后一步,让你选择下一次是否要用同样的配置, 我选择的是 `N`

等待安装完成就创建好了一个 `Vue 项目`

## Part4: 集成 Electron 至 Vue 项目中

进入项目文件夹,打开终端

安装 electron 插件

```bash
$ vue add vue-cli-plugin-electron-builder
```

版本选择 `^13.0.0` 就可

等待它安装完成,在安装的过程中它会重构项目架构

等到安装完成你就拥有了一个 Electron + Vue 的 App

运行 Electron 试试看吧!

```bash
$ yarn electron:serve
```

如果弹出一个程序就成功了

## Part 5: 用 MDUI 写前端

[MDUI - Material Design 样式的前端框架](https://www.mdui.org/)

> **MDUI 漂亮、轻量且好用，它能让你更轻松地开发 Material Design 网页应用**

首先安装它

```bash
$ yarn add mdui
```

然后我们需要引用它

编辑入口文件

加入一些代码

```javascript
import mdui from 'mdui';
import '../vendor/mdui/css/mdui.css'; // 注意修改 css 文件的路径
```

> **在其他需要使用 MDUI 提供的 api 的 JS 文件头部导入 mdui 的 JS 文件** (来自 MDUI 作者)

然后 MDUI 就已经添加进你的项目了,接下来只需要简单写一下,就可以让你的项目使用上 MDUI

比如添加一个按钮

```html
<button @onclick="javascript;;" class="mdui-btn mdui-color-teal mdui-ripple">button</button>
```

或者一个导航栏

```html
    <div class="mdui-toolbar mdui-color-teal">
      <a href="javascript:;" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">menu</i>
      </a>
      <span class="mdui-typo-title">Test App</span>
      <div class="mdui-toolbar-spacer"></div>
      <a href="javascript:;" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">search</i>
      </a>
      <a href="window.onload();" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">refresh</i>
      </a>
      <a href="javascript:;" class="mdui-btn mdui-btn-icon">
        <i class="mdui-icon material-icons">more_vert</i>
      </a>
    </div>
```

(代码从 VSCODE 编辑)

![image-20220722171245373](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/f144fbad397951d3d16febc560ff4fe3e013e3ed.png)

## Part 6: 打包

在终端内输入打包命令进行打包

```bash
$ yarn electron:build
```

> 请注意,在打包过程中需要下载一些文件,但由于天朝网络特性,可能会 timeout,请自行替换源或使用科学上网

