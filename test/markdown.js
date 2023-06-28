function formatMarkdown(input) {
  // 检查是否每个连续的三个反引号(```)前后都有换行符
  // 如果没有，则添加它们
  input =
    '\n' +
    '例如，这里有一个简单的 Hello World 脚本：\n' +
    '```bash\n' +
    '#!/bin/bash\n' +
    '# 打印出 "Hello, World!"\n' +
    'echo "Hello, World!"\n' +
    '```\n' +
    '要在 Linux 系统中运行这个脚本';

  console.log(input);
  let output = input.replace(/([^`\n])```/g, '$1\n```\n').replace(/```([^`\n])/g, '```\n$1');

  // 删除空行上的空格
  output =output.replace(/(^|\S)(`{3})/g, '$1\n$2').replace(/(`{3})(\S|$)/g, '$1\n$2');

  return output;
}

console.log(formatMarkdown('123'));
