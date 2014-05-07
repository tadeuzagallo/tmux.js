build: browserify uglify

browserify:
	browserify -o dist/tmux.js tmux.js -r ./tmux.js:tmux.js

uglify:
	uglifyjs dist/tmux.js -o dist/tmux.min.js --source-map dist/tmux.min.map
