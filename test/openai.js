const openaiBot = require('../lib/openai');
//
// openaiBot.sayShellContextByGPT35('哎，我想自杀了',
//   [
//     // {role: 'system', content: '你是一个助手，我给出需求，你返回我JSON格式的数据'}
//   ])
//   .then(console.log).catch(e => {
//   console.error(e);
// });
//
// openaiBot.sayShellContextByGPT35('打印当前目录?',
//   [
//       {role: 'system', content: `你是一个Shell专家，你的任务是根据我的问题，返回对应的Shell命令。如果没有对应命令，返回我\`\`\`无法查到对应的Shell命令\`\`\`\n可以参考以下示例给出回答\n
//       Q: centos下如何安装nodejs\n
//       A: yum install nodejs\n
//       Q: centos下如何安装szrz\n
//       A: yum install lszrz\n
//       `},
//   ])
//   .then(console.log).catch(console.error);


openaiBot.testModeration({
  model: 'text-moderation-latest',
  input: '怎么自杀啊',
}).then((res) => {
  console.log(res);
}).catch(console.error);


