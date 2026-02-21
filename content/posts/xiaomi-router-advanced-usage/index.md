---
title: "探索 | 小米路由器 - 高级玩法"
slug: "xiaomi-router-advanced-usage"
date: 2024-08-13T20:11:47+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "docker"
tags: ["router"]
gemini: true
showSummary: true
summary: 发现了一些很新奇的东西（？
---

最近折腾 AX9000 的时候发现了一些奇奇怪怪的玩法，记录一下

## 打开 SSH 的新方式

传统的 SSH 开启方法大致如下：

1. 利用 `xqsystem.lua` 进行注入
   1. 这种方法本质上是利用了小米路由器的中继功能，将 OpenWrt 作为小米路由器的上级路由，利用 `xqsystem.lua` 远程执行 SSH 开启命令
2. 利用 `telnet` 开启 SSH
   1. 这种方法需要恢复出厂设置，在控制台插入脚本获取修补后 `bdata` 分区，刷入分区开启 `telnet` 然后执行 SSH 开启指令
3. 利用开发版的 Docker 功能开启 SSH
   1. 这种方法在 Docker Hub 被墙之前最简单，但被墙之后就无法做到了

最近在恩山看到了[一篇文章][1]，是利用 CVE-2023-26319 实现的，通过米家智能场景控制器（`xqsmartcontroller`）来打开 SSH，在所有**支持米家智能场景控制器且未修复漏洞**的固件上都可以用这种方式开启 SSH

不过一个个输命令有点麻烦，我写了一个[简单版的脚本][2]

在路由器后台登录后，按下 F12 打开开发者工具，选择控制台并把代码粘贴进去即可

### 原理

米家智能场景控制器中的 `mac` 没有进行过滤，并且这个参数是**直接由用户控制的**，会直接传递给 `run_cmd`，因此可以在智能场景的 `action_list[0].payload.mac` 中使用 `;<Command>;#` 进行注入，并调用 `scene_start_by_crontab` 执行智能场景

打开完 SSH 后，就可以编辑 Docker 守护进程文件来换源和部署容器了

SSH 密码可以在 https://miwifi.dev/ssh 进行计算

{{< alert >}}
需要注意的是，在小米路由器中，启动 Docker 服务需要使用 `/etc/init.d/mi_docker start`
{{< /alert >}}

## 美化路由管理后台

这里使用 WinSCP 演示

使用 root 连接路由器后，进入 `/www`，此处存放着小米路由器后台管理界面的 HTML 文件，我们可以下载下来在本地美化后上传

![image-20240814133505984](https://7.isyangs.cn/55/66bd92775278e-55.png)

![image-20240814133539171](https://7.isyangs.cn/55/66bd9280a4396-55.png)



[1]: <https://www.right.com.cn/forum/thread-8348455-1-1.html>
[2]: <https://gist.github.com/FloatSheep/018506818ec01cc840dd7ab45fe4abd9>
