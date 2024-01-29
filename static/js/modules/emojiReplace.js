/*
 * Author: Krcc & FloatSheep
 * Description: Replacing :xxx: to xxx emoji
 * Date: 2024/02/26 18:26
 */

(function(window) {
  function EmojiReplacer(debugMode) {
    this.debugMode = debugMode;
  }

  EmojiReplacer.prototype.init = function() {
    if (this.debugMode) {
      console.log("EmojiReplacer 在调试模式下运行，网页可能生成错误，请留意！");
    }
    this.replaceTextInDocument(document.body); // 直接调用以确保在DOMContentLoaded后恰当时机运行
  };

  EmojiReplacer.prototype.replaceTextInDocument = function(rootNode) {
    const replaceText = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const excludedTags = ["script", "style", "textarea", "iframe"];
        if (
          node.nodeValue.includes(":") &&
          !excludedTags.includes(node.parentNode.nodeName.toLowerCase())
        ) {
          const newHTML = node.nodeValue.replace(/:([\w_]+):/g, (match, p1) => {
            const emojiUrl = `https://api.hesiy.cn/api/emoji?emoji=${p1}`;
            return `<img class="emoji-object" src="${emojiUrl}" alt="${match}" onclick="document.emojiReplacer.copyEmoji('${match}')">`;
          });
          const wrapper = document.createElement("span");
          wrapper.innerHTML = newHTML;
          node.parentNode.replaceChild(wrapper, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(replaceText);
      }
    };

    replaceText(rootNode);
  };

  EmojiReplacer.prototype.copyEmoji = function(emojiText) {
    if (this.debugMode) {
      console.log(
        `\n %c User clicked %c ${emojiText} \n`,
        "color: #fadfa3; background: #030307; padding:5px 0;",
        "background: #fadfa3; padding:5px 0;"
      );
    }
  };

  window.EmojiReplacer = EmojiReplacer;
})(window);