---
title: "说说"
slug: "speak"
date: 2024-02-13T18:23:03+08:00
showSummary: false
showComments: false
showDate: false
showWordCount: false
showTableOfContents: false
showPagination: false
showAuthor: false
xml: false
---

<link
  rel="stylesheet"
  href="/css/iTalk.css"
/>
<script src="/js/libs/vue.global.js"></script>
<script src="/js/iTalk.js"></script>

<div id="iTalk">
</div>
<p style="text-align: end; bottom: 0; right:50%;">Powered by <a href="https://github.com/ChenYFan">TGTalk</a></p>

{{<rawhtml>}}

<script>
(function () {
  const talker = new tgTalker({
  serverUrl: "https://tgtalk-api.hesiy.cn/",
  selector: "#iTalk",
  zoom: true,
  custom: {
    proxy: {
      proxyUrl: "https://tgtalk-img.hesiy.cn/",
      image: true,
    },
    emaction: {
      enable: true,
      endpoint: "https://emaction.hesiy.cn",
      theme: "system",
      availableArrayString:
        "\uD83D\uDC4D,thumbs-up;\uD83D\uDE04,smile-face;\uD83C\uDF89,party-popper;\uD83D\uDE15,confused-face;❤️,red-heart;\uD83D\uDE80,rocket;\uD83D\uDC40,eyes;\uD83D\uDC4E,thumbs-down;",
      threeDimensional: true,
    },
  },
});
  talker.init()
})();
</script>

{{</rawhtml>}}
