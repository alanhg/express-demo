const {Configuration, OpenAIApi} = require('openai');

/**
 * model见
 * @see https://platform.openai.com/docs/models/overview
 */
const models = {
  // Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.
  'text-davinci-003': 'text-davinci-003',

  // The Codex models are descendants of our GPT-3 models that can understand and generate code. Their training data contains both natural language and billions of lines of public code from GitHub. Learn more.
  'code-cushman-001': 'code-cushman-001', 'code-davinci-002': 'code-davinci-002'
}

class OpenaiBot {
  constructor(apiKey, organizationId) {
    if (!apiKey) {
      console.error('apiKey missing!')
      process.exit(0);
    }
    this.openai = new OpenAIApi(new Configuration({apiKey, organization: organizationId}));
  }

  /**
   * 命令功能描述，返回AI生成命令
   * @param text
   */
  sayShellContext(text) {
    const prompt = `我想写一个命令，需求是${text}。\n`;
    return this.say({
      model: models['text-davinci-003'],
      prompt: prompt,
    }).then(res => {
      console.log(prompt);
      return res.data.choices[0].text.replace(/^\n/, '');
    });
  }

  /**
   * 命令功能描述，返回AI生成命令
   * @param text
   */
  sayShellContext2(text) {
    const prompt = `#!/bin/bash\n\n# ${text}.\n`;
    return this.say({
      prompt: prompt, model: models['code-davinci-002'],
      stop: ['##'],
      suffix: '',
    }).then(res => {
      console.log(prompt);
      return res.data.choices[0].text.replace(/^\n/, '');
    });
  }

  sayJSContext() {

  }

  /**
   * @see https://beta.openai.com/docs/api-reference/completions
   */
  say(options) {
    return this.openai.createCompletion({
      temperature: 0.5, max_tokens: 150, // suffix: '',
      model: models['text-davinci-003'], best_of: 1, presence_penalty: 0, top_p: 1, frequency_penalty: 0, ...options
      // stop: ["input:"],
    });
  }
}

let openaiBot = new OpenaiBot(process.env.OPENAI_API_KEY, process.env.OPENAI_ORGINIZATION_ID);

// openaiBot.openai.listModels().then((data) => {
//   console.log('API called successfully. Returned data: ' + data);
// });

module.exports = openaiBot;

