---
title: 那些奇奇怪怪的图床
sticky: 3
tags: [picgo]
summary: 图床盘点
showSummary: true
categories: [picgo]
cover: cover.svg
thumbnail: cover.svg
slug: pictures-bed
gemini: true
thumbnail: cover.svg
date: 2022-05-15 11:17:12
copyright_author_href: https://blog.slqwq.cn
author: Hajeekn
---

>  文章迁移计划，样式可能出错

最近想用 IPFS 做图床但是发现的一堆奇奇怪怪的图床

(PS: 不会介绍传统的 GitHub + JSdelivr / SM.MS / 路过图床)

## Bilibili 图床

十分简单

PicGO 搜索 bilibili

![img](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/cf1ae1497dece72e055eb53e76ab22cce8edbd7f.png)

接着配置 Bilibili 图床

![image-20220515095616065](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/cdfe3d7b91a9e90d70b5b98f73cc210c3e3818af.png)

SESSDATA 可以登录哔哩哔哩后查看

进入哔哩哔哩,按下 F12

定位到应用  -> COOKIE

![image-20220515095718144](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/b9641807e390e3cb6400dfde505d355fed04efe7.png)

选择 `https://www.bilibili.com`

![image-20220515095812119](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/414a2c8e5ac3a5468149e9ba127d0ee4a13567fc.png)

在名称内找到 SESSDATA

点击它

![image-20220515100404765](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/acf7ca1d8eb1dd61ad279ba9d0d261ea46e67052.png)

然后在 Cookie Value 中复制值,粘贴进去

之后确定,设置默认图床即可

#### 良心的处理参数

哔哩哔哩图床有十分良心的处理参数

| Type                                    | URL                      |
| --------------------------------------- | ------------------------ |
| 原图                                    | 不做更改                 |
| 原分辨率, 质量压缩                      | 原链接 + @1e_1c.jpg      |
| 原分辨率, 质量压缩(WEBP)                | 原链接 + @1e_1c.webp     |
| 规定宽, 高度自适应, 质量压缩(可变 WEBP) | 原链接 + @104w_1e_1c.jpg |
| 规定高, 宽度自适应, 质量压缩(可变 WEBP) | 原链接 + @104h_1e_1c.jpg |
| 规定高宽, 质量压缩(可变 WEBP)           | @104w_104h_1e_1c.jpg     |
| 原分辨率(WEBP)                          | @104w_104h_1e_1c.webp    |

这是 哔哩哔哩 的处理参数

哔哩哔哩还有许多节点可以选择

#### 自定义 CDN

金山 CDN 路线:

- i0.hdslb.com
- i2.hdslb.com

阿里 CDN 路线:

- i1.hdslb.com
- i4.hdslb.com
- s1.hdslb.com
- s3.hdslb.com

未知 CDN 路线:

- s2.hdslb.com

> ~~Bilibili 图床有防盗链,如果你要在你自己的网站中用 Bilibili 图床,得先配置头~~

```html
<meta name="referrer" content="no-referrer">
```

> ~~如果你用的 Hexo - Butterfly 则可以在配置文件中这样配置~~

```yaml
inject:
  head:
      - <meta name="referrer" content="no-referrer">
```

2024 年 1 月 30 日更新：叔叔已经设置了禁止空头，目前哔哩哔哩图床使用有一些门槛了，如果你和我一样部分文章用了叔叔做图床，可以写一个跨域脚本

```javascript
import https from 'https';

export default async function handler(request, response) {
  const { fetch: imageUrl } = request.query;

  if (!imageUrl) {
    return response.status(400).json({ error: 'No image URL provided' });
  }

  const options = {
    headers: {
      'Referer': 'https://www.bilibili.com'
    }
  };

  try {
    https.get(imageUrl, options, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        return response.status(res.statusCode).json({ error: 'Failed to fetch image' });
      }

      response.setHeader('Content-Type', res.headers['content-type']);

      res.pipe(response);
    }).on('error', (error) => {
      response.status(500).json({ error: error.message });
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
```

接着你可以写一个 Powershell 脚本进行替换

```powershell
$rootPath = "./"  # 替换成你想要搜索的目录
$matchPattern = 'https://i0\.hdslb\.com/'  # 来匹配的URL
$replaceWith = 'https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/'  # 替换为新的URL

$markdownFiles = Get-ChildItem -Path $rootPath -Recurse -Filter *.md

foreach ($file in $markdownFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content -replace $matchPattern, $replaceWith

    Set-Content -Path $file.FullName -Value $newContent
}

Write-Host "所有Markdown文件中的URL已经更新完成。"
```

> 注意：如果你使用了早期的哔哩哔哩图床或者自定义了 CDN，你也要跟着进行修改

#### 配套食用

[浏览器插件](https://github.com/xlzy520/bilibili-img-uploader)

[Typora 插件](https://github.com/xlzy520/typora-plugin-bilibili)

> 配合 typora 食用更佳

> 如果用了很久之后,在上传时出现了错误,那就是 SESSDATA 过期了,重新去生成一个就好

## NPM + UNPKG 镜像

> 使用这个方法前记得切换回原来 NPM 的注册表.因为其他镜像没有发布这个功能

十分简单

本地先登录,接着创建包,然后初始化版本,最后发布

指令:

```bash
$ npm login
$ npm init -y
$ npm version patch
$ npm publish
```

这样一个 npm 包就发布完了

接下来是收集的一些镜像

- https://npm.elemecdn.com/  饿了么(阿里 CDN)
- https://unpkg.zhimg.com/ 知乎(阿里 CDN)
- https://shadow.elemecdn.com/  饿了么(阿里)(这个停止维护了)
- https://code.bdstatic.com/npm/ 百度(百度 CDN)
- https://cdn.jsdelivr.net/npm/ Jsdelivr(备案没封前是网宿 CDN | 后来备案封后是 Cloudflare + Fastly + Gcore)(可以自定义节点)

Jsdelivr 自定义节点只需要:

gcore.jsdelivr.net

fastly.jsdleivr.net

即可

## 4EVERLAND BUCKET

> 这应该是 IPFS 的另一个方案(但是最多 1G)

#### PicGo 插件安装

![image-20220515102843681](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/a331f344fec5938cf88bb31b96eb617ca7aa912a.png)

搜索 s3 并安装

然后就去 4EVERLAND 注册一个账户

https://4everland.org/

这个网站似乎只能用以太坊钱包登录,GitHub 登录会提示不支持了(

我用的 MetaMask

注册之后创建一个桶![image-20220515103035770](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/18d86351cd8e59f2952403b87e6148a011a0c8b7.png)

#### 生成 API TOKEN

点击你账户, 选择设置

转到 Auth Token

选择 Bucket Auth Tokens

点击 Generate 即可

![image-20220515103143196](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/6a6280b7d227e71f85fe3ac5d6c723a1624b10b2.png)

> 本文章的 Key 在发布之前就删掉了,不要想着搞坏事

之后进入 PicGo 配置下

转到 Amazon S3

![image-20220515103304436](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/0c17cef3800acd7e24cb513332b581b7e533d734.png)

ID 和 密钥粘贴进去

桶写你创建桶的时候的名字

节点用 https://endpoint.4everland.co

自定义域名是 桶名.4everland.store

最后记得把这两个选项打开

![image-20220515103434098](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/2cfae6b3b35c40363da4d245be35ddbe689c6a48.png)

## IPFSUPLOAD(真正意义上的 IPFS 图床)

本地装一个 IPFS DESKTOP

等他启动后先看端口

![image-20220515103737939](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/4f632ddca72f5fd73c04b363a3bcc71c0ed32a46.png)

图中圈着的就是端口,然后去浏览器访问一下看看正不正常

`http://localhost:5001/api/v0/add?pin=true`

如果正常应该会提示 405 - Method Not Allowed

接着就是上传了

PicGo 安装一个 web-uploader

![image-20220515104103681](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/900e4ad2f69eb49de3c2cc768a570d0a4d64e341.png)

然后配置如图

![image-20220515104559575](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/f3964d51aa4ec7628e29561b436244322a9dc43d.png)

IPFS网关我是用的我自己的,所以打了马赛克,你们可以自己先用 workers 反代一次,然后再用 CDN 过墙

你也可以直接 CDN 我代理好的 worker (IPFS 官网)

PS :我没有反代 IPFS 网关

回源: **dl2p.taiyu.workers.dev**

回源 HOST: **dl2p.taiyu.workers.dev**

回源端口: 443

回源协议: HTTPS

速度测试:

![](https://dl2p.hesiy.cn/ipfs/QmeeNLDPcfC2SZnC5N2TZTSY19P4nRPHhVoqMrYJvuXVLX?filename=Genshin%20Impact.webp)

> 不给滥用,我设置了防盗链

## DogeDoge 图床

没有什么说的,速度炒鸡快,使用要申请,现在应该申请不到了

有的可以用

![image-20220515104734675](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/14b08dccb38ff79f6935a6a764a65b20773bf724.png)

## BACKBLAZE B2 + Cloudflare

首先猜到有人要提问: 为什么要加 Cloudflare?

因为 BACKBLAZE 有流量计费,但是他加入了带宽联盟,再加上 Cloudflare 超长缓存,≈ 完全免费

但是有10G空间

这是超出10G的价格

![](https://api.hesiy.cn/api/cross?fetch=https://i0.hdslb.com/bfs/album/6389ccc4522227dd936a8eedfeb6988ecd39616c.jpg)

注册方法 ChenYFan 大佬已经写过了,与其再写一篇问文章,不如直接用他的~~(其实就是懒)~~

直接贴:

https://blog.cyfan.top/p/ce240368.html

## 云存储做图床

> 用 OneDrive Google Drive 做图床真的是闲

#### OneDrive

参考 [Spencer Woo](https://ovi.swo.moe/zh/docs/getting-started) 去搭建一个 onedrive-vercel-index 就行

#### Google Drive

参考 [ChenYFan](https://blog.cyfan.top/p/74e90c90.html) 搭建一个 GDIndex 即可

## 大厂的对象储存

#### 阿里云 OSS

> 有很多人写,自己谷歌,反正价格挺便宜的

#### 腾讯云 COS

> 🤢 这东西不推荐,计费十分离谱,而且配置头超长缓存后 COS 会在用户请求时悄悄篡改 max-cache
>
> 新用户有 6 个月免费额度,之后就要开始付费了(
>
> ⚠ 流量包和储存包都很贵

#### 又拍云 UOS

> 又拍云似乎是没有免费额度的,但是又拍云有开发者联盟,只需要把他的 Logo 挂在你的网站页脚就行。
```html
<img src="本地位置.svg">
```

## 总结

好用的图床千千万,你要自己去发现

我总结了 7 个免费图床,其中 DogeDoge 图床需要申请

如果细数的话,共有 8 个免费图床(每个云存储单独算一个)

