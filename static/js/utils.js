const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const isWin = navigator.platform.indexOf('Win') > -1;
const webSocketBaseUrl = `${location.protocol === `https:` ? 'wss:' : 'ws:'}//${location.host}`;

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
          showMessage(getProgress(xfer), true);
        });
        xfer.accept().then(
            () => {
              showMessage(`${xfer.get_details().name} download completed.`);
              // term.focus();
              resolve();
              _save_to_disk(xfer, FILE_BUFFER);
            },
            console.error.bind(console)
        )
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
          showMessage(getProgress(xfer), true);
          chunkIndex = chunkIndex + 1;
        }
        if (zsessionCanceled) {
          showMessage(`${file.name} upload canceled.`);
        } else {
          showMessage(`${file.name} upload completed.`);
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

function getProgress(xhr) {
  console.log(xhr.get_offset());
  return (xhr.get_offset() * 100 / xhr.get_details().size).toFixed(2) + '%';
}

function Uint8ArrayToString(fileData) {
  let dataString = '';
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString
}


/**
 * 拷贝文本到系统剪贴板/浏览器剪贴板
 */
async function copy(content) {
  const doSystemCopy = () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    // 赋值
    textarea.value = content;
    // 选中
    textarea.focus();
    textarea.select();
    // 复制
    document.execCommand('copy');
    // 移除输入框
    document.body.removeChild(textarea);
  };

  if (navigator.clipboard) {
    return navigator.clipboard.writeText(content).catch(() => doSystemCopy());
  }
  return doSystemCopy();
}

/**
 * 返回文本从系统剪贴板/浏览器剪贴板
 */
async function paste() {
  const doSystemPaste = () => {
    const pasteTarget = document.createElement('div');
    pasteTarget.contentEditable = 'true';
    const actElem = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand('Paste');
    const paste = pasteTarget.innerText;
    actElem.removeChild(pasteTarget);
    return paste;
  };
  if (navigator.clipboard) {
    return navigator.clipboard.readText().catch(() => doSystemPaste());
  }
  return doSystemPaste();
}
