# tmux.js #

A tmux plugin for [zsh.js](https://github.com/tadeuzagallo/zsh.js)


## Usage ##

```js
var zsh = require('zsh.js'),
    tmux = require('tmux.js');

zsh.create('container');
tmux.init(zsh);
```

## Current available commands

Tmux prefix is set to the default, `C-b`

And right now you can:

* Create a new window with `C-b c`
* Move to the window at right with `C-b <right>` or `C-b l`
* Move to the window at left with `C-b <left>` or `C-b h`
* Delete the current window with `C-b q`
