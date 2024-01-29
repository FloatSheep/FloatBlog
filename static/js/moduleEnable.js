document.addEventListener("DOMContentLoaded", function() {
  const pluginEnable = [
    new EmojiReplacer(true),
    new mokerConsole(true),
  ];

  pluginEnable.forEach(function(plugin) {
    if (plugin instanceof EmojiReplacer) {
      document.emojiReplacer = plugin;
    }
    if (plugin instanceof mokerConsole) {
      document.mC = plugin;
    }
    plugin.init();
    console.log("Plugin loaded:", plugin);
  });
});