---
title: 适用于 Android™ 的 Windows 子系统 Magisk + LSPosed 指南
tags:
  - Windows11
  - Android
  - Magisk
categories:
  - Magisk
slug: android-windows-subsystem
showSummary: true
thumbnail: cover.svg
cover: cover.svg
date: 2022-06-25 19:10:05
Summary: 安卓子系统(Magisk)的指南
---

> ⚠ 更新于2022/12/28 19:28 注意,MagiskOnWSA 已经被 GitHub 封禁
>
> 如果有需要,可以尝试另一个项目 [PeterNjeim/MagiskOnWSA](https://github.com/PeterNjeim/MagiskOnWSA/releases/latest)
>
> 此 `repo` 已经禁止 `fork` 有需要可以使用 GitHub 的 import 导入

如题,这篇文章讲一讲 WSA 怎么样拥有 Magisk + LSPosed

## 构建并安装你自己的 WSA

https://github.com/LSPosed/MagiskOnWSA

这是 LSPosed 官方发布的 MagiskOnWSA 的 Actions

![image-20220625191348873](https://i0.hdslb.com/bfs/album/8c26df95d1d55da03b94d52f88bf562950e1f595.png)

进入后 Fork 仓库

Fork 完后进入 Actions

![image-20220625191437234](https://i0.hdslb.com/bfs/album/7ab66f2448d02ce0449196aab7df7ac7ce059d9d.png)

按钮点上

然后进入 `Build WSA` 这个 Workflow

运行 Workflow

要这样配置

![image-20220625191535713](https://i0.hdslb.com/bfs/album/c99cdec0fadaaad474c5b162751a10b98cea695b.png)

如果你要更改也是可以的

`Build arch` 代表构建的 WSA 版本,一般都是 x64

`WSA release type` 是 WSA 发布的通道,我一般选择`Slow`

`Magisk version` 是面具的版本,一般 `Stable` 就够用了,要尝鲜的可以用 `Beta` 或者 `Canary`

`Variants of gapps` 要选择 Pico,选其他的也可以,不过工作流结束完后会有提示,`OpenGapps` 不支持 Android 12

`Remove Amazon AppStore` 这个选 `remove` 就好,把亚马逊商店删掉

`Root solution` 选 `Magisk` / `None` 就不会 Root

选好之后点击 `Run Workflow`

运行好后进入 `Artifacts` 下载构建产物![image-20220625192106452](https://i0.hdslb.com/bfs/album/1d4f388eeb36e1fa822be14f537f18709802f851.png)

这里的 1.95 GB 是源文件大小,用我的配置下载下来差不多是 870 MB 左右

下载完后解压

运行 `Install.ps1`

![image-20220625192200710](https://i0.hdslb.com/bfs/album/e160d68152d371e91a7e611860d5cca8f60637e2.png)

等到部署完成

这里 WSA 就安装完成了

## 配置 WSA

打开 WSA 设置

先配置图形

![image-20220625192321117](https://i0.hdslb.com/bfs/album/9645173950d48ab71b861ef522e9ca9fe59a9e38.png)

> ⚠ Tips: Android 子系统目前 GPU 利用还不是很好,不要想着玩游戏

转到开发人员

打开开发人员模式

![image-20220625192428910](https://i0.hdslb.com/bfs/album/2549ea27822245bdd9bbd88488f932bc8533d7f8.png)

## 安装 ADB

[Android Platform Tools](https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn)

安装 ADB,解压到C盘

进入高级系统设置 -> 环境变量 -> Path

把 ADB 目录写进去![image-20220625192621523](https://i0.hdslb.com/bfs/album/2f75f209084d73027936dcc61ed56d31707ea627.png)

## 配置 Magisk

打开 Magisk

点击小齿轮

把`Systemless hosts`和`Zygisk`打开

![image-20220625192725927](https://i0.hdslb.com/bfs/album/9cdc91f8ea1f8b5418586015adc92f0a0338d072.png)

重启子系统

如果主页这样显示就 OK 了

![image-20220625192815258](https://i0.hdslb.com/bfs/album/0703670b18b07223bbe9425f00613183aaf51e4d.png)

## 安装 LSPosed 

[LSPosed Repo](https://github.com/LSPosed/LSPosed/)

下载最新的 `Release`中的 `Zygisk` 版本

放到一个位置,右键复制文件位置

进入 Terminal

连接到 WSA

```shell
adb connect 127.0.0.1:58526
```

然后上传文件

```shell
adb push 文件位置 /sdcard/
```

“文件位置” 记得替换成你自己的

打开 Magisk 中的模块

从本地安装

![image-20220625193313900](https://i0.hdslb.com/bfs/album/b19da1d0ac94e23e6c582bbd3fbe7a86f7d8c218.png)

选择 Pixel 5

点击刚上传的 LSPosed

![image-20220625193351560](https://i0.hdslb.com/bfs/album/c2ecbc06751b69fff99b757e7b968496f389a0ec.png)

等待安装完成即可

## 安装酷安

[CoolAPK](https://www.coolapk.com/)

下载酷安安装包

终端命令:

```shell
adb install <文件位置>
```

## 安装 MT管理器

打开酷安

搜索 MT管理器,下载并安装

## 安装 LSPosed Manager

打开 MT管理器,先授权超级用户权限

然后找到之前上传的 LSPosed 压缩包

右键长按并解压

![image-20220625193900539](https://i0.hdslb.com/bfs/album/d075d9b1d29ffcb6e7cb4972aeb1233337e7a2bb.png)

进入解压后的文件夹,找到 `Daemon.apk`

点击它,然后点击功能 - > 签名 -> V3

签名完成后安装 `Daemon_sign.apk`

接着找到 `Manager.apk`

安装它即可

![image-20220625194038174](https://i0.hdslb.com/bfs/album/e29760d8ef2c7fa2f6b3160f20b3c7b97d559cc0.png)

这样就安装完成了

## 怎样安装 Magisk / LSPosed 模块

先下载模块,用 `adb push <文件位置> /sdcard/` 上传,然后安装即可

#### LSPosed 模块安装方法

进入 MT管理器,找到上传的的模块(APK),安装他

然后进入 LSPosed Manager 启用即可
