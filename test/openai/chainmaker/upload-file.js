const OpenAI = require('openai');
const fs = require('fs');
const openai = new OpenAI();


(async () => {
  // If you have access to Node fs we recommend using fs.createReadStream():
  await openai.files.create({file: fs.createReadStream('output.jsonl'), purpose: 'fine-tune'});
})();

