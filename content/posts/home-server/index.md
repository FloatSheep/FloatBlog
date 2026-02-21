---
title: "小记 | 家庭服务器指南"
slug: "home-server"
date: 2024-02-07T15:05:18+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
gemini: true
categories: "server"
tags: [docker]
showSummary: true
summary: 落后的电脑 = 家庭服务器
---

## 为什么需要一个家庭服务器

这是一个很根本的问题，为什么我们需要家庭服务器？

> 1. **集中存储**：家庭服务器提供一个集中的位置来储存媒体、文件和其他数据，便于管理和访问。
> 2. **可靠的备份解决方案**：家庭服务器可以用来备份重要文档和媒体，防止数据丢失。
> 3. **随时可用**：服务器通常会一直开机运行，这意味着您可以随时访问存储在上面的数据。
> 4. **家庭自动化和安全平台**：家庭服务器可以用来控制智能家居设备，增强家庭安全。
> 5. **减轻主 PC 负担**：将文件存储和管理任务迁移到服务器上，可以减轻您主要使用的电脑的压力。
> 6. **节约费用**：与长期依赖云服务相比，自己搭建和运行家庭服务器可能是一个更经济的选项。
> 7. **测试、修补和游戏的机会**：家庭服务器给予用户自由地测试和学习服务器管理和网络配置的机会，对于有兴趣的人来说，这是一个理想的学习平台

以上由 **GPT-4 Turbo** 回答

## 安装系统

服务器，首当其冲就要稳，所以我用了 **Ubuntu** 作为服务器系统，安装过程不在概述，推荐使用 **Ventoy** 安装，这样不需要额外的操作

### 为什么放弃 Windows？

1. 资源占用：Windows 本身就很臃肿，一个非精简版 Windows 10 开机内存都有 1G 上 2G 的能力了
2. Docker 不完整：截至本文书写时（2024/2/7），**Docker Desktop**（MacOS / Windows）依然不支持 **host** 网络模式，这就导致了 **IPv6** 配置麻烦等。当然，你可以在 **WSL2** 中安装原生 **Docker**，然后在 **WSL2** 外部使用 **WSLPP** 进行映射。或者，你也可以将 **WSL2** 的网络模式修改为镜像网络
3. **WSL** 子系统体验蛋疼：子系统固然方便，但是内存占用不是一般的大，使用时还需要配置分页文件

## 配置环境

### 设置合盖操作（笔记本）

如果你是笔记本(GNOME 桌面)，如下：

```bash
sudo apt install gnome-tweaks
```

安装完成后打开优化工具，选择 **General（通用）** -> **Suspend when laptop lid is closed（笔记本电脑盖合上时挂起）** 右侧按钮设置为关闭

### 打开 SSH

```bash
sudo apt update
sudo apt install openssh-server
```

设置开机自启动

```bash
sudo systemctl enable ssh
```

### 安装 Docker

使用 **Docker** 容器可以帮助我们更方便的搭建项目

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

如果以上安装后无法使用 `Docker Compose`，你可以手动安装

```bash
sudo apt-get install docker-compose
```

### 添加用户到 Docker 组

这个过程应该一些文章没有，可以让你执行 **Docker** 系列命令时无需 **root** 权限

```bash
sudo usermod -aG docker ${USER}
sudo systemctl restart docker
sudo newgrp docker
sudo chmod o+rw /var/run/docker.sock
```

重开终端后即可

### 安装 Nginx Proxy Manager

安装 **Nginx Proxy Manager** 后可以帮我们更好的配置项目反向代理

新建一个文件夹，进入后创建 `docker-compose.yml`

使用如下 `docker-compose.yml`

```yaml
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    network_mode: "host"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

启动服务

```bash
docker-compose up -d
```

对于使用 **Cloudflare** 的人，你可能遇到 400 错误，你可以参考如下配置

进入你的 **Proxy Hosts** 配置界面，选择 **Advanced**，添加如下内容

```conf
client_header_buffer_size 32k;
large_client_header_buffers 4 32k;
```

保存即可

## 配置映射

此处有两种方案

1. Cloudflare Argo Tunnel（无需公网）
2. IPv6 DDNS + Cloudflare CDN（需要 IPv6 公网可用）

本文演示第二种方案

```bash
docker run -d --name ddns-go --restart=always --net=host -v /opt/ddns-go:/root jeessy/ddns-go
```

如上，然后进入 **IP:9876**

此处可以取消 IPv4 设置，然后我们配置 DNS 服务商

此处以 Cloudflare 举例，点击 **DDNS-GO** 提供的[地址][1]

创建令牌 -> 编辑区域 DNS（使用模板）

更改区域资源为 | 包括 | 账户的所有区域 | 你的区域 |

点击 “继续以显示摘要”，复制，粘贴到 **DDNS-GO** 的 Token 框，选择保存就好

翻到 IPv6 配置，选择通过网卡获取，在 Domains 填入一个子域名（根域名可以注册或者白嫖，此处不详细展开）

这里我们用 **egcn.xxx.xx** 举例子，填入进去后保存，转到 DNS 解析

假如我已经配置了一个项目，在 Nginx Proxy Manager 后台指定的域名为 lp.xx.xx

我们新建一个 CNAME 解析，像这样

**lp.xx.xx 是 egcn.xxx.xx 的别名并通过 Cloudflare 代理其流量**

保存即可

这样，一个家庭服务器就搭建且暴露在了**公共互联网**上

[1]: <https://dash.cloudflare.com/profile/api-tokens>
