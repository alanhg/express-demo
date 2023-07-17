/**
 * xtermjs 自动补全插件
 * 补全规范为fig规范
 *
 * require: CWD支持
 *
 * ## Install
 * 1. ln -sf ../../../autocomplete/build ./static/js/fig-autocomplete
 * 2. echo '[[ -f ~/.bash-preexec.sh ]] && source ~/.bash-preexec.sh' >> ~/.bashrc
 */
export class AutoCompleteAddon {
  specs = [];

  constructor(options = {}, webshell) {
    this.webshell = webshell;
  }


  activate(term) {
    this.term = term;
    this.loadSpecs();
    this.watchUserInput();
  }

  watchUserInput() {
    const {term} = this;

    term.onData((data, event) => {
      console.log(term.buffer.active.type);

      /**
       * 终端必须处于Normal模式下才能进行输入
       */

      if (term.buffer.active.type === 'normal') {
        if (this.isAutoCompleteTrigerred(data)) {
          this.autoCompleteTrigger();
        }
      }
    });
  }

  /**
   * 空格之后
   */
  isAutoCompleteTrigerred(data) {
    return data === ' ';
  }

  dispose() {

  }

  /**
   * 加载规范及相关文件
   */
  loadSpecs() {
    [].forEach((name) => {
      import(`/js/fig-autocomplete/${name}.js`);
    });
    autocompleteSpecArr.forEach((name) => {
      import(`/js/fig-autocomplete/${name}`).then((module) => {
        this.specs.push(module.default);
      });
    });
  }


  /**
   * 自动补全触发,执行命令/提示子命令，生成建议选项
   */
  async autoCompleteTrigger() {
    let currentLineContent = term.buffer.active.getLine(term.buffer.active.cursorY).translateToString();
    currentLineContent = currentLineContent.substring(0, term.buffer.active.cursorX);
    console.log('currentLineContent', currentLineContent);

    const inputEntireCommand = currentLineContent.split('$').pop().trim();

    const inputCommand = inputEntireCommand.split(' ').shift().trim();

    console.log('inputEntireCommand', inputEntireCommand, 'inputCommand', inputCommand);

    /**
     * cd git => cd
     * git --help => git
     */
    const spec = this.specs.find(spec => spec.name === inputCommand);
    if (spec) {
      const suggestions = await this.createSuggestions(spec);
      const position = this.calculateCursorPosition();
      console.log('suggestions', suggestions, 'position', position);
      this.term.blur();
      this.renderSuggestions(suggestions, position);
    }
  }


  /**
   * 执行命令，获取推荐结果进行渲染
   * @param suggestions
   * @param position
   */
  async renderSuggestions(suggestions, position) {
    let template = document.getElementById('suggestion-template'); // 获取模板
    let suggestionBox = document.querySelector('.suggestion-box'); // 获取显示建议列表的 div 元素
    suggestionBox.innerHTML = ''; // 清空之前的建议列表
    suggestions.forEach((suggestion, idx) => {
      let clone = template.content.cloneNode(true); // 克隆模板的内容
      let divEl = clone.querySelector('.suggestion-item'); // 获取新建的 divEl 元素
      divEl.textContent = `${suggestion.name}${suggestion.description ? '(' + suggestion.description + ')' : ''}`; // 设置建议的文本内容
      divEl.dataset.name = suggestion.name;
      if (idx === 0) {
        divEl.classList.add('active');
        divEl.focus();
      }
      suggestionBox.appendChild(clone); // 将建议添加到建议列表中
    });

    suggestionBox.style.left = position.x + 10 + 'px';
    suggestionBox.style.top = position.y + 24 + 'px';
    suggestionBox.onclick = (e) => {
      console.log(e.target.dataset.name);
      this.webshell.sendData('data', e.target.dataset.name);
      this.webshell.term.focus();
      suggestionBox.innerHTML = ''; // 清空之前的建议列表
    };
  }


  calculateCursorPosition() {
    let cursorX = term.buffer.active.cursorX;
    let cursorY = term.buffer.active.cursorY;
    let pixelX = cursorX * 10;
    let pixelY = cursorY * 20;
    return {
      x: pixelX,
      y: pixelY
    }
  }

  /**
   * 生成建议选项
   * @param spec
   * @returns {Promise<*[]>}
   *
   * spec.args.generators.trigger判断是否需要处理缓存
   */
  async createSuggestions(spec) {
    const suggestions = [];

    if (spec.args) {
      if (spec.args.generators?.custom) {
        const commandResult = (cmd) => {
          let execCommand = this.webshell.execCommand(`cd ${this.webshell.currentWorkingDirectory} && ${cmd.replace(/^command /, '')}`);
          return execCommand.then(res => {
            return res.data;
          });
        };
        const res = await spec.args.generators.custom([], commandResult, {
          'currentProcess': 'bash',
          currentWorkingDirectory: this.webshell.currentWorkingDirectory,
          searchTerm: '',
          sshPrefix: '',
          'environmentVariables': {}
        });
        suggestions.push(...res);
      }

      if (spec.args.suggestions) {
        suggestions.push(...spec.args.suggestions);
      }

      if (spec.args.template) {
        if (typeof spec.args.template === 'string'
            && spec.args.template === 'filepaths') {

        }
      }
    }

    if (spec.subcommands) {
      suggestions.push(...spec.subcommands);
    }

    if (spec.suggestions) {
      suggestions.push(...spec.suggestions);
    }

    if (spec.options) {
      suggestions.push(...spec.options);
    }
    return suggestions;
  }
}
