const axios = require('axios');

async function main() {
  try {
    await axios.get('https://raw.githubusercontent.com/alanhg/alfred-workflows/master/surge/src/info.plist')
  } catch (e) {
    console.log(e);
  }
}

try {
  main();
} catch (e) {
  console.log(e);
}
