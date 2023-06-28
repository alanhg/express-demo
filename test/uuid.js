// const {v4: uuidv4} = require('uuid');
// const pt = require('path');
// const key = `${uuidv4()}${pt.extname('format-arw-PXjQaGxi4JA-unsplash.jpg')}`;
//
// console.log(key);


function extractCommandFromAI(msg) {
  const myRegexp = /(\n*```\n*)([\s\S]*?)(\1)|(\n*`\n*)([^`]*)(\4)/;
  const match = msg.match(myRegexp);
  if (match !== null) {
    if (match[2] !== undefined) {
      return match[2].replace(/\n/g,'');
    }
    if (match[5] !== undefined) {
      return match[5].replace(/\n/g,'')
    }
  }
}

console.log(extractCommandFromAI('```\nls\n```'));
