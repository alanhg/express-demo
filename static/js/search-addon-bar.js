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
      regex: true, /**
       * 单词
       */
      wholeWord: false, /**
       * 区分大小写
       */
      caseSensitive: false, decorations: {
        matchOverviewRuler: '#cccc00',
        activeMatchColorOverviewRuler: '#ffff00',
        matchBorder: '#cc0',
        activeMatchBorder: '#ff0',
        activeMatchBackground: 'rgba(255, 255, 0, 0.125)',
      }, ...searchOptions
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
    // this.term.blur();
    if (elements.length) {
      this.inputElement.focus();
      return;
    }
    const searcherElement = document.createElement('div');
    searcherElement.className = 'search-terminal';

    this.parentContainerEl.style.position = 'relative';
    searcherElement.style.top = '0';
    searcherElement.style.left = (this.parentContainerEl.querySelector('.xterm-viewport').clientWidth - 285 - 20) + 'px';
    searcherElement.innerHTML = `
    <input/>
    <span class="search-result-count"></span>
    <button class="pre"></button>
    <button class="next"></button>
    <button class="match-case ${this.searchOptions.caseSensitive ? 'active' : ''}">Aa</button>
    <button class="match-word ${this.searchOptions.wholeWord ? 'active' : ''}">W</button>
    <button class="match-regex ${this.searchOptions.regex ? 'active' : ''}">.*</button>
    <button class="close"></button>`;
    this.parentContainerEl.appendChild(searcherElement);
    searcherElement.children[0].focus();
    const inputElement = searcherElement.querySelector('input');
    const resultElement = searcherElement.querySelector('.search-result-count');

    this.inputElement = inputElement;
    this.searcherElement = searcherElement;
    this.resultElement = resultElement;
    searcherElement.addEventListener('click', this.onClick.bind(this));
    inputElement.addEventListener('keydown', this.onKeydown.bind(this));
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.onFindNext(event);
    } else {
      this.onFindNextDebounce(event);
    }
  }

  // onChange(event) {
  //   this.onFindNextDebounce(event);
  // }

  onClick(event) {
    const classList = event.target.classList;
    if (classList.contains('close')) {
      this.onHide(event);
      return;
    }
    if (classList.contains('pre')) {
      this.onFindPre(event);
      return;
    }
    if (classList.contains('next')) {
      this.onFindNext(event);
      return;
    }
    if (classList.contains('match-case')) {
      this.onMatchCase(event);
      return;
    }
    if (classList.contains('match-word')) {
      this.onMatchWord(event);
      return;
    }
    if (classList.contains('match-regex')) {
      this.onMatchRegex(event);
      return;
    }
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
    // this.term.focus();
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

