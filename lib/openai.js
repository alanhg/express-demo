const {Configuration, OpenAIApi} = require("openai");

const models = {
  // Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.
  'text-davinci-003': 'text-davinci-003',

  // The Codex models are descendants of our GPT-3 models that can understand and generate code. Their training data contains both natural language and billions of lines of public code from GitHub. Learn more.
  'code-cushman-001': 'code-cushman-001'
}

class OpenaiBot {
  constructor(apiKey) {
    this.openai = new OpenAIApi(new Configuration({apiKey}));
  }

  /**
   * 命令功能描述，返回AI生成命令
   * @param text
   */
  sayShellContext(text) {
    return this.say(`我想写一个命令，需求是${text}。\n`).then(res => {
      return res.data.choices[0].text.replace(/^\n/, '');
    });
  }

  say(text) {
    console.log(text);
    return this.openai.createCompletion({
      model: models["text-davinci-003"], prompt: text, temperature: 0, max_tokens: 150, // suffix: '',
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

openaiBot.sayShellContext("curl请求https://1991421.cn，返回状态码").then((response) => {
  console.log(response);
});

