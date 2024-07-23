<h1 align="center">FloatSheep's Blog</h1>

<div align="center">
    Here is my person place.

<img src ="https://github.com/FloatSheep/FloatBlog/actions/workflows/build.yml/badge.svg">

</div>

# Introduction

- 基于 [Hugo][1]
- 主题使用 [Congo][2]
- 使用 [Waline][3] 作为评论系统
- 使用 [TGTalk][4] 作为说说系统
- 使用 [Umami][5] 作为数据统计系统
- 博客使用 Service Worker 和 [NPMMirror][6] 进行访问加速
- 博客使用通义千问 & ChatGPT-4 Turbo 进行部分代码编写
- 博客协议采用 [CC BY-NC-SA 4.0][7]

# Scripts

- 使用 fileExtened 脚本对静态文件进行处理
- 使用 pkgUpdate 脚本对 package.json 文件进行处理
- 使用 sitemapCommit 脚本提交 sitemap 给百度站长

sitemapCommit 使用 webpack 打包，已被 webpack 混淆

[1]: <https://gohugo.io/>
[2]: <https://github.com/jpanther/congo>
[3]: <https://waline.js.org/>
[4]: <https://gist.github.com/ChenYFan/4e88490212e3e08e06006cf31140cd3f/>
[5]: <https://umami.is/>
[6]: <https://npmmirror.com/>
[7]: <https://blog.hesiy.cn/policy/>
