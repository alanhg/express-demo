/**
 * @see https://github.com/chalk/ansi-regex
 * ANSI转义序列是带信号的标准编码,用于控制视频文本终端和终端模拟器上的光标位置、颜色、字体样式
 */
function ansiRegex({onlyFirst = false} = {}) {
  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'].join('|');
  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

const util = require('util');
const strContainAnsi = ']1337;PostExec;Exit=0;CurrentDir=/root;Timestamp=1661857938;[root@VM-4-34-centos ~]# ';
const strContainsControl = 'vi a\btest.sh';

console.log(strContainAnsi);
console.log(strContainsControl);

console.log(strContainsControl.toString());
const fs = require('fs');
const path = require("path");

fs.writeFileSync(path.join(__dirname, 'a.log'), strContainsControl);


