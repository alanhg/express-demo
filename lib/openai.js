const {Configuration, OpenAIApi} = require('openai');

/**
 * model见
 * @see https://platform.openai.com/docs/models/overview
 */
const models = {
  'text-curie-001': 'text-curie-001',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  // 'text-davinci-003': 'text-davinci-003',
  // 'code-cushman-001': 'code-cushman-001', // codex
  'code-davinci-002': 'code-davinci-002',// codex
  'gpt-4': 'gpt-4',
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
   * codex
   */
  sayShellContextForGPT3(text) {
    const prompt = `我想写一个命令，需求是${text}。\n`;
    return this.say({
      model: models['text-curie-001'],
      prompt: prompt,
    }).then(res => {
      console.log(prompt);
      return res.data.choices[0].text.replace(/^\n/, '');
    });
  }

  sayShellContextForCodex(text) {
    const prompt = `我想写一个命令，需求是${text}。\n`;
    return this.say({
      model: models['code-davinci-002'],
      prompt: prompt,
    }).then(res => {
      console.log(res);
      return res.data.choices[0].text.replace(/^\n/, '');
    });
  }

  /**
   * 命令功能描述，返回AI生成命令
   * @param text
   */
  sayShellContextByGPT4(text) {
    const prompt = `我想写一个命令，需求是${text}。\n`;
    return this.say({
      model: models['gpt-4'],
      prompt: prompt,
    }).then(res => {
      console.log(prompt);
      return res.data.choices[0].text.replace(/^\n/, '');
    });
  }

  /**
   * https://platform.openai.com/docs/models/gpt-3-5
   */
  sayShellContextByGPT35(text, context = []) {
    const prompt = text;
    return this.openai.createChatCompletion({
      model: models['gpt-3.5-turbo'],
      messages: [
        ...context,
        {
          role: 'user',
          content: prompt
        }],
      max_tokens: 1000
    }).then(res => {
      return res.data.choices[0].message.content;
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

  testModeration(request) {
    return this.openai.createModeration(request).then(res => res.data);
  }
}

let openaiBot = new OpenaiBot(process.env.OPENAI_API_KEY, process.env.OPENAI_ORGINIZATION_ID);

// openaiBot.openai.listModels().then((data) => {
//   console.log('API called successfully. Returned data: ' + data);
// });

module.exports = openaiBot;

