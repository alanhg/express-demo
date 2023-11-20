import fetch from 'node-fetch';

/**
 * https://cloud.baidu.com/doc/WENXINWORKSHOP/s/jlil56u11
 * @returns {Promise<any>}
 */
async function getToken() {
  const API_KEY = '';
  const SECRET_KEY = '';
  return fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`).then(res => res.json())
    .then(res=>{
      console.log(res);
      return res.access_token;
    });
}

fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${await getToken()}`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer xxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
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
  })
}).then(res=>res.json()).then(console.log).catch(console.error);
