const fs = require('fs');
const path = require('path');

const xtermJS = ['xterm-addon-search', 'xterm-addon-web-links', 'xterm-addon-web-links', 'xterm-addon-attach', 'xterm']

xtermJS.forEach(f => {
  fs.copyFileSync(path.join(__dirname, 'node_modules', f, `lib/${f}.js`), path.join(__dirname, 'static', `js/xterm/${f}.js`));
});

fs.copyFileSync(path.join(__dirname, 'node_modules', `nora-zmodemjs/dist/zmodem.js`), path.join(__dirname, 'static', `js/xterm/zmodem.js`));
