export class AutoCompleteAddon {
  specs = [];

  constructor(webshell) {
    this.webshell = webshell;
    this.loadSpecs();
  }

  /**
   * 加载规范
   */
  loadSpecs() {
    ['cd', 'git', 'cat', 'ls'].forEach((name) => {
      import(`/js/fig-autocomplete/${name}.js`).then((module) => {
        this.specs.push(module.default);
      });
    });
  }


  /**
   * 自动补全触发,执行命令/提示子命令，生成建议选项
   * @param input
   */
  async autoCompleteTrigger(input) {
    const spec = this.specs.find(spec => spec.name === input);
    if (spec) {
      const suggestions = await this.createSuggestions(spec);
      this.renderSuggestions(suggestions, this.calculateCursorPosition());
    }
  }


  /**
   * 执行命令，获取推荐结果进行渲染
   * @param spec
   * @param position
   */
  async renderSuggestions(suggestions, position) {
    let template = document.getElementById('suggestion-template'); // 获取模板
    let suggestionBox = document.querySelector('.suggestion-box'); // 获取显示建议列表的 div 元素
    suggestionBox.innerHTML = ''; // 清空之前的建议列表
    suggestions.forEach(suggestion => {
      let clone = template.content.cloneNode(true); // 克隆模板的内容
      let divEl = clone.querySelector('.suggestion-item'); // 获取新建的 divEl 元素
      divEl.textContent = `${suggestion.name}(${suggestion.description})`; // 设置建议的文本内容
      divEl.dataset.name = suggestion.name;
      suggestionBox.appendChild(clone); // 将建议添加到建议列表中
    });
    suggestionBox.style.left = position.x + 10;
    suggestionBox.style.top = position.y + 24;

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
   */
  async createSuggestions(spec) {
    const suggestions = [];

    if (spec.args.generators) {
      console.log(spec.args.generators);
      const commandResult = (cmd) => {
        console.log(cmd);
        return this.webshell.execCommand(cmd.replace(/^command /, ''));
      };
      const res = await spec.args.generators.custom([], commandResult, {
        'currentProcess': 'bash',
        currentWorkingDirectory: '/home/ubuntu',
        searchTerm: '',
        sshPrefix: '',
        'environmentVariables': {}
      });
      suggestions.push(...res);
    }


    if (spec.args.template) {

    }

    if (spec.subcommands) {
      /**
       *
       */
      suggestions.push(...spec.subcommands);
    }

    if (spec.suggestions) {
      /**
       *   name: "-",
       *   description: "Switch to the last used folder",
       */
      suggestions.push(...spec.suggestions);
    }

    if (spec.options) {
      suggestions.push(...spec.options);
    }
    return suggestions;
  }
}
