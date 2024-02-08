document.addEventListener("DOMContentLoaded", function() {
  const pluginEnable = [
    new EmojiReplacer(true),
    new mokerConsole(true),
    new messageBar(),
  ];

  pluginEnable.forEach(function(plugin) {
    if (plugin instanceof EmojiReplacer) {
      document.emojiReplacer = plugin;
    }
    if (plugin instanceof mokerConsole) {
      document.mC = plugin;
    }
    if (plugin instanceof messageBar) {
      document.mB = plugin;
    }
    plugin.init();
    console.log("Plugin loaded:", plugin);
  });
  window.pluginLoaded = true;
});