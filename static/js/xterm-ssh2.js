/**
 * xterm-ssh2.ejs
 */
import {SearchAddonBar} from '/js/search-addon-bar.js';
import {RecordScreenAddon} from '/js/record-screen-addon.js';

const textEncoder = new TextEncoder();

var isFullscreen = false;
term = new Terminal({
  // fontFamily: 'Hack Nerd Font',
  fontSize: fontSizeOptions[2], fontWeight: 'normal', letterSpacing: 0, cursorBlink: true, theme: {
    // selection: '#0000ff',
    // selectionBackground: '#00ffff',
    foreground: '#a5a2a2', // 解决自定义背景支持
    background: '#09030000', cursor: '#a5a2a2',

    black: '#090300', brightBlack: '#5c5855',

    red: '#db2d20', brightRed: '#e8bbd0',

    green: '#01a252', brightGreen: '#3a3432',

    yellow: '#fded02', brightYellow: '#4a4543',

    blue: '#01a0e4', brightBlue: '#807d7c',

    magenta: '#a16a94', brightMagenta: '#d6d5d4',

    cyan: '#b5e4f4', brightCyan: '#cdab53',

    white: '#a5a2a2', brightWhite: '#f7f7f7'
  }, rendererType: 'canvas', //  canvas,dom
  minimumContrastRatio: 1, // 开启透明支持-支持CSS实现终端背景图设定
  allowTransparency: true, allowProposedApi: true, overviewRulerWidth: 8,
});
window.term = term;
/**
 * 终端会话连接与zsession
 */
let isZsession = false;
let zsentry = new Zmodem.Sentry({
  to_terminal: function _to_terminal(data) {
    if (!isZsession) {
      term.write(data);
    }
  },

  sender: (data) => {
    socket.send(new Uint8Array(data));
  },

  on_retract: function _on_retract() {
    term.write('\rtransfer cancelled\r\n');
  },

  on_detect: async function _on_detect(detection) {
    isZsession = true;
    try {
      await processZSession(detection);
    } finally {
      isZsession = false;
      console.log(isZsession);
    }
  },
});

term.onSelectionChange(() => {
  // const selectionMaskEl = term.element.getElementsByClassName('xterm-selection')[0].children[0];
  // const newLeft = +selectionMaskEl.style.left.replace('px', '') - term._core._renderService._renderer.dimensions.actualCellWidth * 2;
  // selectionMaskEl.style.left = (newLeft > 0 ? newLeft : 0) + 'px';
  term.getSelection() && copyToClipboard(term.getSelection());
  console.log('onSelectionChange', term.getSelection());
});

// 开启终端
const termRef = document.getElementById('terminal-container');
term.open(termRef);
term.focus();


// 终端自定义打印内容
term.loadAddon(new WebLinksAddon.WebLinksAddon((event, uri) => {
  if (event.metaKey) {
    window.open(uri);
  }
}));
let searchAddon = new SearchAddon.SearchAddon();
serializeAddon = new SerializeAddon.SerializeAddon();

const canvasAddon = new CanvasAddon.CanvasAddon();

let searchAddonBar = new SearchAddonBar({
  searchAddon
});

let recordScreenAddon = new RecordScreenAddon();

window.recordScreenAddon = recordScreenAddon;

term.loadAddon(searchAddon);
term.loadAddon(searchAddonBar);
term.loadAddon(serializeAddon);
term.loadAddon(recordScreenAddon);
term.loadAddon(canvasAddon);
term.loadAddon(new Unicode11Addon.Unicode11Addon());
const localEcho = new LocalEchoController();
term.loadAddon(localEcho);

// Auto-completes common commands
function autocompleteCommonCommands(index, tokens) {
  if (index == 0) return ['cp', 'mv', 'ls', 'chown'];
  return [];
}

// Auto-completes known files
function autocompleteCommonFiles(index, tokens) {
  if (index == 0) return [];
  return ['.git', '.gitignore', 'package.json'];
}

// Register the handlers
localEcho.addAutocompleteHandler(autocompleteCommonCommands);
localEcho.addAutocompleteHandler(autocompleteCommonFiles);

const fitAddon = new FitAddon.FitAddon();

term.loadAddon(fitAddon);
fitAddon.fit();

term.unicode.activeVersion = '11'

term.attachCustomKeyEventHandler(/**
 *
 * @param event
 * @returns {boolean}
 */
function (event) {
  if (event.type !== 'keydown') {
    return;
  }

  if ('`' === event.key && event.ctrlKey) {
    console.log('ai command search???');
    return false;
  }

  if (['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1 && event.ctrlKey && event.shiftKey) {
    console.log('左右tab切换-tab');
    return false;
  }
  if (['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1 && event.shiftKey) {
    console.log('左右tab切换-window');
    return false;
  }
  // alternate screen模式比如vim模式下不开启终端检索
  if (event.key === 'f' && (event.metaKey || event.ctrlKey) && term.buffer.active.type === 'normal') {
    event.preventDefault();
    searchAddonBar.show();
    return true;
  }


  if (event.key === ',' && event.ctrlKey && event.altKey) {
    console.log(event);
    return;
  }


  /**
   * 如果在session会话中需要实现取消
   * 由于开启zmodem会话时关闭了attach插件，因此这里WS直接发送取消命令
   */
  if (event.key === 'c' && event.ctrlKey) {
    if (activeZsession) {
      if (activeZsession.type === 'send') {
        zsessionCanceled = true;
      } else {
        try {
          activeZsession._skip();
        } catch {

        }
        zsessionCanceled = true;
      }
      console.log('zsessionCanceled', zsessionCanceled);
    }
    term.writeln('');
    if (term.hasSelection()) {
      navigator.clipboard.writeText(term.getSelection());
      console.log('CV？');
    } else {
      console.log('no Selection for CV');
    }
    return;
  }

  if (event.key === '.' && event.ctrlKey && event.altKey) {
    console.log(event);
    return false;
  }

  if (event.key === 'Escape') {
    searchAddonBar.hide();
  }
  if (event.key === 'k' && (isMac ? event.metaKey : event.ctrlKey)) {
    term.clear();
    event.preventDefault();
    return false;
  }

  if (event.key === 'x' && event.ctrlKey) {
    let line = term.buffer.active.getLine(term.buffer.active.cursorY);
    console.log(line.translateToString());
    goOpenAi({
      model: 'gpt', prompt: 'curl请求https://1991421.cn，获取网页状态码'
    }).then(res => {
      term.write('\x1b[2K\r')
      term.writeln(res.answer);
    })
    return false;
  }

  if (event.key === '=' && event.shiftKey && (isMac ? event.metaKey : event.altKey)) {
    console.log('11111', event);
    event.preventDefault();
  }

  if (event.key === '-' && event.shiftKey && (isMac ? event.metaKey : event.altKey)) {
    console.log('22222', event);
    event.preventDefault();
  }

  return true;
});
term.onData((data) => {
  socket.send(JSON.stringify({
    type: 'data', data
  }))
});
term.onLineFeed(() => {
  CurrentDirRecord[term.buffer.active.cursorY] = CurrentDir; // 当前得到的目录根据行进行记录
});

let isAltKeyDown = false;
let scrollDistance = 0;

termRef.addEventListener('keydown', function (event) {
  if (event.altKey) {
    isAltKeyDown = true;
  }
});
termRef.addEventListener('keyup', function (event) {
  if (event.altKey) {
    isAltKeyDown = false;
  }
});

// 监听鼠标滚动事件
termRef.addEventListener('wheel', function (event) {
  if (isAltKeyDown) {
    scrollDistance += event.deltaY;
    if (Math.abs(scrollDistance) >= 120) {
      const preFontSize = term.options.fontSize;
      if (scrollDistance < 0) {
        if ((fontSizeOptions.indexOf(preFontSize) - 1) >= 0) {
          // 向上滚动，缩小字体
          term.options.fontSize = fontSizeOptions[fontSizeOptions.indexOf(preFontSize) - 1];
          console.log('缩小字体', preFontSize, term.options.fontSize);
        } else {
          console.log('缩小字体', '已经是最小', term.options.fontSize);
        }
      } else {
        // 向下滚动，放大字体
        if (fontSizeOptions.indexOf(preFontSize) + 1 < fontSizeOptions.length) {
          term.options.fontSize = fontSizeOptions[fontSizeOptions.indexOf(preFontSize) + 1];
          console.log('放大字体', preFontSize, term.options.fontSize);
        } else {
          console.log('放大字体', '已经是最大', term.options.fontSize);
        }
      }
      // 重置滚动距离
      scrollDistance = 0;
    }

    // 阻止默认滚动行为
    event.preventDefault();
  }
});

socket = new WebSocket(`${webSocketBaseUrl}/ws/webshell`);
socket.binaryType = 'arraybuffer';


async function processZSession(detection) {
  activeZsession = detection.confirm();
  var promise;
  zsessionCanceled = false;
  if (activeZsession.type === 'send') {
    promise = handleUploadSession(activeZsession);
  } else {
    promise = handleDownloadSession(activeZsession);
  }
  try {
    await promise;
  } catch (e) {
    console.error(e);
  }
}

function feedFromSession(buffer) {
  const chunkSize = 1024;
  for (let i = 0; i <= Math.floor(buffer.byteLength / chunkSize); i++) {
    try {
      zsentry.consume(buffer.slice(i * chunkSize, (i + 1) * chunkSize));
    } catch (e) {
      isZsession = false
      activeZsession && activeZsession.abort()
    }
  }
  if (!isZsession) {
    const dataStr = Uint8ArrayToString(new Uint8Array(buffer));
    if (clientRecordLogFlag) {
      clientRecordLogBlobs.push(dataStr);
    }
    const currenDirArr = dataStr.match(/(;CurrentDir=)([^;\u0007]+)/); // 根据PS1获取CWD
    if (currenDirArr?.length >= 3) {
      CurrentDir = currenDirArr[2];
    }
  }
}

socket.addEventListener('close', () => {
  location.reload();
});
socket.addEventListener('open', () => {
  sendData('connect', JSON.parse(document.getElementById('proxyHost').value));
});

socket.addEventListener('message', (evt) => {
  console.log(term.buffer.active.type);
  if (typeof evt.data === 'string') {
    const options = parseData(evt);
    if (options.type === 'search') {
      if (options.data.length) {
        options.data = options.data.replace(/\n$/, '');
        updateSearchResult(options.data.split('\n').map(item => {
          return item.split(':');
        }), options.keyword);
      } else {
        updateSearchResult([], options.keyword);
      }

    }
    if (options.type === 'codeserver') {
      /**
       * workspace
       * folder参数控制缺省打开文件夹,不传则走前端存储的最后打开文件夹
       * ?folder=/home
       */
      let codeServerWeb = document.getElementById('visitIDEDirectly').checked ? (`/tty/${options.proxyKey}/`) : (`/ide/${options.proxyKey}/`);
      console.log(`访问地址：${window.location.protocol}//${window.location.host}${codeServerWeb}`);
      if (window.toggleNewTabOn.checked) {
        window.open(codeServerWeb, '_blank');
      } else {
        location.href = codeServerWeb;
      }
    } else if (options.type === 'codeserver-logout') {
      alert('stop code server successful');
    } else if (options.type === 'websocket-proxy') {
      window.open(`${window.location.protocol}//${window.location.host}/tty/cm9vdEA0My4xNTQuMTgyLjE4Nw==/`);
    } else {
      term.write(evt.data);
    }
  } else {
    feedFromSession(evt.data);
  }
});

function _save_to_disk(xfer, buffer) {
  return Zmodem.Browser.save_to_disk(buffer, xfer.get_details().name);
}


/**
 * SZ接受文件
 */
function handleDownloadSession(zsession) {
  zsession.on('offer', function (xfer) {
    async function on_form_submit() {
      const FILE_BUFFER = [];
      term.write('\x1b[2K\r'); // 清除活跃行内容
      await new Promise(resolve => {
        xfer.on('input', (payload) => {
          if (zsessionCanceled) {
            resolve();
            return;
          }
          FILE_BUFFER.push(new Uint8Array(payload));
          showMessage(getProgressBar(xfer.get_details().size, xfer.get_offset()), true);
        });
        xfer.accept().then(() => {
          showMessage(`${xfer.get_details().name} download completed.`, true);
          resolve();
          _save_to_disk(xfer, FILE_BUFFER);
        }, console.error.bind(console))
      })
      if (zsessionCanceled) {
        showMessage(`${xfer.get_details().name} download canceled.`, true);
      }
    }

    on_form_submit();
  });
  zsession.start();
  return new Promise((resolve) => {
    activeZsession.on('session_end', () => {
      activeZsession = null;
      resolve();
    });
  });
}

function debounce(fn, wait = 300) {
  let timeId;
  return function () {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}

/**
 * rz接收文件
 */
async function handleUploadSession(zsession) {
  let files = [];
  if (window.showOpenFilePicker) {
    try {
      const fileHandles = await window.showOpenFilePicker({
        multiple: true
      });
      files = await Promise.all(fileHandles.map(f => f.getFile()));
    } catch (e) {
      console.error(e);
    }
  } else {
    const fileEl = document.getElementById('zm_files');
    fileEl.click();
    files = await new Promise((resolve) => {
      fileEl.onchange = async (_e) => {
        const {files} = fileEl;
        resolve(files);
      };
      fileEl.onclick = (_e) => {
        fileEl.value = null;
      };
      document.body.onfocus = () => {
        setTimeout(() => {
          if (fileEl.files.length === 0) {
            resolve(fileEl.files);
          }
        }, 500);
      };
    });
    fileEl.onchange = async (_e) => {
    };
    fileEl.onclick = (_e) => {
      fileEl.value = null;
    };
  }
  const uploadFiles = async () => {
    const batch = [];
    let totalSize = 0;
    for (let f = files.length - 1; f >= 0; f--) {
      const fobj = files[f];
      totalSize += fobj.size;
      batch[f] = {
        obj: fobj,
        name: fobj.name,
        size: fobj.size,
        mode: 0o644,
        files_remaining: files.length - f,
        bytes_remaining: totalSize,
      };
    }

    for (const curb of batch) {
      const file = curb.obj;
      term.write('\x1b[2K\r');
      const xfer = await zsession.send_offer(curb);
      if (xfer) {
        const contentBuffers = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async function () {
            resolve(reader.result);
          };
          reader.readAsArrayBuffer(file);
        });
        let chunkIndex = 0;
        const chunkLength = Math.ceil(contentBuffers.byteLength / 1024);

        // 需要同步化执行循环操作
        while (true) {
          if (zsessionCanceled || chunkIndex >= chunkLength) {
            break;
          }
          await new Promise(resolve => window.setTimeout(resolve, 0));
          const chunk = new Uint8Array(contentBuffers.slice(chunkIndex * 1024, (chunkIndex + 1) * 1024));
          await xfer.send(chunk);
          console.log('getProgress(xfer)', getProgress(xfer));
          showMessage(getProgressBar(xfer.get_details().size, xfer.get_offset()), true);
          chunkIndex = chunkIndex + 1;
        }
        if (zsessionCanceled) {
          showMessage(`${file.name} upload canceled.`, true);
        } else {
          showMessage(`${file.name} upload completed.`, true);
        }
        await xfer.end();
      } else {
        showMessage(`${file.name} rejected.`);
      }
    }
  }
  await uploadFiles();
  await zsession.close();
  activeZsession = null;
  return Promise.resolve();
}

function showMessage(msg, overwrite = false) {
  if (overwrite) {
    term.write('\x1b[2K\r');
    term.write(textEncoder.encode(`\r${msg}${SPACER}`));
  } else {
    term.write(textEncoder.encode(`\r${msg}${SPACER}`));
    term.write(textEncoder.encode(`\r\n`));
  }
}

function getProgress(xhr) {
  return (xhr.get_offset() * 100 / xhr.get_details().size).toFixed(2) + '%';
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

/**
 * 清除光标所在行内容
 * @param term
 */
function eraseActiveLine(term) {
  term.write('\x1b[2K\r');
}

function Encodeuint8arr(myString) {
  return new TextEncoder('utf-8').encode(myString);
}

function Decodeuint8arr(uint8array) {
  return new TextDecoder('utf-8').decode(uint8array);
}

const appMousetrap = Mousetrap(document.body);

appMousetrap.bind(['ctrl+,',], function (e) {
  console.log('ctrl+,', e);
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});


/**
 * 全局AI热键绑定
 */
appMousetrap.bind(['mod+i',], function (e) {
  console.log('mod i', e);
  return false;
});

/**
 * 清屏
 * mod在Mac下即⌘，在windows等系统下即ctrl
 */
appMousetrap.bind(['mod+k', 'ctrl+k'], function (e) {
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});
/**
 * 开启新终端Tab
 */
appMousetrap.bind(['ctrl+alt+,', 'alt+t', 'alt+w', 'alt+d'], function (e) {
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});

/**
 * 关闭当前终端Tab
 */
appMousetrap.bind(['ctrl+alt+.'], function (e) {
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});

/**
 * 分屏打开
 */
appMousetrap.bind(['ctrl+alt+;'], function (e) {
  console.log('meta+;', e);
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});


appMousetrap.bind(['mod+1', 'mod+2', 'mod+3', 'mod+4', 'mod+5'], function (e) {
  console.log('command k or control k', e);

  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});

appMousetrap.bind('?', function () {
  console.log('show help doc');
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});

/**
 * windows下走f11默认也可以，不需要JS支持
 */
appMousetrap.bind(['mod+enter', 'f11'], function () {
  if (!isMac) {
    return true;
  }
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen({
      navigationUI: 'hide'
    })
  }
  // return false to prevent default browser behavior
  // and stop event from bubbling
  return false;
});
//
appMousetrap.bind([isMac ? 'mod+shift+=' : 'alt+shift+='], function (e) {
  console.log('increase font size', e);
  term.options.fontSize = fontSizeOptions[(fontSizeOptions.indexOf(term.options.fontSize) + 1) % fontSizeOptions.length];
  return false;
});
appMousetrap.bind([isMac ? 'mod+shift+-' : 'alt+shift+-'], function (e) {
  console.log('decrease font size', e);
  term.options.fontSize = fontSizeOptions[(fontSizeOptions.indexOf(term.options.fontSize) - 1 + fontSizeOptions.length) % fontSizeOptions.length];
  return false;
});

/**
 * 获取文件内容，同时高亮命中文本，滚动到指定位置
 * @param event
 */
function searchResultItemOnClick(event) {
  sftpSocket.send(JSON.stringify({
    type: 'get-file', path: event.target.dataset.path
  }));


}

function Uint8ArrayToString(fileData) {
  let dataString = '';
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);

  }
  return dataString

}


function joinPath(l, r) {
  return `${l}/${r}`.replace(/\/{2,}/g, '/');
}

import SftpClient from '/js/sftp-client.js';

const sftpSocket = new SftpClient(`${webSocketBaseUrl}/ws/sftp`);
// 树JS文档 https://github.com/daweilv/treejs
const rootPath = '/home/lighthouse';
let typeMode;

// 文件树
let zTreeObj;
let zTreeNodeSelectedId = rootPath;
// 文本编辑器
let codeEditor;

function handleSearch(event) {
  if (event.key === 'Enter') {
    socket.send(JSON.stringify({
      type: 'search', path: zTreeNodeSelectedId, data: event.target.value
    }))
  }
}

function myOnClick(event, treeId, treeNode) {
  typeMode = 'get-file';
  if (treeNode.type === '-') {
    sftpSocket.send('get-file', {path: treeNode.id});
  }
  zTreeNodeSelectedId = treeNode.id;
}

function zTreeOnExpand(event, treeId, treeNode) {
  sftpSocket.send('list', {
    path: treeNode.id
  });
}

$(document).ready(function () {
  zTreeObj = $.fn.zTree.init($('#file-tree'), {
    callback: {
      onClick: myOnClick, onExpand: zTreeOnExpand
    }
  }, [{
    id: rootPath, name: rootPath, children: [], type: 'd'
  }]);
});


sftpSocket.on('binary-data', (data) => {
  if (typeMode === 'get-file') {
    data.text().then((value) => {
      codeEditor.getModel().setValue(value);
    })
    console.log(data.toString());
  } else if (typeMode === 'download-file') {
    saveFile(data, window.term.getSelection());
    return;
  }
});

sftpSocket.on('connected', () => {
  sftpSocket.send('list', {
    path: rootPath
  });
});
sftpSocket.on('list', (data) => {
  const parentNode = zTreeObj.getNodeByParam('id', data.path, null);
  zTreeObj.removeChildNodes(parentNode);
  zTreeObj.addNodes(parentNode, data.data.map(item => ({
    id: joinPath(data.path, item.name), name: item.name, children: item.type === 'd' ? [] : null, type: item.type
  })));
});
sftpSocket.on('put-file', () => {
  alert(`${zTreeNodeSelectedId} saved!`);
});

// require is provided by loader.min.js.
require.config({paths: {'vs': 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.34.0/min/vs'}});
require(['vs/editor/editor.main'], () => {
  codeEditor = monaco.editor.create(document.getElementById('monaco_editor'), {
    value: '', language: 'javascript', theme: 'vs-dark', fontSize: '14px', minimap: {
      enabled: false
    }
  });

  // let actions = codeEditor.getSupportedActions().map((a) => a.id);
  // console.log(actions);

  codeEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
    sftpSocket.send('put-file', {
      path: zTreeNodeSelectedId, data: codeEditor.getValue()
    });
  });
});

// window.addEventListener('beforeunload', (e) => {
//   e.preventDefault();
//   e.returnValue = 'Changes you made may not be saved.';
// });


function saveFile(content, filename) {
  const a = document.createElement('a');
  const file = new Blob([content], {type: 'application/zip'});
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
}

$('#terminal-container').contextmenu(function (e) {
  const menu = [['download file', // title
    function (key, opt) {
      const filename = window.term.getSelection();
      const selectionPosition = window.term.getSelectionPosition();
      console.log(filename, selectionPosition);
      typeMode = 'download-file';
      const cwd = CurrentDirRecord[selectionPosition.startRow] || CurrentDir;
      sftpSocket.send('stat-file', {
        path: joinPath(cwd, filename)
      }).once('stat-file', (data) => {
        if (data.error) {
          alert(data.error.message);
        } else if (data.data.isFile) {
          sftpSocket.send('download-file', {
            path: joinPath(cwd, filename)
          });
        } else {
          alert('not file, can not download!');
        }
      });
    }],];
  ContextMenu.render(e, menu, this); //开始渲染
});


import gitSpec from '/js/fig-autocomplete/git.js';
import cdSpec from '/js/fig-autocomplete/cd.js';

console.log(gitSpec);
console.log(cdSpec);