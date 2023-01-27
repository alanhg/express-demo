const {Configuration, OpenAIApi} = require("openai");

class OpenaiBot {
  constructor(apiKey) {
    this.openai = new OpenAIApi(new Configuration({apiKey}));
  }

  /**
   * 补充命令上下文
   * @param text
   */
  sayShellContext(text) {
    return this.say(`我想写一个命令，需求是${text}。\n`)
  }

  say(text) {
    console.log(text);
    return this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: text,
      temperature: 0,
      max_tokens: 150,
      // suffix: '',
      // top_p: 1,
      // frequency_penalty: 0.0,
      // presence_penalty: 0.0,
      // stop: ["input:"],
    });
  }
}

let openaiBot = new OpenaiBot(process.env.OPENAI_API_KEY);

// openaiBot.openai.listModels().then((data) => {
//   console.log('API called successfully. Returned data: ' + data);
// });

openaiBot.sayShellContext("打包当前文件夹A").then((response) => {
  console.log(response.data);
});

