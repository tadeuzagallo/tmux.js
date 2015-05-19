'use strict';

export default class Tmux {
  constructor(terminal) {
    this.terminal = terminal;
    this.windows = [];
    this.index = 0;
    this.using = null;
    this.waiting = false;

    this.setUp();
    this.listen();
    this.newWindow();
  }

  setUp() {
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

  listen() {
    this.keyDownListener = window.onkeydown || function() {};
    window.onkeydown = this.onKeyDown.bind(this);

    Object.defineProperty(window, 'onkeydown', {
      set: (value) => this.keyDownListener = value,
      get: () => this.keyDownListener,
    });
  }

  onKeyDown(event) {
    if (this.waiting) {
      this.waiting = false;

      switch (event.keyCode) {
        case 67: // C
          this.newWindow();
          break;
        case 37: // left
        case 72: // H
          this.index--;

          if (this.index < 0) {
            this.index = this.windows.length - 1;
          }

          this.use(this.windows[this.index]);
          break;
        case 39: // right
        case 76: // L
          this.index++;

          if (this.index >= this.windows.length) {
            this.index = 0;
          }

          this.use(this.windows[this.index]);
          break;
        case 81: // Q
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

    if (event.keyCode === 66 && event.ctrlKey) { // C-b
      this.waiting = true;
    } else if (this.keyDownListener) {
      this.keyDownListener(event);
    }
  }

  createTabLabel(indexOnly, id) {
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

  newWindow() {
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

  use(window) {
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

  update() {
    this.windows = this.windows.sort((a, b) => a.id - b.id );

    this.statusbar.innerHTML = '';
    this.statusbar.appendChild(this.rootTab);

    this.windows.forEach((window) => {
      this.statusbar.appendChild(window.tab.tab);
    });
  }

  removeWindow(window) {
    this.statusbar.removeChild(window.tab.tab);
  }
}
