const fs = require('fs');
const path = require("path");

/**
 * @see https://github.com/chalk/ansi-regex
 * ANSI转义序列是带信号的标准编码,用于控制视频文本终端和终端模拟器上的光标位置、颜色、字体样式
 */
function ansiRegex({onlyFirst = false} = {}) {
  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'].join('|');
  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

/**
 * https://xtermjs.org/docs/api/vtfeatures/#bell
 * 终端行打印时需要根据控制符抹除部分字符显示，比如BS，删除前一个显示字符
 */
function eraseTerminalSequence(line) {
  // line = line.replace(/[\x00\x07\x0B\x0C\x0E\x0F\x1B]/g, '');
  let left = line.replace(/[\x07]/g, '');
  let right = left.replace(/(.\x08)/, '');
  while (left !== right) {
    left = right;
    right = left.replace(/(.\x08)/, '');
  }
  return right;
}

const util = require('util');
const strContainAnsi = ']1337;PostExec;Exit=0;CurrentDir=/root;Timestamp=1661857938;[root@VM-4-34-centos ~]# ';
const strContainsControl = '[2022/08/31 15:42:07] [2022/08/31 15:42:07] [root@VM-4-34-centos helloworld]# vi a.txt \b\b\b\b\b\bb.txt \n';

console.log(JSON.stringify(eraseTerminalSequence(strContainsControl.replace(ansiRegex(), ''))));
console.log(strContainsControl);



