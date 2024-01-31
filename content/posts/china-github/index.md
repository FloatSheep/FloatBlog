---
title: GitHub 的多种访问方式
sticky: 1
tags: [github, gfw]
showSummary: true
summary: GitHub 的多种开(访)车(问)方式
categories: [github]
cover: cover.svg
thumbnail: cover.svg
slug: china-github
gemini: true
date: 2022-05-14 7:53:12
copyright_author_href: https://blog.slqwq.cn
author: Hajeekn
---

我的博客即将同步至腾讯云开发者社区，邀请大家一同入驻：[https://cloud.tencent.com/developer/support-plan?invite_code=3gll8aqhc2kgg][1]

## Dev-Sidecar

> 请注意,由于开发者边车的 Gitee 仓库被封锁,所以这个项目不再更新了

**在使用之前,请观看知乎的一个讨论**
[如何评价《网络数据安全管理条例（征求意见稿）》第四十一条和第六十六条：建立数据跨境安全网关？](https://www.zhihu.com/question/498939985)

---

进入开发者边车的 [Release](https://github.com/docmirror/dev-sidecar/releases/latest)
找到符合自己系统的版本,点击下载
下载完成后安装,打开
![](https://api.hesiy.cn/api/cross?fetch=https://article.biliimg.com/bfs/article/5b9789a12b00527da35e3d1a2491d6a44eb6cb54.png)
系统代理建议不要开启
加速服务可以设置端口
![](https://api.hesiy.cn/api/cross?fetch=https://article.biliimg.com/bfs/article/8c0a8bd3a4040cfd77a6b6caafceecaa422edd4c.png)
其他的就没什么好设置的了,只需要把 NPM 加速和 Git 加速打开即可
But 因为这个软件已经停更了,所以我非常不建议各位用

## SwitchHosts + GitHub520

这个项目是以 Hosts 来加速的
首先去 SwitchHosts 的 [Release](https://github.com/oldj/SwitchHosts/releases/latest)
接着下载安装
SwitchHosts 这样配置即可
![](https://api.hesiy.cn/api/cross?fetch=https://article.biliimg.com/bfs/article/cac75497adfd2db6ca1cfe74d6caa1076852f9e9.jpg)如果遇到没有写入权限,就进入 Hosts 文件的属性,配置一下权限和去掉只读,玩 Windows 的应该都知道提权这东西吧

## Watt Toolkit

> ⚠ 更新: 2022/12/28 19:53 新版的 Watt Toolkit 已经去掉了 Socks 设置

[Watt Toolkit](https://steampp.net/)

下载安装没什么好说的

进入软件勾选上所有的加速选项,然后选择 `Hosts 加速模式` 即可
如果怕加速不了的话就勾上加速选项里的 `Socks5` 代理
然后配置一下

```bash
sudo git config --global http.proxy 'socks5://127.0.0.1:8868'
sudo git config --global https.proxy 'socks5://127.0.0.1:8868'
```

8868 记得替换成你自己的端口

## 题外话

加速 npm 还是 Dev-Sidecar 和 local-npm 好用一点

[1]: https://cloud.tencent.com/developer/support-plan?invite_code=3gll8aqhc2kgg

