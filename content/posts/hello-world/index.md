---
title: "Hello World"
date: 2023-08-23T18:08:18+08:00
categories: "hello"
tags: ["welcome", "new", "about", "first"]
draft: false
---
## 快速开始
## Hugo 帮助
```bash
hugo help
hugo is the main command, used to build your Hugo site.

Hugo is a Fast and Flexible Static Site Generator
built with love by spf13 and friends in Go.

Complete documentation is available at <http://gohugo.io/>.

Usage:
  hugo [flags]
  hugo [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  config      Print the site configuration
  convert     Convert your content to different formats
  deploy      Deploy your site to a Cloud provider.
  env         Print Hugo version and environment info
  gen         A collection of several useful generators.
  help        Help about any command
  import      Import your site from others.
  list        Listing out various types of content
  mod         Various Hugo Modules helpers.
  new         Create new content for your site
  server      A high performance webserver
  version     Print the version number of Hugo

Flags:
  -b, --baseURL string             hostname (and path) to the root, e.g. <http://spf13.com/>
  -D, --buildDrafts                include content marked as draft
  -E, --buildExpired               include expired content
  -F, --buildFuture                include content with publishdate in the future
      --cacheDir string            filesystem path to cache directory. Defaults: $TMPDIR/hugo_cache/
      --cleanDestinationDir        remove files from destination not found in static directories
      --config string              config file (default is path/config.yaml|json|toml)
      --configDir string           config dir (default "config")
  -c, --contentDir string          filesystem path to content directory
      --debug                      debug output
  -d, --destination string         filesystem path to write files to
      --disableKinds strings       disable different kind of pages (home, RSS etc.)
      --enableGitInfo              add Git revision, date, author, and CODEOWNERS info to the pages
  -e, --environment string         build environment
      --forceSyncStatic            copy all files when static is changed.
      --gc                         enable to run some cleanup tasks (remove unused cache files) after the build
  -h, --help                       help for hugo
      --ignoreCache                ignores the cache directory
      --ignoreVendorPaths string   ignores any _vendor for module paths matching the given Glob pattern
  -l, --layoutDir string           filesystem path to layout directory
      --log                        enable Logging
      --logFile string             log File path (if set, logging enabled automatically)
      --minify                     minify any supported output format (HTML, XML etc.)
      --noChmod                    don't sync permission mode of files
      --noTimes                    don't sync modification time of files
      --panicOnWarning             panic on first WARNING log
      --poll string                set this to a poll interval, e.g --poll 700ms, to use a poll based approach to watch for file system changes
      --printI18nWarnings          print missing translations
      --printMemoryUsage           print memory usage to screen at intervals
      --printPathWarnings          print warnings on duplicate target paths etc.
      --printUnusedTemplates       print warnings on unused templates.
      --quiet                      build in quiet mode
      --renderToMemory             render to memory (only useful for benchmark testing)
  -s, --source string              filesystem path to read files relative from
      --templateMetrics            display metrics about template executions
      --templateMetricsHints       calculate some improvement hints when combined with --templateMetrics
  -t, --theme strings              themes to use (located in /themes/THEMENAME/)
      --themesDir string           filesystem path to themes directory
      --trace file                 write trace to file (not useful in general)
  -v, --verbose                    verbose output
      --verboseLog                 verbose logging
  -w, --watch                      watch filesystem for changes and recreate as needed

Use "hugo [command] --help" for more information about a command.```
## 创建一篇文章
```bash
hugo new post/hello-world.md
```
## 运行本地服务器
```bash
hugo server -D
```
## 构建静态网页
```bash
hugo -D
```

## 强制清除 Public 文件夹

```bash
hugo -F --cleanDestinationDir
```
## 部署网站
作为参考，我使用 Github 来托管 Hugo 网站源代码，使用 Cloudflare Pages 集成部署网站

更多信息，你可以参考 Hugo 官方文档的 部署 部分

## 更多信息
请查看 文档 了解更多信息。如果你在使用 Hugo 时遇到任何问题，你可以在 故障排除 中找到答案，或者在 GitHub 上寻求帮助
