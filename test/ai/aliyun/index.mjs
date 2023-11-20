import fetch from 'node-fetch';

fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer xxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'qwen-turbo',
    input: {
      messages: [
        {
          "role": "system",
          "content": "你是WebShell AI助手."
        },
        {
          "role": "user",
          "content": "如何安装szrz？"
        }
      ]
    },
    parameters: {
      result_format: 'message'
    }
  })
})
  .then(res=>res.json()).then(res => {
    return res.output.choices[0].message;
  }).then(console.log)
  .catch(console.error);

