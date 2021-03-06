require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Stream = (function () {
  function Stream() {
    _classCallCheck(this, Stream);

    this._callbacks = {};
  }

  _createClass(Stream, [{
    key: 'on',
    value: function on(event, callback) {
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }

      this._callbacks[event].push(callback);
    }
  }, {
    key: 'write',
    value: function write(data) {
      this.emmit('data', data);
    }
  }, {
    key: 'emmit',
    value: function emmit(event, data) {
      var callbacks = this._callbacks[event];
      callbacks && callbacks.forEach(function (callback) {
        callback(data);
      });
    }
  }]);

  return Stream;
})();

exports['default'] = Stream;
module.exports = exports['default'];

},{}],"N8OV1Y":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _zshJsLibStreamJs = require('zsh.js/lib/stream.js');

var _zshJsLibStreamJs2 = _interopRequireDefault(_zshJsLibStreamJs);

var Tmux = (function () {
  function Tmux(terminal) {
    _classCallCheck(this, Tmux);

    this.terminal = terminal;
    this.windows = [];
    this.index = 0;
    this.using = null;
    this.waiting = false;

    this.setUp();
    this.listen();
    this.newWindow();
  }

  _createClass(Tmux, [{
    key: 'setUp',
    value: function setUp() {
      this.terminal.container.innerHTML = '';
      this.terminal.statusbar.innerHTML = '';

      this.container = this.terminal.container;
      this.terminal.container = null;

      var statusbar = this.terminal.statusbar;
      this.terminal.statusbar = null;

      var statusList = document.createElement('ul');
      this.rootTab = this.createTabLabel(true, 0).tab;
      statusbar.appendChild(statusList);
      this.statusbar = statusList;
    }
  }, {
    key: 'listen',
    value: function listen() {
      var _this = this;

      this.originalStdin = this.terminal.stdin;
      this.terminal.stdin = new _zshJsLibStreamJs2['default']();
      this.terminal.stdin.on('data', function (event) {
        return _this.onKeyDown(event);
      });
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(event) {
      if (this.waiting) {
        this.waiting = false;

        switch (event.keyCode) {
          case 67:
            // C
            this.newWindow();
            break;
          case 37: // left
          case 72:
            // H
            this.index--;

            if (this.index < 0) {
              this.index = this.windows.length - 1;
            }

            this.use(this.windows[this.index]);
            break;
          case 39: // right
          case 76:
            // L
            this.index++;

            if (this.index >= this.windows.length) {
              this.index = 0;
            }

            this.use(this.windows[this.index]);
            break;
          case 81:
            // Q
            this.removeWindow(this.windows[this.index]);
            this.windows.splice(this.index, 1);

            if (this.windows.length) {
              this.index--;
              if (this.index < 0) {
                this.index = 0;
              }

              this.use(this.windows[this.index]);
            } else {
              this.container.innerHTML = '';
            }
            break;
        }

        return;
      }

      if (event.keyCode === 66 && event.ctrlKey) {
        // C-b
        this.waiting = true;
      } else {
        this.originalStdin.write(event);
      }
    }
  }, {
    key: 'createTabLabel',
    value: function createTabLabel(indexOnly, id) {
      var tab = document.createElement('li');
      var index = document.createElement('span');
      var data = document.createElement('span');

      data.className = 'data';
      index.className = 'index';
      index.innerHTML = id;

      tab.appendChild(data);
      data.appendChild(index);

      var ps = null;
      if (!indexOnly) {
        ps = document.createElement('span');
        ps.className = 'ps';
        data.appendChild(ps);
      }

      return {
        tab: tab,
        ps: ps
      };
    }
  }, {
    key: 'newWindow',
    value: function newWindow() {
      var w = document.createElement('div');
      w.className = 'tmux';

      var id = 1;
      for (var i = 0, l = this.windows.length; i < l; i++) {
        if (this.windows[i].id !== id) {
          break;
        } else {
          id++;
        }
      }

      var window = {
        id: id,
        window: w,
        tab: this.createTabLabel(false, id)
      };

      this.index = i;
      this.windows.push(window);

      this.use(window);
      this.update();
    }
  }, {
    key: 'use',
    value: function use(window) {
      if (this.using) {
        this.using.tab.tab.className = false;
        this.using.currentPath = this.terminal.currentPath;
      }

      this.container.innerHTML = '';
      this.container.appendChild(window.window);

      this.terminal.container = window.window;
      this.terminal.statusbar = window.tab.ps;

      window.tab.tab.className = 'active';

      if (window.currentPath) {
        this.terminal.FS.currentPath = window.currentPath;
      }

      this.terminal.update();
      this.using = window;
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      this.windows = this.windows.sort(function (a, b) {
        return a.id - b.id;
      });

      this.statusbar.innerHTML = '';
      this.statusbar.appendChild(this.rootTab);

      this.windows.forEach(function (window) {
        _this2.statusbar.appendChild(window.tab.tab);
      });
    }
  }, {
    key: 'removeWindow',
    value: function removeWindow(window) {
      this.statusbar.removeChild(window.tab.tab);
    }
  }]);

  return Tmux;
})();

exports['default'] = Tmux;
module.exports = exports['default'];

},{"zsh.js/lib/stream.js":1}],"tmux.js":[function(require,module,exports){
module.exports=require('N8OV1Y');
},{}]},{},["N8OV1Y"])