const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8');

console.log(content.match(/(?<=password: ).+/)[0].replace(/^"|"$/g, ''));
