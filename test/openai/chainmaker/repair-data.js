const jsonl = require("node-jsonl");
const path = require("path");
const fs = require("fs");
const rl = jsonl.readlines(path.join(__dirname, "chainmaker_faq.jsonl"));

const writeStream = fs.createWriteStream('output.jsonl');

async function main() {
  while (true) {
    const {value, done} = await rl.next()
    if (done) break;
    console.log(value); // value => T

    writeStream.write(JSON.stringify({
      messages: [
        {role: "system", content: '你是一个区块链-长安链技术专家，能帮助用户解答区块链相关的技术问题。'},
        {role: "user", content: value.messages}, {
        role: "assistant", content: value.output
      }]
    }) + '\n');
  }
}

main();
