---
title: "雷池 WAF 社区版安装 + Nginx 配置修改指南"
slug: "waf-install"
date: 2024-01-27T18:23:11+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "waf"
tags: ["waf"]
showSummary: true
summary: 记录长亭雷池 WAF 的安装方法，以及更改 Nginx 配置
---

2024 年第一篇文章的说，这篇文章写长亭雷池 WAF 的安装和更改 Nginx 配置

截至 2024/01/27 18:26 雷池 WAF 社区版只支持 Linux，所以本文所写的一切命令适用于 Linux

![image-20240127182708847](https://storage.yurl.eu.org/pumpkin/blogger/202401271827961.png)

## 安装

根据 [雷池 WAF 社区版文档][1]

我们使用如下的命令就可以安装：

```bash
bash -c "$(curl -fsSLk https://waf-ce.chaitin.cn/release/latest/setup.sh)"
```

另外两种命令参见社区版文档 - 上手指南 - 安装雷池

## 修改 Nginx 配置

对于部分应用，可能需要修改 Nginx.conf 配置

以 `Waline` 为例，使用 Nginx 反向代理时需要加入配置

```text
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header REMOTE-HOST $remote_addr;
```

我们连接上服务器

输入命令

```bash
cd /data/<雷池路径>(可以在安装的时候设置)/resources/nginx/custom_params
```

发现这里有很多 Backend 文件

![image-20240127183441615](https://storage.yurl.eu.org/pumpkin/blogger/202401271834642.png)

这里我们叫做 `backend_x`

我们打开 `backend_x`

在其中增加你所需要的配置，保存关闭

然后我们检查一下配置文件

```bash
docker exec safeline-tengine nginx -t
```

确保没有任何输出

最后应用

```bash
docker exec safeline-tengine nginx -s reload
```

[1]: https://waf-ce.chaitin.cn/docs/guide/install
