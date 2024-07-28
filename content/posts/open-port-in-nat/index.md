---
title: "在 NAT 网络环境下获得被外网访问的权利"
slug: "open-port-in-nat"
date: 2024-07-28T12:28:22+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "nat"
tags: ["learn"]
gemini: true
showSummary: true
summary: 我要，重新找回被访问权利！
---

{{< alert >}}
本文仅涉及到基础，且可能有错误
{{< /alert >}}

## 你没有公网 IP，你是怎么上网的？

目前，运营商在 IPv4 中使用 NAT（网络地址转换） 技术，让你能够正常上网

简单解释，NAT 就是可以让许多设备共享一个公网 IP

当然，IP 的使用者不仅仅包括你家的设备，可能小区中的很多设备和你家的设备共享一个 IP

## 常见的 NAT 类型

在 RFC 3489 标准下，NAT 类型包括如下四种

|              NAT 类型              |                           映射情况                           |
| :--------------------------------: | :----------------------------------------------------------: |
|        Full Cone（全锥型）         |      外部主机向内部主机发送报文，可以实现和内部主机通信      |
|   Restricted Cone（受限圆锥型）    | 内部主机向外部主机发送报文后，外部主机才能发送报文和内部主机通信 |
| Port Restricted Cone（端口受限型） | 内部主机向外部主机的特定 IP 和端口发送报文后，外部主机才能发送报文与内部主机通信 |
|        Symmetric（对称型）         | 不同的请求拥有不同的映射（相当于外部主机无法直接与内部主机通信） |

## NAT 类型与运营商

一般来说，运营商的分配内网 IP 时的 NAT 设备，**默认 NAT 类型**为 Full Cone。在这种情况下，你只需要稍微修改配置，即可获得 Full Cone 型 NAT

在公网 IP 需求量大的地方，运营商会优先考虑**企业、专线用户**。这时候，运营商会为家庭用户使用其它 NAT 类型的 NAT 设备

### NAT 类型与连接

如果运营商采用 Full Cone 型的 NAT 设备，最多只能有 0xffff（65535） 个连接

但如果运营商采用 Symmetric 型的 NAT 设备，可以根据 `dst ip dst port src port` 查找 `nat` 表，连接数量比 Full Cone 多得多

因此，越复杂的 NAT 越能用有限的外网地址支持更多的内网设备，这也就解释了为什么许多地方没有 Full Cone

## NAT 类型与用户

在运营商提供 Full Cone 的情况，用户却无法获取到 Full Cone，一般与配置有关

### 光猫桥接，路由器拨号

这种情况在 2020 年之前比较常见

在这种情况下，你的环境是这样的

![](https://7.isyangs.cn/55/66a6213ababaf-55.png)

由于光猫只作为光电转换设备，NAT 就与它无关了

1. 进入路由器后台

找到 `高级设置 - 端口转发`（部分路由器叫做 DMZ 主机）

打开 DMZ 开关，并将地址指定为你的设备 IP 地址

2. （针对部分路由器）在路由器后台中找到 Full Cone 选项，将其打开

再次进行 NAT 测试，你的结果理应为 Full Cone

或者，不配置端口转发，通过 `UPnP` 进行映射

找到 `高级设置 - 其他`，启用 UPnP

### 光猫拨号，路由器 DHCP

目前，这种情况比较常见

{{< alert "circle-info" >}}
光猫型号不同，操作也不同

此处以 ZXHN F653GV9 举例

{{< /alert >}}

1. 使用超管密码，进入光猫后台

找到 `安全 - 防火墙 - 安全级`，改为低

进入`应用 - DMZ 主机` ，指定为路由器的 IP 地址（或 MAC 地址）

接着进入 `应用 - UPnP`，将其变为使能（启用）

2. 进入路由器后台

找到 `高级设置 - 端口转发`（部分路由器叫做 DMZ 主机）

打开 DMZ 开关，并将地址指定为你的设备 IP 地址

（针对部分路由器）在路由器后台中找到 Full Cone 选项，将其打开

或者，不配置端口转发，通过 `UPnP` 进行映射

找到 `高级设置 - 其他`，启用 UPnP

再次进行 NAT 测试，你的结果理应为 Full Cone

## 使用 Natter 进行映射

{{< alert >}}

本部分书写于 Natter v2.1.1

如果你要使用 Natter，请使用 v2 而不是 v1

{{< /alert >}}

由于 Natter 支持 Windows，我们就不需要 Linux 进行操作了

{{< alert >}}

Natter 需要 Python 环境，请提前安装

{{< /alert >}}

1. 下载 Natter

克隆仓库

```bash
git clone https://github.com/MikeWang000000/Natter.git
```

2. 打洞

我们可以直接使用 `python natter.py -m test` 来测试是否打洞成功

![image-20240728184751335](https://7.isyangs.cn/55/66a621db48164-55.png "Natter 打洞成功输出")

### 命令行参数

详细可以查看 [Natter - 参数说明](https://github.com/MikeWang000000/Natter/blob/master/docs/usage.md)，此处介绍一些基本参数

- `-p` 指定需要映射的端口
- `-t` 指定需要映射的 IP

- `-u` 开启 `UDP` 打洞
- `-U` 开启 `UPnP` 映射
- `-v` 输出详细信息
- `-m` 配置转发方法
  - 在 Windows 下一般指定为 `socket`，`gost` 和 `socat` 也可用，但需要使用 `pip` 安装依赖

- `-r` 不断重试，直到端口开放

演示：映射本地 5421 端口，并使用 `UPnP` 映射，`socket` 转发

```bash
python natter.py -p 5421 -t 127.0.0.1 -U -v -m socket -r
```

![image-20240728185024389](https://7.isyangs.cn/55/66a62274c6407-55.png "UPnP 打洞输出示例")

{{< alert "circle-info" >}}

需要注意的是，`socket`, `gost` 和 `socat` 都无法保留源 IP，转发所属的应用程序无法获得访客的真实 IP 和端口

{{< /alert >}}

## 使用 natmap 进行映射

{{< alert >}}

natmap **仅支持 Linux、BSD 和 MacOS**，Windows 上不可用

本部分书写于 natmap 20240603 版

{{< /alert >}}

首先从 release 上下载

```bash
wget https://github.com/heiher/natmap/releases/download/20240603/natmap-linux-x86_64 -O natmap
```

然后就可以开始打洞了

1. TCP 转发模式

​	使用 `natmap -s turn.cloudflare.com -h example.com -b 80 -t 10.31.0.49 -p 80`

​	在这段代码中，我们使用 `turn.cloudflare.com` 作为 STUN 服务器（`-s turn.cloudflare.com`），`example.com` 作为保活服务器（`-h example.com`）, `80` 作为映射端口（`-p 80`）和 natmap 的绑定端口（`-b 80`），并指定映射到 `10.31.0.49` （`-t 10.31.0.49`）

1. UDP 转发模式

​	使用 `natmap -s turn.cloudflare.com -h example.com -b 80 -t 10.31.0.49 -p 80 -u`

​	在这段代码中，我们使用 `turn.cloudflare.com` 作为 STUN 服务器（`-s turn.cloudflare.com`），`example.com` 作为保活服务器（`-h example.com`）, `80` 作为映射端口（`-p 80`）和 natmap 的绑定端口（`-b 80`），指定映射到 `10.31.0.49` （`-t 10.31.0.49`），并指定使用 UDP 转发模式（`-u`）

### 命令行参数

详细可以查看 [natmap - Usage](https://github.com/heiher/natmap?tab=readme-ov-file#usage)，此处介绍一些基本参数

- `-u` 使用 UDP 转发模式
- `-s` 指定 STUN 服务器
- `-t` 指定需要映射的 IP
- `-p` 指定需要映射的端口 

## 使用 Lucky 进行映射

本质和 Natter 以及 natmap 类似，可以参考 [基于stun穿透工具LUCKY，使BT客户端绿灯、开放TCP端口的办法（进化版）](https://www.cometbbs.com/t/%E5%9F%BA%E4%BA%8Estun%E7%A9%BF%E9%80%8F%E5%B7%A5%E5%85%B7lucky%EF%BC%8C%E4%BD%BFbt%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%BB%BF%E7%81%AF%E3%80%81%E5%BC%80%E6%94%BEtcp%E7%AB%AF%E5%8F%A3%E7%9A%84%E5%8A%9E%E6%B3%95%EF%BC%88%E8%BF%9B%E5%8C%96%E7%89%88%EF%BC%89/82042) 尝试

## 使用 pcp 进行映射

{{< alert >}}

此方法需要运营商和设备部署 pcp

{{< /alert >}}

1. 检查是否处于 CGN NAT（NAT444）类型

查看拨号设备获取的 IP 地址，如果 IP 以 100.64 开头，说明处于 CGN NAT 类型（如下图）

![image-20240728185546885](https://7.isyangs.cn/55/66a623b6dded4-55.png "CGN NAT 拨号获取示例")

当然，并不是 CGN NAT 一定是 100.64 开头，可以自己尝试

2. 克隆 pcp 并编译

```bash
git clone https://github.com/libpcp/pcp.git && ./autogen.sh && ./configure && make && sudo make install
```

或者，你可以下载编译好的 2012 年版 pcp

[PCP Client download | SourceForge.net](https://sourceforge.net/projects/pcpclient/)

3. 探测设备是否部署 pcp

```bash
./pcp -i <本地 / 局域网 IP>:<端口> -e <远程 IP>:<端口> -t -l <生命周期，如 3600>
```

无论是否成功，终端都会返回类似 `  1s 000ms 938us INFO   : PCP server <PCP Server IP> terminated.` 的输出

如果终端出现 `Flow signaling timed out.`，就代表这个设备没有部署 pcp

![image-20240728185209442](https://7.isyangs.cn/55/66a622dd5ec36-55.png "尝试将光猫作为 PCP server 时出错")

{{< alert >}}

需要注意的是，如果光猫没有部署 pcp，但是路由器（如小米 AX9000）支持，你的端口将会映射到<路由器 Ext. IP>:Port

具体 IP:Port 可以根据终端输出判断

![image-20240728185315730](https://7.isyangs.cn/55/66a6231fdeb69-55.png "成功输出，框内为 <Ext. IP>:Port")

{{< /alert >}}

现在，你可以访问 IP:Port 查看映射效果

![image-20240728185405154](https://7.isyangs.cn/55/66a62351c13b3-55.png "映射效果示例")

## 题外话：关于光猫桥接与路由（拨号）模式的选择

已经是 2024 年了，过去的光猫改桥接是因为当时的光猫性能羸弱，PPPoE 协议的开销又很大，不改桥接速度跑不上去，因此当时的网民（甚至是装维）都会推荐改桥接

但随着光猫性能的提升，PPPoE 的开销对于现代光猫来说已经没有太大的负担。因此让光猫拨号，路由器 DHCP **也许**是现代的最佳方法

以及，现在很多地方开始使用 IPoE 代替 PPPoE，在这种模式下 “DHCP Option 的计算涉及到了动态的 Challenge Secret 和使用 SM3 、SM4 算法来生成，因此一段时间内是没有桥接并通过认证的方案，故暂时放弃。“

就算你所在的地方没有推行 IPoE，装维也会说现在不需要改桥接，**也许你是为了公网 IP，但是公网 IP 与光猫拨号有什么关系呢？或者你是为了提高速度，但是现代光猫改桥接带来的网络提升可以忽略不计。亦或者你是为了实现 Full Cone，但在光猫 DMZ 路由器的情况下，这一层 NAT 可以轻松穿过。就算你改了桥接，运营商定时下发配置会变回路由模式，到时候家里无法上网，还得改一次桥接，属于费力不讨好。也许有人会说，删掉 TR069 就好了，但是运营商有时下发一些更新配置的时候怎么办？只能凉拌了**

**温馨提示：以上句段属于个人观点**

在 IPoE 未来普及的时候，“光猫将会内置 PPPoE 服务器，拓扑将会改变为：用户终端 - 用户自己路由器（ PPPoE 拨号）- 光猫（ PPPoE 服务器）- 光猫（ NAT ）- 光猫（ IPoE 的 WAN ）- 运营商出口”

## 参考

- [什么是NAT？NAT的类型有哪些？ - 华为](https://info.support.huawei.com/info-finder/encyclopedia/zh/NAT.html)
- [请教运营商分配内网 IP 时采用的 NAT 设备的 nat 类型是 full cone 的么 - V2EX](https://global.v2ex.com/t/460298)
- [MikeWang000000/Natter](https://github.com/MikeWang000000/Natter)
- [heiher/natmap](https://github.com/heiher/natmap)
- [libpcp/pcp](https://github.com/libpcp/pcp)
- [介绍一个可能有助于 CGN NAT 端口映射的工具 - V2EX](https://v2ex.com/t/603512)
- [分享一个在 NAT1 下将端口打开到公网上的方法 - V2EX](https://www.v2ex.com/t/871773)
- [Port Control Protocol support - For Developers - OpenWrt Forum](https://forum.openwrt.org/t/port-control-protocol-support/114411)
- [电信又一新动作：上网业务不再使用 PPPoE 新装宽带无法改桥接 - V2EX](https://www.v2ex.com/t/875362)
