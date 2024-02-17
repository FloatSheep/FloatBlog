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

点击图片可放大

<script src="https://cdnjs.onmicrosoft.cn/ajax/libs/handlebars.js/4.7.7/handlebars.min.js"></script>
<style>
  .medium-zoom-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    transition: opacity .3s;
    will-change: opacity
  }

  .medium-zoom--opened .medium-zoom-overlay {
    cursor: pointer;
    cursor: zoom-out;
    opacity: 1
  }

  .medium-zoom-image {
    cursor: pointer;
    cursor: zoom-in;
    transition: transform .3s cubic-bezier(.2, 0, .2, 1) !important
  }

  .medium-zoom-image--hidden {
    visibility: hidden
  }

  .medium-zoom-image--opened {
    position: relative;
    cursor: pointer;
    cursor: zoom-out;
    will-change: transform
  }
</style>
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
              <div class="info-header"><p class="Tag"><span class="pageTag"><a class="point" onclick="speakTelegram()">#{{ @key }}</a></span> <span class="views">Views: {{views}}</span></p></div>
              <p class="text">{{tagConverter text}}</p>
              {{#if image}}
              <div class="image">
                {{#each image}} {{#unless (contains this "emoji")}}
                <img
                  src="{{ replaceImage this}}"
                  loading="lazy"
                  alt="这是一张图片"
                  data-zoomable
                />
                {{/unless}} {{/each}}
              </div>
              {{/if}}
              <span class="time">{{replaceTime time}}</span>
              {{tagChina text true}}
            </div>
            {{/if}} {{/each}}
          </div>
        </script>
            <script>
              function tagExtractor(text) {
                const regex = /<a[^>]*>#(.*?)<\/a>/g;
                const result = [];
                let match;
                while (match = regex.exec(text)) {
                  result.push(match[1]);
                }
                return result;
              }
              Handlebars.registerHelper("tagConverter", function (text) {
                const regex = /<a[^>]*>#(.*?)<\/a>/g;
                const result = text.replace(regex, "");
                return new Handlebars.SafeString(result);
              });
              Handlebars.registerHelper("tagExtractor", function (text) {
                const regex = /<a[^>]*>#(.*?)<\/a>/g;
                const result = [];
                let match;
                while (match = regex.exec(text)) {
                  result.push(match[1]);
                }
                return result;
              });
              Handlebars.registerHelper("tagChina", function (text, renderTagList) {
                const tags = tagExtractor(text);
                let result = "";
                if (renderTagList && tags.length > 0) {
                  // 只有当 renderTagList 为真且 tags 不为空时，才渲染 tagList
                  result += `<div class="tagList">`; // 添加 div 元素
                  for (let tag of tags) {
                    if (tag === 'SFCN') {
                      result +=`<span class="tagChina" id="safeChina" onclick="safeSnackbar()">#${tag}💫</span>`
                    } else {
                        result += `<span class="tagChina">#${tag}</span>`;
                    }
                  }
                  result += `</div>`; // 添加 div 元素
                }
                return new Handlebars.SafeString(result);
              });
              Handlebars.registerHelper("contains", function (str, sub) {
                return str.includes(sub);
              });
              Handlebars.registerHelper("not", function (value) {
                return !value;
              });
              Handlebars.registerHelper("replaceImage", function (originalLink) {
                var newLink = originalLink.replace(
                  /https:\/\/(.*?)\.cdn-telegram\.org\/file\/(.+)/,
                  'https://tg-talk-cdn.yurl.eu.org/?cdn-id=$1&proxy=$2'
                );
                return newLink;
              });
              Handlebars.registerHelper("replaceTime", (timestamp) =>
                new Date(timestamp).toLocaleString("zh-CN")
              );
            </script>
      {{</rawhtml>}}
      <center><button id="load-more" type="button">More...</button></center>
      </center>
      <script src="/js/gtalk.min.js"></script>
{{<rawhtml>}}
    <script>
      window.G_CONFIG = {
        api: "https://tg-talk.yurl.eu.org",
        ref: "g-container",
        zoom: true,
      };
      document.addEventListener("DOMContentLoaded", () => {
          document.getElementById("load-more").style.display = "none";
      })
      function speakTelegram(){
        document.mB.show("正在跳转到 Telegram", true, "我明白了！", "#FFF", "top-center", 1000);
        setTimeout(function () {
          open("https://t.me/nzspeak")
        }, 500);
      }
      function safeSnackbar() {
        document.mB.show("此消息经过人工审查，可为大陆用户展示", true, "我明白了！", "#FFF", "top-right", 5000);
      }
    </script>
{{</rawhtml>}}
  <script src="https://npm.onmicrosoft.cn/medium-zoom@1.1.0/dist/medium-zoom.min.js"></script>
  <p style="text-align: end; bottom: 0; right:50%;">Powered by <a href="#">GTalk</a> v1.0.0</p>
</div>