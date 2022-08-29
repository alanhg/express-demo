const fs = require('fs');
const path = require('path');

const xtermJS = ['xterm-addon-search', 'xterm-addon-web-links', 'xterm-addon-web-links', 'xterm-addon-attach', 'xterm']

xtermJS.forEach(f => {
  fs.copyFileSync(path.join(__dirname, 'node_modules', f, `lib/${f}.js`), path.join(__dirname, 'static', `js/xterm/${f}.js`));
});

fs.copyFileSync(path.join(__dirname, 'node_modules', `nora-zmodemjs/dist/zmodem.js`), path.join(__dirname, 'static', `js/xterm/zmodem.js`));

fs.copyFileSync(path.join(__dirname, 'node_modules', `xterm/css/xterm.css`), path.join(__dirname, 'static', `js/xterm/xterm.css`));

fs.copyFileSync(path.join(__dirname, 'node_modules', 'mousetrap/mousetrap.min.js'), path.join(__dirname, 'static', `js/mousetrap.min.js`));
fs.copyFileSync(path.join(__dirname, 'node_modules', '@widgetjs/tree/dist/tree.min.js'), path.join(__dirname, 'static', `js/tree.min.js`));
