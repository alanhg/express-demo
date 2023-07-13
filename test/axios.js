const axios = require('axios');
const {formatTime} = require('../lib/utils');
//
// async function main() {
//   try {
//     await axios.get('https://raw.githubusercontent.com/alanhg/alfred-workflows/master/surge/src/info.plist')
//   } catch (e) {
//     console.log(e);
//   }
// }
//
// try {
//   main();
// } catch (e) {
//   console.log(e);
// }

// console.log(formatTime(0));
// console.log(formatTime(61));
let count = 0;
const intervalId = setInterval(() => {
      count++;
      if (count > 10) {
        clearInterval(intervalId);
      }
      const a = null;
      console.log(Math.random());
      console.log(a.b);
    },
    1000);


function hiddenStr(inputStr, start, end) {
  return inputStr.split('').reduce((res, item, idx) => {
    if (idx >= start && idx <= end) {
      return res + '*';
    }
    return res + item;
  }, '')
}

console.log(hiddenStr('21212121', 1, 3));

