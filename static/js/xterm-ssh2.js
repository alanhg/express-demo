function goOpenAi({model, prompt}) {
  return fetch('/api/openai', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      model,
      prompt
    })
  }).then(res => res.json())
}

const webSocketBaseUrl = `${location.protocol === `https:` ? 'wss:' : 'ws:'}//${location.host}`;

document.getElementById('proxyHost').value = JSON.stringify(connectOpts, null, 2);
const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const isWin = navigator.platform.indexOf('Win') > -1;


/**
 * 测试高频打印数据
 */
function onPrintBtnClick() {
  let index = 0;
  window.term.blur();
  window.term.writeln('');
  const intervalId = setInterval(() => {
    window.term.write((index++) + '\r');
    if (index > 10000000) {
      clearInterval(intervalId);
    }
  })
}

function onInfinitePrintBtnClick() {
  let index = 0;
  while (true) {
    window.term.write((index++) + '\r');
  }
}

function recordLogStart(event) {

  event.target.innerText = event.target.dataset.start === 'true' ? 'log record start' : 'log record stop';
  event.target.dataset.start = event.target.dataset.start !== 'true';

  if (event.target.dataset.start === 'true') {
    window.recordScreenAddon.start();
  } else {
    window.recordScreenAddon.stop();
  }

  fetch(`/ssh2-log?start=${event.target.dataset.start}&&recordTimestamp=${document.getElementById('record-timestamp').checked}`, {
    method: 'get',
  }).then(() => {
    if (event.target.dataset.start === 'false') {
      const anchorElement = document.createElement('a');
      anchorElement.download = 'ssh-log-record.log';
      anchorElement.href = '/logs/ssh-log-record_plaintext.log';
      anchorElement.click();
    }
  });
}


function serializeTerminal(event) {
  console.log(serializeAddon.serialize());
}

function clientRecordLogStart(event) {
  event.target.innerText = event.target.dataset.start === 'true' ? 'client log record start' : 'client log record stop';
  event.target.dataset.start = event.target.dataset.start !== 'true';
  clientRecordLogFlag = event.target.dataset.start === 'true';
  if (clientRecordLogFlag) {
    clientRecordLogBlobs = [];
  } else {
    let htmlAnchorElement = document.createElement('a');
    htmlAnchorElement.style.display = 'hidden';
    htmlAnchorElement.download = Date.now() + '.log';
    htmlAnchorElement.href = URL.createObjectURL(new Blob(clientRecordLogBlobs));
    htmlAnchorElement.click();
  }
}

function runCodeServer(e) {
  sendData('codeserver', {
      proxyProtocol: document.getElementById('proxyProtocol').value
    }
  )
}

function stopCodeServer(e) {
  sendData('codeserver-logout')
}

function toggleBackgroundOn(e) {

}

function toggleNewTabOn(e) {
  window.toggleNewTabOn = e.target.checked;
}

const SPACER = '            ';
var socket, activeZsession, zsessionCanceled = false, attachAddon, serializeAddon, term, clientRecordLogFlag,
  clientRecordLogBlobs = [], CurrentDir = '/root';

const CurrentDirRecord = [];

function parseData(evt) {
  try {
    return JSON.parse(evt.data);
  } catch {
    return evt.data;
  }
}

function sendData(type, data = {}) {
  socket.send(JSON.stringify({
    type,
    data
  }))
}

const fontSizeOptions = [12, 14, 16, 18, 20];
