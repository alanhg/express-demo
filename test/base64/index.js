const fs = require('fs');

const files = fs.readdirSync(__dirname);
console.log(files);

files.map(f => {
  if (f.includes('.png')) {
    const data = fs.readFileSync(__dirname + '/' + f, 'base64');
    console.log(f);
    console.log('data:image/png;base64,' + data);
  }
})
