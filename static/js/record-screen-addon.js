/**
 * 终端会话-屏幕录制插件
 * 接入socket？或手动录入信息？
 */
const DEFAULT_UI_BAR_CLASS_NAME = 'xterm-record-screen-addon';

export class RecordScreenAddon {
  constructor() {

  }

  activate(term) {
    this.term = term;
    this.parentContainerEl = this.term.element.parentElement;
  }

  dispose() {
    this.stop();
  }

  start() {
    const addonElement = document.createElement('div');
    addonElement.className = DEFAULT_UI_BAR_CLASS_NAME;
    this.parentContainerEl.style.position = 'relative';
    console.log(this.term.buffer.active);
    addonElement.style.top = `${this.term.buffer.active.viewportY}`;
    // 具体高度需要watch光标聚焦的line，经过计算获得
    addonElement.style.height = '100px';
    this.parentContainerEl.appendChild(addonElement);
    this.addonElement = addonElement;
  }

  stop() {
    this.addonElement && this.addonElement.remove();
  }
}
