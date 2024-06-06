---
title: "Windhawk 的简单逆向"
slug: "simple-inverse-of-windhawk"
date: 2024-06-06T14:42:35+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "inverse"
tags: ["inverse & analysis"]
gemini: true
showSummary: true
summary: 记一次对 Windhawk 的简单逆向
---

在使用 Windhawk[^1] 的时候对它产生了好奇，于是就有了这篇文章

> Windhawk 的源码是完全开源的，可以在 [ramensoftware/windhawk][1] 中查看源码

进入它的目录，我们可以看到结构如下

![image-20240606145629659](https://p.yurl.eu.org/i/2024/06/06/66615d9b8b6df.webp)

很好理解

```json
{
    "meanings": {
        "Compiler": "编译器",
        "Engine": "引擎（Windhawk 功能的核心）",
        "UI": "Windhawk 的 GUI",
        "windhawk.exe": "Windhawk 的主程序"
    },
    "functions": {
        "Compiler": "对编写好的功能模块进行编译",
        "Engine": "用于将编译好的模块注入进目标程序的引擎",
        "UI": "安装、编写模组",
        "windhawk.exe": "驻留后台、拉起 GUI 进程"
    }
}
```

## UI 界面的简单逆向

打开任务管理器（GUI 打开时），会发现在前台进程中出现了 `VSCodium`

![image-20240606150518346](https://p.yurl.eu.org/i/2024/06/06/66615fa553fce.webp)

右键打开文件所在位置，会发现进入了 `Windhawk` 的 `UI` 目录

其中，`VSCodium.exe` 就是 `Windhawk` 的 `UI` 程序

双击运行，我们会发现直接进入了 `VSCodium` 的主界面

![image-20240606150655653](https://p.yurl.eu.org/i/2024/06/06/66616006a7289.webp)

同时，右下角出现了提示。提示的大概意思是说，我们用了错误的方式打开了 `UI` 进程（`VSCode` 直接启动了）

于是，我写了个 `Rust` 来查看它的启动参数，代码如下

```rust
use std::env;
use std::io;
use std::io::prelude::*;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("接收到的命令行参数：{:?}", args);

    let command_line = format!("{}", args.join(" "));
    println!("命令行调用方式：{}", command_line);

    println!("按任意键退出...");
    let _ = io::stdout().flush();
    io::stdin().read(&mut [0u8]).unwrap();
}
```

我们将其放入 `UI` 目录并将名字改为 `VSCodium.exe`（记得备份原程序）然后再次唤起 `UI` 进程，发现命令行调用如下

![image-20240606151107349](https://p.yurl.eu.org/i/2024/06/06/66616102570b5.webp)

也就是说，这个程序是通过 `C:\Program Files\Windhawk\UI\VSCodium.exe C:\ProgramData\Windhawk\EditorWorkspace --locale=en --no-sandbox --disable-gpu-sandbox` 启动的

我们在终端中通过这个命令启动

![image-20240606151257436](https://p.yurl.eu.org/i/2024/06/06/66616170826e5.webp)

？为什么还是报`VSCode` 直接启动了 :thinking_face_color:

简单分析一下，这个 `UI` 进程是通过 `windhawk.exe` 拉起的，也许需要我们伪装一下？不过在我的测试中要么是无法启动，要么是报错

### 前端架构

通过在 `Windhawk` 的 `UI` 进程中使用公开方法打开 Developer Tools，我们发现，`UI` 使用的是 `Ant Design`

![image-20240606155704306](https://p.yurl.eu.org/i/2024/06/06/66616bc75926f.webp)

顺带提一嘴，第一行的注释内容如下 :rolling_on_the_floor_laughing_color:

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
```

## Engine 的简单逆向

通过对 `windhawk.dll` 的反编译，我们了解到，这个动态链接库是 `Windhawk` 需要使用的一些钩子

![image-20240606160315337](https://p.yurl.eu.org/i/2024/06/06/66616d3a4858c.webp)

当然啦，这个动态链接库是不能通过 `rundll32` 启动（main entry）的

[1]: <https://github.com/ramensoftware/windhawk>

[^1]: Windows 下的自定义功能模组平台
