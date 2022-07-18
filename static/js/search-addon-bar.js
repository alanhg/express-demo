/**
 * 搜索工具栏UI插件
 * 使用例子
 *   let searchAddon = new SearchAddon.SearchAddon();
 *   let searchAddonBar = new SearchAddonBar({
 *     searchAddon
 *   });
 *
 *  if (event.key === 'f' && event.metaKey) {
 *       event.preventDefault();
 *       searchAddonBar.show();
 *       return false;
 *     }
 */
export class SearchAddonBar {
  constructor(options) {
    if (!options.searchAddon) {
      console.error('inorder use search-addon-bar, xterm-addon-search should load firstly.');
      return;
    }
    const {searchAddon, ...searchOptions} = options;
    this.searchAddon = searchAddon;
    this.searchOptions = {
      /**
       * 正则表达式
       */
      regex: true,
      /**
       * 单词
       */
      wholeWord: false,
      /**
       * 区分大小写
       */
      caseSensitive: false,
      decorations: {
        matchBackground: '#ffff00',
        activeMatchBackground: '#ff9632'
      },
      ...searchOptions
    }
    this.onFindNextDebounce = debounce(this.onFindNext);
  }

  activate(term) {
    this.term = term;
    this.parentContainerEl = this.term.element.parentElement;
    this.searchAddon.onDidChangeResults((res) => {
      if (res) {
        const {resultIndex, resultCount} = res;
        this.resultElement.innerHTML = `${resultIndex + 1}/${resultCount}`;
      } else {
        this.resultElement.innerHTML = '';
      }
    });
  }

  dispose() {
    this.onHide();
  }

  show() {
    this.visible = true;
    const elements = this.term.element.parentElement.getElementsByClassName('search-terminal');
    if (elements.length) {
      this.inputElement.focus();
      return;
    }
    const searcherEl = document.createElement('div');
    searcherEl.className = 'search-terminal';

    this.parentContainerEl.style.position = 'relative';
    searcherEl.style.top = '0';
    searcherEl.style.left = (this.parentContainerEl.querySelector('.xterm-viewport').clientWidth - 285 - 20) + 'px';

    searcherEl.innerHTML = `
    <input/>
    <span class="search-result-count"></span>
    <button class="pre"></button>
    <button class="next"></button>
    <button class="match-case ${this.searchOptions.caseSensitive ? 'active' : ''}">Aa</button>
    <button class="match-word ${this.searchOptions.wholeWord ? 'active' : ''}">W</button>
    <button class="match-regex ${this.searchOptions.regex ? 'active' : ''}">.*</button>
    <button class="close"></button>`;
    this.parentContainerEl.appendChild(searcherEl);
    searcherEl.children[0].focus();
    const buttonEls = searcherEl.querySelectorAll('button');
    const inputElement = searcherEl.querySelector('input');
    const resultElement = searcherEl.querySelector('.search-result-count');

    this.inputElement = inputElement;
    this.searcherElement = searcherEl;
    this.resultElement = resultElement;

    inputElement.addEventListener('keydown', this.onKeyDown.bind(this));
    buttonEls[0].addEventListener('click', this.onFindPre.bind(this));
    buttonEls[1].addEventListener('click', this.onFindNext.bind(this));
    buttonEls[2].addEventListener('click', this.onMatchCase.bind(this));
    buttonEls[3].addEventListener('click', this.onMatchWord.bind(this));
    buttonEls[4].addEventListener('click', this.onMatchRegex.bind(this));
    buttonEls[5].addEventListener('click', this.onHide.bind(this));
  }

  onFindPre() {
    let value = this.inputElement.value;
    this.searchAddon.findPrevious(value, this.searchOptions);
  }

  onFindNext() {
    let value = this.inputElement.value;
    this.searchAddon.findNext(value, this.searchOptions);
  }

  onKeyDown(event) {
    let value = this.inputElement.value.trim();
    if (!value) {
      this.searchAddon.clearDecorations();
      return;
    }
    if (event.key === 'Enter') {
      this.onFindNext();
    } else {
      return this.onFindNextDebounce();
    }
  }

  /**
   * 搜索销毁
   */
  onHide() {
    this.searcherElement.remove();
    this.searchAddon.clearDecorations();
    this.term.focus();
    this.visible = false;
  }

  onMatchWord(event) {
    this.searchOptions.wholeWord = !this.searchOptions.wholeWord;
    this.toggleActiveClass(event.target);
    this.searchAddon.clearDecorations();
    this.onFindNext();
  }

  onMatchCase(event) {
    this.searchOptions.caseSensitive = !this.searchOptions.caseSensitive;
    this.toggleActiveClass(event.target);
    this.searchAddon.clearDecorations();
    this.onFindNext();
  }

  onMatchRegex(event) {
    this.searchOptions.regex = !this.searchOptions.regex;
    this.toggleActiveClass(event.target);
    this.searchAddon.clearDecorations();
    this.onFindNext();
  }

  toggleActiveClass(el) {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
    } else {
      el.classList.add('active');
    }
  }
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

