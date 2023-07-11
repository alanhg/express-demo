var X = Object.create;
var $ = Object.defineProperty;
var Z = Object.getOwnPropertyDescriptor;
var U = Object.getOwnPropertyNames;
var Y = Object.getPrototypeOf, ee = Object.prototype.hasOwnProperty;
var V = (e, t) => () => (t || e((t = {exports: {}}).exports, t), t.exports);
var te = (e, t, n, i) => {
  if (t && typeof t == 'object' || typeof t == 'function') for (let r of U(t)) !ee.call(e, r) && r !== n && $(e, r, {
    get: () => t[r],
    enumerable: !(i = Z(t, r)) || i.enumerable
  });
  return e
};
var ne = (e, t, n) => (n = e != null ? X(Y(e)) : {}, te(t || !e || !e.__esModule ? $(n, 'default', {
  value: e,
  enumerable: !0
}) : n, e));
var J = V(_ => {
  'use strict';
  var re = _ && _.__awaiter || function (e, t, n, i) {
    function r(o) {
      return o instanceof n ? o : new n(function (u) {
        u(o)
      })
    }

    return new (n || (n = Promise))(function (o, u) {
      function c(s) {
        try {
          l(i.next(s))
        } catch (a) {
          u(a)
        }
      }

      function f(s) {
        try {
          l(i.throw(s))
        } catch (a) {
          u(a)
        }
      }

      function l(s) {
        s.done ? o(s.value) : r(s.value).then(c, f)
      }

      l((i = i.apply(e, t || [])).next())
    })
  };
  Object.defineProperty(_, '__esModule', {value: !0});
  _.filepaths = _.folders = _.getCurrentInsertedDirectory = _.sortFilesAlphabetically = void 0;

  function z(e, t = []) {
    let n = t.map(r => r.toLowerCase()), i = e.filter(r => !n.includes(r.toLowerCase()));
    return [...i.filter(r => !r.startsWith('.')).sort((r, o) => r.localeCompare(o)), ...i.filter(r => r.startsWith('.')).sort((r, o) => r.localeCompare(o)), '../']
  }

  _.sortFilesAlphabetically = z;
  var q = e => e.endsWith('/') ? e : `${e}/`, ie = (e, t, n = {}) => {
    if (e === null) return '/';
    let r = t.replace(/\$([A-Za-z0-9_]+)/g, u => {
      let c = u.slice(1);
      return n[c] || ''
    }).replace(/\$\{([A-Za-z0-9_]+)(?::-([^}]+))?\}/g, (u, c, f) => {
      var l, s;
      return (s = (l = n[c]) !== null && l !== void 0 ? l : f) !== null && s !== void 0 ? s : ''
    }), o = r.slice(0, r.lastIndexOf('/') + 1);
    return o === '' ? q(e) : o.startsWith('~/') || o.startsWith('/') ? o : `${q(e)}${o}`
  };
  _.getCurrentInsertedDirectory = ie;

  function L(e = {}) {
    let {
          extensions: t = [],
          equals: n = [],
          matches: i,
          filterFolders: r = !1,
          editFileSuggestions: o,
          editFolderSuggestions: u,
          rootDirectory: c,
          showFolders: f = 'always'
        } = e, l = new Set(t), s = new Set(n), a = () => t.length > 0 || n.length > 0 || i,
        g = (h = []) => a() ? h.filter(({name: y = '', type: w}) => {
          if (!r && w === 'folder' || s.has(y) || i && !!y.match(i)) return !0;
          let [, ...d] = y.split('.');
          if (d.length >= 1) {
            let S = d.length - 1, p = d[S];
            do {
              if (l.has(p)) return !0;
              S -= 1, p = [d[S], p].join('.')
            } while (S >= 0)
          }
          return !1
        }) : h,
        m = (h = []) => !o && !u ? h : h.map(y => Object.assign(Object.assign({}, y), (y.type === 'file' ? o : u) || {}));
    return {
      trigger: (h, y) => {
        let w = h.lastIndexOf('/'), d = y.lastIndexOf('/');
        return w !== d ? !0 : w === -1 && d === -1 ? !1 : h.slice(0, w) !== y.slice(0, d)
      },
      getQueryTerm: h => h.slice(h.lastIndexOf('/') + 1),
      custom: (h, y, w) => re(this, void 0, void 0, function* () {
        var d;
        let {isDangerous: S, currentWorkingDirectory: p, searchTerm: j} = w,
            v = (d = (0, _.getCurrentInsertedDirectory)(c ?? p, j, w.environmentVariables)) !== null && d !== void 0 ? d : '/';
        try {
          let b = yield y('command ls -1ApL', v), H = z(b.split(`
`), ['.DS_Store']), W = [];
          for (let A of H) if (A) {
            let F = A.endsWith('/') ? 'folders' : 'filepaths';
            (F === 'filepaths' && f !== 'only' || F === 'folders' && f !== 'never') && W.push({
              type: F === 'filepaths' ? 'file' : 'folder',
              name: A,
              insertValue: A,
              isDangerous: S,
              context: {templateType: F}
            })
          }
          return m(g(W))
        } catch {
          return []
        }
      })
    }
  }

  _.folders = Object.assign(() => L({showFolders: 'only'}), Object.freeze(L({showFolders: 'only'})));
  _.filepaths = Object.assign(L, Object.freeze(L()))
});
var k = V(I => {
  'use strict';
  var T = I && I.__awaiter || function (e, t, n, i) {
    function r(o) {
      return o instanceof n ? o : new n(function (u) {
        u(o)
      })
    }

    return new (n || (n = Promise))(function (o, u) {
      function c(s) {
        try {
          l(i.next(s))
        } catch (a) {
          u(a)
        }
      }

      function f(s) {
        try {
          l(i.throw(s))
        } catch (a) {
          u(a)
        }
      }

      function l(s) {
        s.done ? o(s.value) : r(s.value).then(c, f)
      }

      l((i = i.apply(e, t || [])).next())
    })
  };
  Object.defineProperty(I, '__esModule', {value: !0});
  I.keyValueList = I.keyValue = I.valueList = void 0;
  var P = new Map;

  function M(e, t) {
    return e.length === 0 ? t : t.map(n => n.insertValue ? n : Object.assign(Object.assign({}, n), {insertValue: n.name + e}))
  }

  function R(e, t, n) {
    return T(this, void 0, void 0, function* () {
      if (typeof e == 'function') {
        let i = yield e(...n);
        return M(t, i)
      }
      if (typeof e[0] == 'string') {
        let i = e.map(r => ({name: r}));
        return M(t, i)
      }
      return M(t, e)
    })
  }

  function N(e, t, n, i) {
    return T(this, void 0, void 0, function* () {
      if (n || Array.isArray(e)) {
        let r = P.get(e);
        return r === void 0 && (r = yield R(e, t, i), P.set(e, r)), r
      }
      return R(e, t, i)
    })
  }

  function K(e, t) {
    return typeof t == 'string' ? e && t === 'keys' || !e && t === 'values' : t
  }

  function C(e, ...t) {
    return Math.max(...t.map(n => e.lastIndexOf(n)))
  }

  function D(e, t) {
    let n = new Set(e);
    return t.filter(i => {
      var r;
      return typeof i.name == 'string' ? !n.has(i.name) : !(!((r = i.name) === null || r === void 0) && r.some(o => n.has(o)))
    })
  }

  function oe({
                delimiter: e = ',',
                values: t = [],
                cache: n = !1,
                insertDelimiter: i = !1,
                allowRepeatedValues: r = !1
              }) {
    return {
      trigger: (o, u) => o.lastIndexOf(e) !== u.lastIndexOf(e),
      getQueryTerm: o => o.slice(o.lastIndexOf(e) + e.length),
      custom: (...o) => T(this, void 0, void 0, function* () {
        var u;
        let c = yield N(t, i ? e : '', n, o);
        if (r) return c;
        let [f] = o, l = (u = f[f.length - 1]) === null || u === void 0 ? void 0 : u.split(e);
        return D(l, c)
      })
    }
  }

  I.valueList = oe;

  function se({separator: e = '=', keys: t = [], values: n = [], cache: i = !1, insertSeparator: r = !0}) {
    return {
      trigger: (o, u) => o.indexOf(e) !== u.indexOf(e),
      getQueryTerm: o => o.slice(o.indexOf(e) + 1),
      custom: (...o) => T(this, void 0, void 0, function* () {
        let [u] = o, f = !u[u.length - 1].includes(e), l = f ? t : n, s = K(f, i);
        return N(l, f && r ? e : '', s, o)
      })
    }
  }

  I.keyValue = se;

  function ue({
                separator: e = '=',
                delimiter: t = ',',
                keys: n = [],
                values: i = [],
                cache: r = !1,
                insertSeparator: o = !0,
                insertDelimiter: u = !1,
                allowRepeatedKeys: c = !1,
                allowRepeatedValues: f = !0
              }) {
    return {
      trigger: (l, s) => {
        let a = C(l, e, t), g = C(s, e, t);
        return a !== g
      }, getQueryTerm: l => {
        let s = C(l, e, t);
        return l.slice(s + 1)
      }, custom: (...l) => T(this, void 0, void 0, function* () {
        let [s] = l, a = s[s.length - 1], g = C(a, e, t), m = g === -1 || a.slice(g, g + e.length) !== e, h = m ? n : i,
            y = K(m, r), d = yield N(h, m ? o ? e : '' : u ? t : '', y, l);
        if (m) {
          if (c) return d;
          let p = a.split(t).map(j => j.slice(0, j.indexOf(e)));
          return D(p, d)
        }
        if (f) return d;
        let S = a.split(t).map(p => p.slice(p.indexOf(e) + e.length));
        return D(S, d)
      })
    }
  }

  I.keyValueList = ue
});
var E = V(x => {
  'use strict';
  var le = x && x.__awaiter || function (e, t, n, i) {
    function r(o) {
      return o instanceof n ? o : new n(function (u) {
        u(o)
      })
    }

    return new (n || (n = Promise))(function (o, u) {
      function c(s) {
        try {
          l(i.next(s))
        } catch (a) {
          u(a)
        }
      }

      function f(s) {
        try {
          l(i.throw(s))
        } catch (a) {
          u(a)
        }
      }

      function l(s) {
        s.done ? o(s.value) : r(s.value).then(c, f)
      }

      l((i = i.apply(e, t || [])).next())
    })
  };
  Object.defineProperty(x, '__esModule', {value: !0});
  x.ai = void 0;
  var ce = 4097, ae = 4, fe = .8, de = ce * ae * fe;

  function he({name: e, prompt: t, message: n, postProcess: i, temperature: r, splitOn: o}) {
    return {
      scriptTimeout: 15e3, custom: (u, c, f) => le(this, void 0, void 0, function* () {
        var l, s;
        let a = yield c('fig settings --format json autocomplete.ai.enabled');
        if (!JSON.parse(a)) return [];
        let g = typeof t == 'function' ? yield t({tokens: u, executeShellCommand: c, generatorContext: f}) : t,
            m = typeof n == 'function' ? yield n({tokens: u, executeShellCommand: c, generatorContext: f}) : n;
        if (m === null || m.length === 0) return console.warn('No message provided to AI generator'), [];
        let h = de - ((l = g?.length) !== null && l !== void 0 ? l : 0), y = {
              model: 'gpt-3.5-turbo',
              source: 'autocomplete',
              name: e,
              messages: [...g ? [{role: 'system', content: g}] : [], {role: 'user', content: m.slice(0, h)}],
              temperature: r
            }, d = JSON.stringify(y).replace(/'/g, `'"'"'`),
            S = yield c(`fig _ request --route /ai/chat --method POST --body '${d}'`), p = JSON.parse(S);
        return (s = p?.choices.map(v => {
          var b;
          return (b = v?.message) === null || b === void 0 ? void 0 : b.content
        }).filter(v => typeof v == 'string').flatMap(v => o ? v.split(o).filter(b => b.trim().length > 0) : [v]).map(v => {
          if (i) return i(v);
          let b = v.trim().replace(/\n/g, ' ');
          return {icon: '\u{1FA84}', name: b, insertValue: `'${b}'`, description: 'Generated by Fig AI'}
        })) !== null && s !== void 0 ? s : []
      })
    }
  }

  x.ai = he
});
var B = V(O => {
  'use strict';
  var ye = O && O.__createBinding || (Object.create ? function (e, t, n, i) {
    i === void 0 && (i = n);
    var r = Object.getOwnPropertyDescriptor(t, n);
    (!r || ('get' in r ? !t.__esModule : r.writable || r.configurable)) && (r = {
      enumerable: !0, get: function () {
        return t[n]
      }
    }), Object.defineProperty(e, i, r)
  } : function (e, t, n, i) {
    i === void 0 && (i = n), e[i] = t[n]
  }), pe = O && O.__exportStar || function (e, t) {
    for (var n in e) n !== 'default' && !Object.prototype.hasOwnProperty.call(t, n) && ye(t, e, n)
  };
  Object.defineProperty(O, '__esModule', {value: !0});
  O.ai = O.folders = O.filepaths = void 0;
  var Q = J();
  Object.defineProperty(O, 'filepaths', {
    enumerable: !0, get: function () {
      return Q.filepaths
    }
  });
  Object.defineProperty(O, 'folders', {
    enumerable: !0, get: function () {
      return Q.folders
    }
  });
  pe(k(), O);
  var ge = E();
  Object.defineProperty(O, 'ai', {
    enumerable: !0, get: function () {
      return ge.ai
    }
  })
});
var G = ne(B(), 1), ve = {
  name: 'cd',
  description: 'Change the shell working directory',
  args: {
    generators: (0, G.filepaths)({
      showFolders: 'only',
      editFolderSuggestions: {previewComponent: 'cd/folderPreview'}
    }),
    filterStrategy: 'fuzzy',
    suggestions: [{name: '-', description: 'Switch to the last used folder', hidden: !0}, {
      name: '~',
      description: 'Switch to the home directory'
    }]
  }
}, Se = ve;
export {Se as default};
