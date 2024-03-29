var LocalEchoController = function (t) {
  var e = {};

  function r(i) {
    if (e[i]) return e[i].exports;
    var n = e[i] = {i: i, l: !1, exports: {}};
    return t[i].call(n.exports, n, n.exports, r), n.l = !0, n.exports
  }

  return r.m = t, r.c = e, r.d = function (t, e, i) {
    r.o(t, e) || Object.defineProperty(t, e, {enumerable: !0, get: i})
  }, r.r = function (t) {
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: 'Module'}), Object.defineProperty(t, '__esModule', {value: !0})
  }, r.t = function (t, e) {
    if (1 & e && (t = r(t)), 8 & e) return t;
    if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
    var i = Object.create(null);
    if (r.r(i), Object.defineProperty(i, 'default', {
      enumerable: !0,
      value: t
    }), 2 & e && 'string' != typeof t) for (var n in t) r.d(i, n, function (e) {
      return t[e]
    }.bind(null, n));
    return i
  }, r.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    };
    return r.d(e, 'a', e), e
  }, r.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, r.p = '', r(r.s = 1)
}([function (t, e) {
  e.quote = function (t) {
    return t.map((function (t) {
      return t && 'object' == typeof t ? t.op.replace(/(.)/g, '\\$1') : /["\s]/.test(t) && !/'/.test(t) ? '\'' + t.replace(/(['\\])/g, '\\$1') + '\'' : /["'\s]/.test(t) ? '"' + t.replace(/(["\\$`!])/g, '\\$1') + '"' : String(t).replace(/([A-z]:)?([#!"$&'()*,:;<=>?@\[\\\]^`{|}])/g, '$1\\$2')
    })).join(' ')
  };
  for (var r = '(?:' + ['\\|\\|', '\\&\\&', ';;', '\\|\\&', '\\<\\(', '>>', '>\\&', '[&;()|<>]'].join('|') + ')', i = '', n = 0; n < 4; n++) i += (Math.pow(16, 8) * Math.random()).toString(16);
  e.parse = function (t, e, n) {
    var s = function (t, e, n) {
      var s = new RegExp(['(' + r + ')', '((\\\\[\'"|&;()<> \\t]|[^\\s\'"|&;()<> \\t])+|"((\\\\"|[^"])*?)"|\'((\\\\\'|[^\'])*?)\')*'].join('|'), 'g'),
          o = t.match(s).filter(Boolean), a = !1;
      if (!o) return [];
      e || (e = {});
      n || (n = {});
      return o.map((function (t, s) {
        if (!a) {
          if (RegExp('^' + r + '$').test(t)) return {op: t};
          for (var u = n.escape || '\\', h = !1, l = !1, c = '', p = !1, f = 0, v = t.length; f < v; f++) {
            var m = t.charAt(f);
            if (p = p || !h && ('*' === m || '?' === m), l) c += m, l = !1; else if (h) m === h ? h = !1 : '\'' == h ? c += m : m === u ? (f += 1, c += '"' === (m = t.charAt(f)) || m === u || '$' === m ? m : u + m) : c += '$' === m ? d() : m; else if ('"' === m || '\'' === m) h = m; else {
              if (RegExp('^' + r + '$').test(m)) return {op: t};
              if (RegExp('^#$').test(m)) return a = !0, c.length ? [c, {comment: t.slice(f + 1) + o.slice(s + 1).join(' ')}] : [{comment: t.slice(f + 1) + o.slice(s + 1).join(' ')}];
              m === u ? l = !0 : c += '$' === m ? d() : m
            }
          }
          return p ? {op: 'glob', pattern: c} : c
        }

        function d() {
          var r, n;
          if (f += 1, '{' === t.charAt(f)) {
            if (f += 1, '}' === t.charAt(f)) throw new Error('Bad substitution: ' + t.substr(f - 2, 3));
            if ((r = t.indexOf('}', f)) < 0) throw new Error('Bad substitution: ' + t.substr(f));
            n = t.substr(f, r - f), f = r
          } else /[*@#?$!_\-]/.test(t.charAt(f)) ? (n = t.charAt(f), f += 1) : (r = t.substr(f).match(/[^\w\d_]/)) ? (n = t.substr(f, r.index), f += r.index - 1) : (n = t.substr(f), f = t.length);
          return function (t, r, n) {
            var s = 'function' == typeof e ? e(n) : e[n];
            void 0 === s && '' != n ? s = '' : void 0 === s && (s = '$');
            return 'object' == typeof s ? r + i + JSON.stringify(s) + i : r + s
          }(0, '', n)
        }
      })).reduce((function (t, e) {
        return void 0 === e ? t : t.concat(e)
      }), [])
    }(t, e, n);
    return 'function' != typeof e ? s : s.reduce((function (t, e) {
      if ('object' == typeof e) return t.concat(e);
      var r = e.split(RegExp('(' + i + '.*?' + i + ')', 'g'));
      return 1 === r.length ? t.concat(r[0]) : t.concat(r.filter(Boolean).map((function (t) {
        return RegExp('^' + i).test(t) ? JSON.parse(t.split(i)[1]) : t
      })))
    }), [])
  }
}, function (t, e, r) {
  'use strict';

  function i(t, e) {
    for (var r = 0; r < e.length; r++) {
      var i = e[r];
      i.enumerable = i.enumerable || !1, i.configurable = !0, 'value' in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
    }
  }

  r.r(e), r.d(e, 'HistoryController', (function () {
    return n
  }));
  var n = function () {
    function t(e) {
      !function (t, e) {
        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
      }(this, t), this.size = e, this.entries = [], this.cursor = 0
    }

    var e, r, n;
    return e = t, (r = [{
      key: 'push', value: function (t) {
        '' !== t.trim() && t != this.entries[this.entries.length - 1] && (this.entries.push(t), this.entries.length > this.size && this.entries.shift(), this.cursor = this.entries.length)
      }
    }, {
      key: 'rewind', value: function () {
        this.cursor = this.entries.length
      }
    }, {
      key: 'getPrevious', value: function () {
        var t = Math.max(0, this.cursor - 1);
        return this.cursor = t, this.entries[t]
      }
    }, {
      key: 'getNext', value: function () {
        var t = Math.min(this.entries.length, this.cursor + 1);
        return this.cursor = t, this.entries[t]
      }
    }]) && i(e.prototype, r), n && i(e, n), t
  }(), s = r(0);

  function o(t) {
    return function (t) {
      if (Array.isArray(t)) return a(t)
    }(t) || function (t) {
      if ('undefined' != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t)
    }(t) || function (t, e) {
      if (!t) return;
      if ('string' == typeof t) return a(t, e);
      var r = Object.prototype.toString.call(t).slice(8, -1);
      'Object' === r && t.constructor && (r = t.constructor.name);
      if ('Map' === r || 'Set' === r) return Array.from(t);
      if ('Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return a(t, e)
    }(t) || function () {
      throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
    }()
  }

  function a(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, i = new Array(e); r < e; r++) i[r] = t[r];
    return i
  }

  function u(t) {
    for (var e, r = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], i = [], n = /\w+/g; e = n.exec(t);) r ? i.push(e.index) : i.push(e.index + e[0].length);
    return i
  }

  function h(t, e) {
    var r = u(t, !0).reverse().find((function (t) {
      return t < e
    }));
    return null == r ? 0 : r
  }

  function l(t, e, r) {
    for (var i = 0, n = 0, s = 0; s < e; ++s) {
      ('\n' == t.charAt(s) || (n += 1) > r) && (n = 0, i += 1)
    }
    return {row: i, col: n}
  }

  function c(t, e) {
    return l(t, t.length, e).row + 1
  }

  function p(t) {
    return null != t.match(/[^\\][ \t]$/m)
  }

  function f(t) {
    return '' === t.trim() || p(t) ? '' : Object(s.parse)(t).pop() || ''
  }

  function v(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }

  function m(t, e) {
    for (var r = 0; r < e.length; r++) {
      var i = e[r];
      i.enumerable = i.enumerable || !1, i.configurable = !0, 'value' in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
    }
  }

  var d = function () {
    function t() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
          r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      v(this, t), this.term = e, this._handleTermData = this.handleTermData.bind(this), this._handleTermResize = this.handleTermResize.bind(this), this.history = new n(r.historySize || 10), this.maxAutocompleteEntries = r.maxAutocompleteEntries || 100, this._autocompleteHandlers = [], this._active = !1, this._input = '', this._cursor = 0, this._activePrompt = null, this._activeCharPrompt = null, this._termSize = {
        cols: 0,
        rows: 0
      }, this._disposables = [], e && (e.loadAddon ? e.loadAddon(this) : this.attach())
    }

    var e, r, i;
    return e = t, (r = [{
      key: 'activate', value: function (t) {
        this.term = t, this.attach()
      }
    }, {
      key: 'dispose', value: function () {
        this.detach()
      }
    }, {
      key: 'detach', value: function () {
        this.term.off ? (this.term.off('data', this._handleTermData), this.term.off('resize', this._handleTermResize)) : (this._disposables.forEach((function (t) {
          return t.dispose()
        })), this._disposables = [])
      }
    }, {
      key: 'attach', value: function () {
        this.term.on ? (this.term.on('data', this._handleTermData), this.term.on('resize', this._handleTermResize)) : (this._disposables.push(this.term.onData(this._handleTermData)), this._disposables.push(this.term.onResize(this._handleTermResize))), this._termSize = {
          cols: this.term.cols,
          rows: this.term.rows
        }
      }
    }, {
      key: 'addAutocompleteHandler', value: function (t) {
        for (var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) r[i - 1] = arguments[i];
        this._autocompleteHandlers.push({fn: t, args: r})
      }
    }, {
      key: 'removeAutocompleteHandler', value: function (t) {
        var e = this._autocompleteHandlers.findIndex((function (e) {
          return e.fn === t
        }));
        -1 !== e && this._autocompleteHandlers.splice(e, 1)
      }
    }, {
      key: 'read', value: function (t) {
        var e = this, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '> ';
        return new Promise((function (i, n) {
          e.term.write(t), e._activePrompt = {
            prompt: t,
            continuationPrompt: r,
            resolve: i,
            reject: n
          }, e._input = '', e._cursor = 0, e._active = !0
        }))
      }
    }, {
      key: 'readChar', value: function (t) {
        var e = this;
        return new Promise((function (r, i) {
          e.term.write(t), e._activeCharPrompt = {prompt: t, resolve: r, reject: i}
        }))
      }
    }, {
      key: 'abortRead', value: function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'aborted';
        null == this._activePrompt && null == this._activeCharPrompt || this.term.write('\r\n'), null != this._activePrompt && (this._activePrompt.reject(t), this._activePrompt = null), null != this._activeCharPrompt && (this._activeCharPrompt.reject(t), this._activeCharPrompt = null), this._active = !1
      }
    }, {
      key: 'println', value: function (t) {
        this.print(t + '\n')
      }
    }, {
      key: 'print', value: function (t) {
        var e = t.replace(/[\r\n]+/g, '\n');
        this.term.write(e.replace(/\n/g, '\r\n'))
      }
    }, {
      key: 'printWide', value: function (t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        if (0 == t.length) return println('');
        for (var r = t.reduce((function (t, e) {
          return Math.max(t, e.length)
        }), 0) + e, i = Math.floor(this._termSize.cols / r), n = Math.ceil(t.length / i), s = 0, o = 0; o < n; ++o) {
          for (var a = '', u = 0; u < i; ++u) if (s < t.length) {
            var h = t[s++];
            a += h += ' '.repeat(r - h.length)
          }
          this.println(a)
        }
      }
    }, {
      key: 'applyPrompts', value: function (t) {
        var e = (this._activePrompt || {}).prompt || '', r = (this._activePrompt || {}).continuationPrompt || '';
        return e + t.replace(/\n/g, '\n' + r)
      }
    }, {
      key: 'applyPromptOffset', value: function (t, e) {
        return this.applyPrompts(t.substr(0, e)).length
      }
    }, {
      key: 'clearInput', value: function () {
        for (var t = this.applyPrompts(this._input), e = c(t, this._termSize.cols), r = l(t, this.applyPromptOffset(this._input, this._cursor), this._termSize.cols), i = (r.col, e - r.row - 1), n = 0; n < i; ++n) this.term.write('[E');
        for (this.term.write('\r[K'), n = 1; n < e; ++n) this.term.write('[F[K')
      }
    }, {
      key: 'setInput', value: function (t) {
        var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        e && this.clearInput();
        var r = this.applyPrompts(t);
        this.print(r), this._cursor > t.length && (this._cursor = t.length);
        var i = this.applyPromptOffset(t, this._cursor), n = c(r, this._termSize.cols),
            s = l(r, i, this._termSize.cols), o = s.col, a = s.row, u = n - a - 1;
        this.term.write('\r');
        for (var h = 0; h < u; ++h) this.term.write('[F');
        for (h = 0; h < o; ++h) this.term.write('[C');
        this._input = t
      }
    }, {
      key: 'printAndRestartPrompt', value: function (t) {
        var e = this, r = this._cursor;
        this.setCursor(this._input.length), this.term.write('\r\n');
        var i = function () {
          e._cursor = r, e.setInput(e._input)
        }, n = t();
        null == n ? i() : n.then(i)
      }
    }, {
      key: 'setCursor', value: function (t) {
        t < 0 && (t = 0), t > this._input.length && (t = this._input.length);
        var e = this.applyPrompts(this._input),
            r = (c(e, this._termSize.cols), l(e, this.applyPromptOffset(this._input, this._cursor), this._termSize.cols)),
            i = r.col, n = r.row, s = l(e, this.applyPromptOffset(this._input, t), this._termSize.cols), o = s.col,
            a = s.row;
        if (a > n) for (var u = n; u < a; ++u) this.term.write('[B'); else for (var h = a; h < n; ++h) this.term.write('[A');
        if (o > i) for (var p = i; p < o; ++p) this.term.write('[C'); else for (var f = o; f < i; ++f) this.term.write('[D');
        this._cursor = t
      }
    }, {
      key: 'handleCursorMove', value: function (t) {
        if (t > 0) {
          var e = Math.min(t, this._input.length - this._cursor);
          this.setCursor(this._cursor + e)
        } else if (t < 0) {
          var r = Math.max(t, -this._cursor);
          this.setCursor(this._cursor + r)
        }
      }
    }, {
      key: 'handleCursorErase', value: function (t) {
        var e = this._cursor, r = this._input;
        if (t) {
          if (e <= 0) return;
          var i = r.substr(0, e - 1) + r.substr(e);
          this.clearInput(), this._cursor -= 1, this.setInput(i, !1)
        } else {
          var n = r.substr(0, e) + r.substr(e + 1);
          this.setInput(n)
        }
      }
    }, {
      key: 'handleCursorInsert', value: function (t) {
        var e = this._cursor, r = this._input, i = r.substr(0, e) + t + r.substr(e);
        this._cursor += t.length, this.setInput(i)
      }
    }, {
      key: 'handleReadComplete', value: function () {
        this.history && this.history.push(this._input), this._activePrompt && (this._activePrompt.resolve(this._input), this._activePrompt = null), this.term.write('\r\n'), this._active = !1
      }
    }, {
      key: 'handleTermResize', value: function (t) {
        var e = t.rows, r = t.cols;
        this.clearInput(), this._termSize = {cols: r, rows: e}, this.setInput(this._input, !1)
      }
    }, {
      key: 'handleTermData', value: function (t) {
        var e = this;
        if (this._active) {
          if (null != this._activeCharPrompt) return this._activeCharPrompt.resolve(t), this._activeCharPrompt = null, void this.term.write('\r\n');
          if (t.length > 3 && 27 !== t.charCodeAt(0)) {
            var r = t.replace(/[\r\n]+/g, '\r');
            Array.from(r).forEach((function (t) {
              return e.handleData(t)
            }))
          } else this.handleData(t)
        }
      }
    }, {
      key: 'handleData', value: function (t) {
        var e = this;
        if (this._active) {
          var r, i, n, a, l = t.charCodeAt(0);
          if (27 == l) switch (t.substr(1)) {
            case'[A':
              if (this.history) {
                var c = this.history.getPrevious();
                c && (this.setInput(c), this.setCursor(c.length))
              }
              break;
            case'[B':
              if (this.history) {
                var v = this.history.getNext();
                v || (v = ''), this.setInput(v), this.setCursor(v.length)
              }
              break;
            case'[D':
              this.handleCursorMove(-1);
              break;
            case'[C':
              this.handleCursorMove(1);
              break;
            case'[3~':
              this.handleCursorErase(!1);
              break;
            case'[F':
              this.setCursor(this._input.length);
              break;
            case'[H':
              this.setCursor(0);
              break;
            case'b':
              null != (r = h(this._input, this._cursor)) && this.setCursor(r);
              break;
            case'f':
              i = this._input, n = this._cursor, null != (r = null == (a = u(i, !1).find((function (t) {
                return t > n
              }))) ? i.length : a) && this.setCursor(r);
              break;
            case'':
              null != (r = h(this._input, this._cursor)) && (this.setInput(this._input.substr(0, r) + this._input.substr(this._cursor)), this.setCursor(r))
          } else if (l < 32 || 127 === l) switch (t) {
            case'\r':
              !function (t) {
                return '' != t.trim() && ((t.match(/'/g) || []).length % 2 != 0 || (t.match(/"/g) || []).length % 2 != 0 || '' == t.split(/(\|\||\||&&)/g).pop().trim() || !(!t.endsWith('\\') || t.endsWith('\\\\')))
              }(this._input) ? this.handleReadComplete() : this.handleCursorInsert('\n');
              break;
            case'':
              this.handleCursorErase(!0);
              break;
            case'\t':
              if (this._autocompleteHandlers.length > 0) {
                var m = this._input.substr(0, this._cursor), d = p(m), _ = function (t, e) {
                  var r = Object(s.parse)(e), i = r.length - 1, n = r[i] || '';
                  return '' === e.trim() ? (i = 0, n = '') : p(e) && (i += 1, n = ''), t.reduce((function (t, e) {
                    var n = e.fn, s = e.args;
                    try {
                      return t.concat(n.apply(void 0, [i, r].concat(o(s))))
                    } catch (e) {
                      return console.error('Auto-complete error:', e), t
                    }
                  }), []).filter((function (t) {
                    return t.startsWith(n)
                  }))
                }(this._autocompleteHandlers, m);
                if (_.sort(), 0 === _.length) d || this.handleCursorInsert(' '); else if (1 === _.length) {
                  var g = f(m);
                  this.handleCursorInsert(_[0].substr(g.length) + ' ')
                } else if (_.length <= this.maxAutocompleteEntries) {
                  var y = function t(e, r) {
                    if (e.length >= r[0].length) return e;
                    var i = e;
                    e += r[0].slice(e.length, e.length + 1);
                    for (var n = 0; n < r.length; n++) {
                      if (!r[n].startsWith(i)) return null;
                      if (!r[n].startsWith(e)) return i
                    }
                    return t(e, r)
                  }(m, _);
                  if (y) {
                    var b = f(m);
                    this.handleCursorInsert(y.substr(b.length))
                  }
                  this.printAndRestartPrompt((function () {
                    e.printWide(_)
                  }))
                } else this.printAndRestartPrompt((function () {
                  return e.readChar('Display all '.concat(_.length, ' possibilities? (y or n)')).then((function (t) {
                    'y' != t && 'Y' != t || e.printWide(_)
                  }))
                }))
              } else this.handleCursorInsert('    ');
              break;
            case'':
              this.setCursor(this._input.length), this.term.write('^C\r\n' + ((this._activePrompt || {}).prompt || '')), this._input = '', this._cursor = 0, this.history && this.history.rewind()
          } else this.handleCursorInsert(t)
        }
      }
    }]) && m(e.prototype, r), i && m(e, i), t
  }();
  e.default = d
}]).default;
//# sourceMappingURL=local-echo.js.map