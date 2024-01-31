---
title: "小米路由器 Docker 折腾指北"
slug: "mi-docker"
date: 2023-09-30T12:04:28+08:00
cover: cover.svg
thumbnail: cover.svg
draft: false
categories: "docker"
tags: ["router"]
gemini: true
showSummary: true
summary: 折腾路由器的一次经历
---

本文是对旧文的重写

## 准备工作

需要的工具（文件、硬件）如下：

* 路由 ROM（开发版 + 稳定版）
* 路由救砖工具
* 在 `1GB=1024MB` 换算下，剩余空间 ≥ 32GB 的 `U盘（或移动硬盘）`[^1]

以上工具（文件、硬件）除硬盘外均可在小米路由器官方网站下载

![image-20230930122411029](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301224615.png)

文章使用版本：

* AX9000 开发版固件（Ver. 1.0.140）
* AX9000 稳定版固件（Ver. 1.0.168）
* MIWIFIRepairTool（Dat. 19/01/24）

## 正文

进入路由器后台，在常用设置 -> 系统状态中进行新建备份

![image-20230930123036538](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301230559.png)

然后使用手动上传功能更新开发版固件

等待 `5~8` 分钟，当路由器 `System` 指示灯亮为**蓝灯闪烁**或橙灯常亮时将路由器断电重启（Power 按键即可）

这时候访问路由器后台，进入高级设置 -> DOCKER，你也许会看见如下页面

![image-20230930124422521](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301244547.png)

这样即代表你安装成功了

接下来格式化设备

使用你所喜爱的磁盘格式化工具将存储设备格式化为 EXT4（Linux）就好[^2]

接着将储存设备插入至路由器 Mesh 组网面，然后对设备进行重启![image-20230930124809077](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301248092.png)

重启完成后你可以在路由器管理页面的存储状态中查看到你的设备信息

![image-20220722114422388](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301249102.png)

我们首先创建虚拟内存[^3]，然后转到高级设置 -> DOCKER 对 Docker 进行安装，等待安装完成后点击安装第三方管理（此处由于天朝网络特性，可能会失败）

安装完成后点击 `管理Docker`

And then, enjoy it!

## 拓展玩法

### 开启路由器 SSH 权限

此处有两种方法（第一种也许被修复了

第一种：

登录路由器后台，记下地址，类似于这样

```plaintext
http://[IP]/cgi-bin/luci/;stok=<STOK>/web/home#router
```

然后我们获取 STOK 和 IP 对下面的地址进行替换

```plaintext
http://[IP]/cgi-bin/luci/;stok=<STOK>/api/misystem/set_config_iotdev?bssid=Xiaomi&user_id=longdike&ssid=-h%3B%20nvram%20set%20ssh_en%3D1%3B%20nvram%20commit%3B%20sed%20-i%20's%2Fchannel%3D.*%2Fchannel%3D%5C%22debug%5C%22%2Fg'%20%2Fetc%2Finit.d%2Fdropbear%3B%20%2Fetc%2Finit.d%2Fdropbear%20start%3B
```

访问后显示 `{"code": 0}` 就成功了，然后修改密码

```plaintext
http://[IP]/cgi-bin/luci/;stok=<STOK>/api/misystem/set_config_iotdev?bssid=Xiaomi&user_id=longdike&ssid=-h%3B%20echo%20-e%20'admin%5Cnadmin'%20%7C%20passwd%20root%3B
```

第二种：

进入容器管理页面，创建一个容器，在 `Image` 中填写 `busybox`

接着转到高级容器设置，将 `Console` 更改为 `Interactive & TTY (-i -t)`

![image-20230930130657700](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301306717.png)

然后转到 `Volumes` 部分，新建 `mapping` 将 `container` 填写 `/mnt` 并将模式改为 `Bind` ，将 `host` 填写为 `/` 并将权限改为 `Writable`

![image-20230930130644785](https://rmt.ladydaily.com/fetch/hajeekn/storage/202309301306812.png)

部署之后在容器列表的快速操作中选择 `Attach Console`

然后执行如下命令：

```bash
chroot /mnt
vi /etc/init.d/dropbear
```

根据下面（Diff）进行更改:

```diff
...

start_service()
{
        + #flg_ssh=`nvram get ssh_en`
        + #channel=`/sbin/uci get /usr/share/xiaoqiang/xiaoqiang_version.version.CHANNEL`
        + #if [ "$flg_ssh" != "1" -o "$channel" = "release" ]; then
        + #       return 0
        + #fi
...
}

```

省略号部分代表内容相同，只用更改省略号以上（下）的内容

然后启动服务

```bash
/etc/init.d/dropbear start
```

修改 `root` 密码

```bash
passwd root
```

 固化可参考 《[小米路由器 AX9000 开发版固件直接获取 SSH][1]》的固化部分或《[[ax9000] 小米ax3600/ax6000/ax9000/ax5/ax6获取root权限][2]》的固化部分

### 搭建 Memos

在 **Memos** 的官方文档获取 `compose` 文件

如下：

```yaml
version: "3.0"
services:
  memos:
    image: neosmemo/memos:latest
    container_name: memos
    volumes:
      - ~/.memos/:/var/opt/memos
    ports:
      - 5230:5230
```

对文件进行修改

```yaml
version: "3.0"
services:
  memos:
    image: neosmemo/memos:latest
    container_name: memos
    volumes:
      - /mnt/docker_disk/docker_data/memos:/var/opt/memos
    ports:
      - 5230:5230
```

然后将文件内容粘贴到容器管理的 `Stacks` 部分部署即可

当然，你也可以手动部署

创建容器时 `Image` 改为 `neosmemo/memos`

高级设置部分的 `Volumes` 添加 `mapping` `/mnt/docker_disk/docker_data/memos` 模式改为 `Bing` 然后 `host` 改为 `/var/opt/memos` 并将权限改为 `Writable`

再转到 `Network` 新建一个 `port mapping` 双项都设置为 `5230`，网络选 `host` 就行，这样可以通过 `路由器后台管理地址:5230` 访问 `Memos` 了

### 创建小型服务器

 转到 `App Templates`, 选择 `Ubuntu`  并部署

然后转到容器管理页面，`Attach` 或 `Console` 进入容器

输入如下命令：

```bash
apt-get update
apt-get install ca-certificates
```

然后安装一些工具

```bash
apt-get install vim
apt-get install systemctl
```

换源（可选）：

```bash
vim /etc/apt/sources.list
```

`gg` 然后 `dG` 然后所有内容

粘贴清华镜像源

```yaml
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-proposed main restricted universe multiverse
```

更新并去除最小化：

```bash
apt-get update
unminimize
```

配置 `SSH`:

```bash
apt-get update
apt-get install openssh-server
```

设置 `root` 密码：

```bash
passwd
```

修改配置文件：

```bash
vim /etc/ssh/sshd_config
```

在文件中找到 `PermitRootLogin prohibit-password` 并注释掉

然后添加 `PermitRootLogin yes`

重启一下服务

```bash
/etc/init.d/ssh restart
```

然后小型服务器就创建好了

[1]: https://blog.nanpuyue.com/2022/056.html
[2]: https://www.right.com.cn/forum/thread-4046020-1-1.html

[^1]: 当然，你也可以使用消费级硬盘，但是这样未免有点大材小用了，除非有人想用路由器做简易 NAS
[^2]: 如果你的存储设备还需要存储文件，你可以将它分为两个分区，你只需要保证第一个分区为 EXT4（Linux）格式
[^3]: 如果你的存储设备容量 ≤ 32GB，创建分页文件后就无法安装 DOCKER

