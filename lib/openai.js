const {Configuration, OpenAIApi} = require("openai");

class OpenaiBot {
  constructor(apiKey) {
    this.openai = new OpenAIApi(new Configuration({apiKey}));
  }

  /**
   * 补充命令上下文
   * @param text
   */
  sayAboutShell(text) {
    return this.say(`我想写一个Shell命令，你能帮我下吗，需求是${text}`)
  }

  say(text) {
    return this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: text,
      temperature: 0,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    });
  }
}

new OpenaiBot(process.env.OPENAI_API_KEY).sayAboutShell("打包当前文件夹A").then((response) => {
  console.log(response.data);
});
