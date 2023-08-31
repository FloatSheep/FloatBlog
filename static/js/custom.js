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

const checkWebpSupport = async () => {
  const supportsWebp = async ({ createImageBitmap, Image }) => {
    if (!createImageBitmap || !Image) return false;

    try {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      });

      await createImageBitmap(image);
      return true;
    } catch (error) {
      return false;
    }
  };

  const webpIsSupported = () => {
    let memo = null;
    return () => {
      if (!memo) {
        memo = supportsWebp(window);
      }
      return memo;
    };
  };

  try {
    const isSupported = await webpIsSupported()();
    return isSupported;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isWebpSupported = checkWebpSupport().then(result => {return result});

let fakeCheck

function client() {
  const userClient = document.getElementById('client-id');

  if (userClient) {
    if (isWebpSupported) {
      const InnerStep1 = `<div id="Step1"><span style="cursor: default;">WebP 兼容性: <span id="l-rc"><span style="color: green;">Compatible</span></span></span></div>`
      userClient.innerHTML = InnerStep1;
    } else {
      const InnerStep1 = `<div id="Step1"><span style="cursor: default;">WebP 兼容性: <span id="l-rc"><span style="color: red;">Exclusive</span></span></span></div>`
      userClient.innerHTML = InnerStep1;
      const l = document.getElementById("Step1");
      function deClick(e, t) {
        if (e === l) {
          l.addEventListener('click', function () {
            if (t) {
              document.getElementById('l-rc').innerHTML = '<span style="color: blue;">reCheck...</span>';
              setTimeout(() => {
                if (isWebpSupported) {
                  document.getElementById('l-rc').innerHTML = '<span style="color: green;">Compatible</span>';
                } else {
                  document.getElementById('l-rc').innerHTML = '<span style="color: red;">Exclusive</span>';
                }
              }, 1000)
            }
          });
        }
      }
      deClick(l, true);
    }
    fakeCheck = function() {
      const InnerStep1 = `<div id="Step1"><span style="cursor: default;">WebP 兼容性: <span id="l-rc"><span style="color: red;">Exclusive</span></span></span></div>`
      userClient.innerHTML = InnerStep1;
      const l = document.getElementById("Step1");
      function deClick(e, t) {
        if (e === l) {
          l.addEventListener('click', function () {
            if (t) {
              document.getElementById('l-rc').innerHTML = '<span style="color: blue;">reCheck...</span>';
              setTimeout(() => {
                if (isWebpSupported) {
                  document.getElementById('l-rc').innerHTML = '<span style="color: green;">Compatible</span>';
                } else {
                  document.getElementById('l-rc').innerHTML = '<span style="color: red;">Exclusive</span>';
                }
              }, 1000)
            }
          });
        }
      }
      deClick(l, true);
    }
    console.log('%cChecking...', 'color: green; font-weight: bold;');
  } else {
    console.log('%cStaying...', 'color: red; font-weight: bold;');
  }
}
export { fakeCheck }
client();
