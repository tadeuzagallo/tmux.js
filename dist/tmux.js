require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"tmux.js":[function(require,module,exports){
module.exports=require('N8OV1Y');
},{}],"N8OV1Y":[function(require,module,exports){
'use strict';
var Tmux = {};
var FS = require('zsh.js/lib/fs');
var Terminal;
var windows = [];
var index = 0;

Tmux.init = function (terminal) {
  Terminal = terminal;

  Terminal.container.innerHTML = '';
  Terminal.statusbar.innerHTML = '';
  windows = [];

  Terminal._container = Terminal.container;
  Terminal.container = null;

  var statusbar = Terminal.statusbar;
  Terminal.statusbar = null;

  var statusList = document.createElement('ul');
  this.rootTab = Tmux.createTabLabel(true, 0).tab;
  statusbar.appendChild(statusList);
  Terminal._statusbar = statusList;

  this.newWindow();

  var _onkeydown = window.onkeydown || function () {};
  var waiting = false;
  window.onkeydown = function (event) {
    if (waiting) {
      waiting = false;

      switch (event.keyCode) {
        case 67: // C
          Tmux.newWindow();
          break;
        case 37: // left
        case 72: // H
          index--;

          if (index < 0) {
            index = windows.length - 1;
          }

          Tmux.use(windows[index]);
          break;
        case 39: // right
        case 76: // L
          index++;

          if (index >= windows.length) {
            index = 0;
          }

          Tmux.use(windows[index]);
          break;
        case 81: // Q
          Tmux.removeWindow(windows[index]);
          windows.splice(index, 1);

          if (windows.length) {
            index--;
            if (index < 0) {
              index = 0;
            }

            Tmux.use(windows[index]);
          }
      }

      return;
    }

    if (event.keyCode === 66 && event.ctrlKey) { // C-b
      waiting = true;
    } else if (_onkeydown) {
      _onkeydown(event);
    }
  };

  Object.defineProperty(window, 'onkeydown', {
    set: function (value) {
      _onkeydown = value;
    },
    get: function () {
      return _onkeydown;
    }
  });
};

Tmux.createTabLabel = function (indexOnly, id) {
  var tab = document.createElement('li');

  var data = document.createElement('span');
  data.className = 'data';

  var index = document.createElement('span');
  index.className = 'index';
  index.innerText = id;

  data.appendChild(index);
  tab.appendChild(data);

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
};

Tmux.newWindow = function () {
  var w = document.createElement('div');
  w.className = 'tmux';

  var id = 1;
  for (var i = 0, l = windows.length; i < l; i++) {
    if (windows[i].id !== id) {
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

  index = i;
  windows.push(window);

  this.use(window);
  this.update();
};

var using = null;
Tmux.use = function (window) {
  if (using) {
    using.tab.tab.className = false;
    using.currentPath = FS.currentPath;
  }

  Terminal._container.innerHTML = '';
  Terminal._container.appendChild(window.window);

  Terminal.container = window.window;
  Terminal.statusbar = window.tab.ps;

  window.tab.tab.className = 'active';

  if (window.currentPath) {
    FS.currentPath = window.currentPath;
  }

  Terminal.update();
  using = window;
};

Tmux.update = function () {
  windows = windows.sort(function (a, b) {
    return a.id - b.id;
  });

  Terminal._statusbar.innerHTML = '';
  Terminal._statusbar.appendChild(this.rootTab);

  windows.forEach(function (window) {
    Terminal._statusbar.appendChild(window.tab.tab);
  });
};

Tmux.removeWindow = function (window) {
  Terminal._statusbar.removeChild(window.tab.tab);
};

module.exports = Tmux;

},{}]},{},["N8OV1Y"])