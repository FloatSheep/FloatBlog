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

<div id="talk">
  <div id="g-container">
    <center>
      <div class="loading">
    </center><br>
    <center>
      <p>Loading...</p>
      </div>
      </div>
      {{<rawhtml>}}
        <script id="template" type="text/x-handlebars-template">
          <div class="content-container">
            {{#each ChannelMessageData}} {{#if (not (contains text "Channel"))}}
            <div class="message">
              <div class="info-header"><p class="Tag"><span class="pageTag"><a class="point" href="https://t.me/nzspeak/{{ originalKey }}" target="_blank">#{{ originalKey }}</a></span> <span class="views">Views: {{views}}</span></p></div>
              <p class="text">{{{compoundRender text}}}</p>
              {{#if image}}
              <div class="image">
                {{#each image}} {{#unless (contains this "emoji")}}
                <img
                  src="{{ replaceImage this}}"
                  loading="lazy"
                  alt="图片"
                  data-zoomable
                />
                {{/unless}} {{/each}}
              </div>
              {{/if}}
              <span class="time"><span class="time-in">{{replaceTime time}}</span>
              {{tagChina text true}}
            </div>
            {{/if}} {{/each}}
          </div>
        </script>
      {{</rawhtml>}}
      <center><button id="load-more" type="button">加载更多</button></center>
      </center>
      <script src="/js/talk.js"></script>
    <link rel="stylesheet" href="/talk.css" />
{{<rawhtml>}}
    <script>
      window.G_CONFIG = {
        api: "https://tg-talk.yurl.eu.org",
        ref: "g-container",
        template: "custom",
        zoom: true,
      };
      document.addEventListener("DOMContentLoaded", () => {
          document.getElementById("load-more").style.display = "none";
      })
    </script>
{{</rawhtml>}}
  <p style="text-align: end; bottom: 0; right:50%;">Powered by <a href="https://github.com/ChenYFan">TGTalk</a></p>
</div>