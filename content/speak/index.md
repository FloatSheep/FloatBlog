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
<style>
#g-container .content-container {
  display: hidden;
}

#g-container .message {
  margin: 1.5rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: .8rem;
  -webkit-border-radius: .8rem;
  -moz-border-radius: .8rem;
  -ms-border-radius: .8rem;
  -o-border-radius: .8rem;
}

#g-container .text {
  font-size: 16px;
  color: #333;
}

#g-container .image {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

#g-container .image img {
  max-width: 92%;
  max-height: 92%;
  margin: 5px;
  object-fit: contain;
  border: .15rem solid #ddd;
}

#g-container .tagChina {
  color: #8989895c;
  text-align: right;
}

#load-more {
  margin-top: 1rem;
}
</style>
<script>
  Handlebars.registerHelper("tagConverter", function (text) {
    const regex = /<a[^>]*>(.*?)<\/a>/g;
    const result = text.replace(
      regex,
      `<p class="tagChina">$1</p>`
    );
    return new Handlebars.SafeString(result);
  });

  Handlebars.registerHelper("contains", function (str, sub) {
    return str.includes(sub);
  });

  Handlebars.registerHelper("not", function (value) {
    return !value;
  });

  Handlebars.registerHelper('replaceImage', function (originalLink) {
    var newLink = originalLink.replace('https://cdn5.cdn-telegram.org', 'https://tg-talk-cdn.yurl.eu.org');
    return newLink;
  });
</script>
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
          {{#each ChannelMessageData}}
            {{#if (not (contains text "Channel"))}}
              <div class="message">
                <p class="text">{{tagConverter text}}</p>
                {{#if image}}
                  <div class="image">
                    {{#each image}}
                      {{#unless (contains this "emoji")}}
                        <img src="{{ replaceImage this}}" loading="lazy" alt="image" data-zoomable />
                      {{/unless}}
                    {{/each}}
                    {{/if}}
                  </div>
                {{/if}}
              </div>
          {{/each}}
        </div>
      </script>
      {{</rawhtml>}}
      <button id="load-more" type="button">More...</button>
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
          document.getElementById("load-more").style.display = "none;"
      })

    </script>
{{</rawhtml>}}
  <script src="https://npm.onmicrosoft.cn/medium-zoom@1.1.0/dist/medium-zoom.min.js"></script>
  <p style="text-align: end; bottom: 0; right:50%;">Powered by <a href="#">GTalk</a> v1.0.0</p>
</div>