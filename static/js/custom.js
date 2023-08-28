function isFontCached() {
    return localStorage.getItem('cachedFont') === 'true';
  }
  function cacheFont() {
    localStorage.setItem('cachedFont', 'true');
  }
  function loadFont() {
    document.body.style.fontFamily = 'LXGW, LXGW Wenkai, lxgwwenkailite, LXGWWenKaiLite, -apple-system, BlinkMacSystemFont, helvetica neue, Helvetica, segoe ui,Roboto, Oxygen, Ubuntu, Cantarell, open sans, Arial, pingfang sc, hiragino sans gb, hiragino sans, microsoft yahei, wenquanyi micro hei, noto sans sc,  sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji, android emoji, emojisymbols, emojione';
  }
if (isFontCached()) {
    console.log('%c字体缓存: Existence', 'color: green; font-weight: bold;');
    loadFont();
} else {
    console.log('%c字体缓存: Missing', 'color: red; font-weight: bold;');
    console.log('%c字体缓存机制: Caching', 'color: blue; font-weight: bold;');
    cacheFont();
    loadFont();
    console.log('%c字体缓存机制: Success', 'color: green; font-weight: bold;');
  }
