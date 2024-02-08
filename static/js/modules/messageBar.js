(function (window) {
  function messageBar(debugMode) {
    this.debugMode = debugMode;
  }
  messageBar.prototype.init = function () {
    document.mC.call("messageBar 初始化完成！");
  };
  messageBar.prototype.show = function (
    text,
    showAction,
    actionText,
    textColor,
    pos,
    delay
  ) {
    Snackbar.show({
      text: text,
      showAction: showAction,
      actionText: actionText,
      textColor: textColor,
      pos: pos,
      customClass: "mB-global",
      duration: delay,
    });
  };

  window.messageBar = messageBar;
})(window);
