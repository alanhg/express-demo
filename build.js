const fs = require('fs');
const path = require('path');
fs.copyFileSync(path.join(__dirname, 'node_modules', 'xterm-addon-search', 'lib/xterm-addon-search.js'), path.join(__dirname, 'static', 'js/xterm-addon-search.js'));
fs.copyFileSync(path.join(__dirname, 'node_modules', 'xterm-addon-web-links', 'lib/xterm-addon-web-links.js'), path.join(__dirname, 'static', 'js/xterm-addon-web-links.js'));
fs.copyFileSync(path.join(__dirname, 'node_modules', 'xterm', 'lib/xterm.js'), path.join(__dirname, 'static', 'js/xterm.js'));
