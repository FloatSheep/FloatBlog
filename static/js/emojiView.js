/*
* Author: Krcc & FloatSheep
* Description: Replacing :xxx: to xxx emoji
* Date: 2024/02/26 18:26
*/

document.addEventListener('DOMContentLoaded', () => {
  const replaceText = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const excludedTags = ['script', 'style', 'textarea'];
      if (node.nodeValue.includes(':') && !excludedTags.includes(node.parentNode.nodeName.toLowerCase())) {
        const newHTML = node.nodeValue.replace(/:([\w_]+):/g, (match, p1) => {
          const emojiUrl = `https://api.hesiy.cn/api/emoji?emoji=${p1}`;
          return `<img class="emoji-object" src="${emojiUrl}" alt="${match}" onclick="copyEmoji('${match}')" style="cursor:pointer;">`;
        });
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newHTML;
        node.parentNode.replaceChild(wrapper, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(replaceText);
    }
  };

  replaceText(document.body);
});

const copyEmoji = emojiText => {
  console.log(`\n %c 用户点击 %c ${emojiText} \n`, "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");
};