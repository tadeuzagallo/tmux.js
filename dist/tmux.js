require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"N8OV1Y":[function(require,module,exports){
'use strict';

var Tmux = {};
var Terminal;
var windows = [];

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
  this.rootTab = Tmux.createTabLabel(true).tab;
  statusbar.appendChild(statusList);
  Terminal._statusbar = statusList;

  this.newWindow();

  var _onkeydown = window.onkeydown || function () {};
  var waiting = false;
  window.onkeydown = function (event) {
    if (waiting) {
      waiting = false;

      if (event.keyCode === 67) { // c
        Tmux.newWindow();
      }

      return;
    }

    if (event.keyCode === 66 && event.ctrlKey) { // C-b
      waiting = true;
    } else {
      _onkeydown(event);
    }
  };

  Object.defineProperty(window, 'onkeydown', {
    set: function (value) {
      console.log(value);
      _onkeydown = value;
    },
    get: function () {
      return _onkeydown;
    }
  });
};

Tmux.createTabLabel = function (indexOnly) {
  var tab = document.createElement('li');

  var data = document.createElement('span');
  data.className = 'data';

  var index = document.createElement('span');
  index.className = 'index';
  index.innerText = windows.length;

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

  var window = {
    id: windows.count,
    window: w
  };

  windows.push(window);

  window.tab = this.createTabLabel();

  this.use(window);
  this.update();
};

var using = null;
Tmux.use = function (window) {
  if (using) {
    using.tab.tab.className = false;
  }

  Terminal._container.innerHTML = '';
  Terminal._container.appendChild(window.window);

  Terminal.container = window.window;
  Terminal.statusbar = window.tab.ps;

  window.tab.tab.className = 'active';
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

module.exports = Tmux;

},{}],"tmux.js":[function(require,module,exports){
module.exports=require('N8OV1Y');
},{}]},{},["N8OV1Y"])