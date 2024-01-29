(function (window) {
  function mokerConsole(debugMode, content) {
    this.debugMode = debugMode;
  }

  mokerConsole.prototype.init = function () {
    if (this.debugMode) {
      console.log("mokerConsole 在调试模式下运行，项目可能出现问题，请留意！");
    }
  };
  mokerConsole.prototype.call = function (content) {
    console.log(`%c %c Output %c ${content} `,
    'color: #3eaf7c; font-size: 16px;line-height:30px;',
    'background: #35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff',
    'background: #41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff',
  );  };

  window.mokerConsole = mokerConsole;
})(window);