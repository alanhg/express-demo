const {v4: uuidv4} = require('uuid');
const pt = require('path');
const key = `${uuidv4()}${pt.extname('format-arw-PXjQaGxi4JA-unsplash.jpg')}`;

console.log(key);