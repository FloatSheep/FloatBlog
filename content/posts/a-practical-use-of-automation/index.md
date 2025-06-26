---
title: "笔记 | 用自动化克服我的懒惰"
slug: "a-practical-use-of-automation"
date: 2025-06-26T18:14:23+08:00
cover:
thumbnail:
draft: false
categories: "automatic"
tags: ["automatic"]
gemini: true
showSummary: true
summary: 为了和不想起床的懒惰抗衡，使用自动化程序成为了我的选择
---

## 起因

其实在中考前我就规划了暑假，但是一放假，我就会因为懒癌晚期而不想起床，这就打乱了我的计划

## 采用方法

由于我的问题是不能够起床，因此我选择了醒来后锁机的方式

{{< alert "sun" >}}
将醒来作为条件，是因为我的穿戴设备（Xiaomi Watch S1）可以提供准确的苏醒时间，而我每次醒来后第一时间就会拿手机
{{< /alert >}}

当然，还有一种方法是将手机放在房间外面，但是这对于我来说做不到😭😭

根据我的需求，很容易选择以下组合

- `MacroDroid` 实现自动化，清醒状态进行锁机操作
- `自律锁机` 作为锁机工具，就不需要重复造轮子了

考虑到 `自律锁机` 没有提供外部调用锁机的方法（当然也可能是我没发现），所以我决定用 Shell 脚本实现

## 实现

### 获取所需的 Activity

因为我这里的 `MacroDroid` 直接使用内置方法打开应用程序会出问题，所以我选择用 Shell 调用 Activity

`MT 管理器` 提供了 **Activity 记录** 功能

启动服务，然后进入锁机工具，再返回 `MT 管理器`，这里就会将我需要的 Activity 显示出来

### 获取控件位置

有了 Activity 还不够，我还需要获取锁机按钮的位置

因为锁机工具的锁机要分两步（锁机 -> 确定），所以我要获取两个控件位置

通过 `uiautomator` 就可以轻松完成

进入 `Termux` 并切换到 root 用户，将其挂在小窗

进入锁机工具后在 `Termux` 中输入 `uiautomator dump /sdcard/ui.xml`，将屏幕 UI 结构导出为 xml 文件

进入文件，搜索关键词 **锁机**，找到 `bounds`，这一项记录了控件的对角线坐标，其格式为 <code>[x<sub>1</sub>,y<sub>1</sub>] [x<sub>2</sub>,y<sub>2</sub>]</code>，使用简单的数学运算就可以得到控件的点击位置

{{< katex >}}
$$
x = \frac{(x_1+x_2)}{2}
$$
$$
y = \frac{(y_1+y_2)}{2}
$$

计算后坐标 (\\(x,y\\)) 即为需要的点击坐标

同理，确定控件的点击位置获取方法如上

{{< alert "circle-info" >}}
非 root 情况下，可以使用 `adb` 执行对应命令

除此之外，`getevent -l` 也可以用来获取点击坐标

{{< /alert >}}

### 编辑 MacroDroid（动作）

触发器略

首先需要启动应用，在 `MacroDroid` 中添加动作 `Shell 脚本`，选择 **已 Root**（非 root 选择 **Shizuku**），在其中输入 `am start -n com.lwtsj.locks/.Mainpoi` 并勾选 **完成后才能继续动作**

再次，添加动作 `等待 1 秒`，避免应用未加载完全时进行操作

然后点击 **锁机**，添加动作 `Shell 脚本`，配置相同，输入 `input tap x y`

接着点击 **确定**，添加动作 `Shell 脚本`，配置相同，输入 `input tap x y`

完成后点击右上角三点，选择测试动作，成功锁机即为成功
