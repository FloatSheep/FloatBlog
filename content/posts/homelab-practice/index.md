---
title: "小记 | Homelab 实践"
slug: "homelab-practice"
date: 2026-02-21T21:14:16+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "Server"
tags: ["Docker"]
gemini: true
showSummary: true
summary: 记录一次 Homelab 实践
---

## Zerotier 回家

### 安装 Zerotier

使用 `Zerotier` 作为虚拟局域网工具，可以让我们方便的连接到 `Homelab` 服务

为了方便管理 **Docker Compose**，我选择使用一个专用文件夹

新建文件夹 `~/docker-compose/zerotier`，将以下内容写入 `docker-compose.yml`

```yaml
version: "3.8"

services:
  zerotier:
    image: zerotier/zerotier
    container_name: zerotier
    restart: unless-stopped
    network_mode: host # 必须是 host 模式，才能加入虚拟网络

    cap_add:
      - NET_ADMIN
      - SYS_ADMIN
    devices:
      - /dev/net/tun # 允许使用 TUN 设备
    volumes:
      - ./zerotier_data:/var/lib/zerotier-one

volumes:
  zerotier_data:
```

执行 `docker-compose up -d`进行部署

过后还需要加入网络，**网络 ID** 从 [Zerotier Central][1] 处可获得

运行命令以加入局域网

```bash
docker-compose exec zerotier zerotier-cli join <网络 ID>
```

完成后，在其余设备上安装 `Zerotier` 即可

但是，仅限如此，我们只能访问已经加入 `Zerotier` 网络的设备，不能访问局域网内其他设备，所以还需要配置路由

### 配置局域网路由

进入 **Zerotier Central**，点选自己创建的网络

{{< alert >}}

这里需要注意：网络类型需要设置为 `Private`，这样会分配固定 IP 地址；如果不选择 `Private`，请对 `Homelab` 设备编辑 **IP Assignments** 和 **Do Not Auto-Assign IPs**

{{</ alert >}}

![image-20260221214920596](https://images.hesiy.cn/2026/02/dab30eda64c7b8dc232309e9f2f6dd06.png)

接着划到 **Advanced -> Managed Routes -> Add Routes**，添加路由

|                Destination                |                   Via                   |
| :---------------------------------------: | :-------------------------------------: |
| 局域网子网<br />（如 **192.168.1.0/24**） | `Homelab` IP<br />（如 **172.30.0.1**） |

添加提交后就可以通过 `Zerotier` 访问局域网设备

### 用家中网络访问外网

有时候或许需要通过家里的网络访问外网，此时也需配置路由

添加路由

| Destination |                   Via                   |
| :---------: | :-------------------------------------: |
|  0.0.0.0/0  | `Homelab` IP<br />（如 **172.30.0.1**） |

当然，此处仅为 `Zerotier` 云端配置，还需要修改每个设备

#### Windows

右键 `Zerotier` 托盘图标，选择 **Allow Default Route Override**

#### Android

进入 `Zerotier` APP，进入网络详细界面，转到 **Configuration**，勾选 **Route all traffic through ZeroTier**

#### DNS 配置

部分 DNS 提供了 **DNS 重写**功能，允许我们指定域名解析，可以在 `Zerotier` 中配置，使得每个设备都可以通过自定义域名连接到某个服务

> 搭配 [Nginx Proxy Manager][2] 食用更佳

不过，这部分笔者并未跑通，目前笔者选择在 `Zerotier` 客户端上使用自定义 DNS

## 服务导航（列表）

我自己手搓了一个 [FloatSheep FNG Gateway | Export Port][3]

{{< figure
  src="https://images.hesiy.cn/2026/02/9a0930db154dc4827be37d10af75c21f.png"
    caption="Demo"
    >}}

原理其实就是前端访问 **API** -> **API** 利用 **Unix Socket** 访问 **Docker Engine API**，获取数据然后返回

对于访问来源的判断：有一个数组，依次是 **本地地址**、**内网地址**、**外网地址**，请求到哪个就判断是哪个来源

其他玩法等待挖掘...

[1]: <https://my.zerotier.com/network/>
[2]: <https://github.com/NginxProxyManager/nginx-proxy-manager>
[3]: <https://export.hesiy.cn/>
