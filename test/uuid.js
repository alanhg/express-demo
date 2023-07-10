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
      return match[2].replace(/\n/g, '');
    }
    if (match[5] !== undefined) {
      return match[5].replace(/\n/g, '')
    }
  }
}

/**
 * 创建进度条
 * @param styleIndex
 * @returns {function(*, *): string}
 */
function createProgressBar(styleIndex = 0) {
  return (total, current) => {
    const styleList = [['█', '░'], ['#', ' ']];// 进度条风格
    const style = styleList[styleIndex] || styleList[0];
    const progressBarLength = 40;  // 进度条的长度
    const progress = Math.floor((current / total) * progressBarLength);
    const empty = progressBarLength - progress;
    const progressBar = style[0].repeat(progress) + style[1].repeat(empty);
    return `(${progressBar}) ${((current / total) * 100).toFixed(2)}%`;
  };
}

function drawerProgressBar() {
  const getProgressBar = createProgressBar(0);
  let total = 1323200;
  let current = 501111;
  const timer = setInterval(() => {
    if (current >= total) {
      process.stdout.write('\r' + getProgressBar(total, total));
      clearInterval(timer);
      return;
    }
    process.stdout.write('\r' + getProgressBar(total, current));
    current += 10000;
  }, 100);
}


drawerProgressBar();
