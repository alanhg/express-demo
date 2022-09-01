(function (e) {
  function _(t) {
    if (n[t]) return n[t].exports;
    var r = n[t] = {i: t, l: !1, exports: {}};
    return e[t].call(r.exports, r, r.exports, _), r.l = !0, r.exports
  }

  var n = {};
  return _.m = e, _.c = n, _.d = function (e, n, t) {
    _.o(e, n) || Object.defineProperty(e, n, {configurable: !1, enumerable: !0, get: t})
  }, _.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e['default']
    } : function () {
      return e
    };
    return _.d(n, 'a', n), n
  }, _.o = function (e, _) {
    return Object.prototype.hasOwnProperty.call(e, _)
  }, _.p = '', _(_.s = 5)
})([function (e) {
  'use strict';
  var _ = e.exports;
  const n = 17, t = 19, r = 24;
  _.ZMLIB = {
    ZDLE: 24, XON: n, XOFF: t, ABORT_SEQUENCE: [r, r, r, r, r], strip_ignored_bytes: function (e) {
      for (var _ = e.length - 1; 0 <= _; _--) switch (e[_]) {
        case n:
        case 128 | n:
        case t:
        case 128 | t:
          e.splice(_, 1);
          continue;
      }
      return e
    }, find_subarray: function (e, _) {
      var t, n = 0, r = Date.now();
      HAYSTACK:for (; -1 != n;) {
        if (n = e.indexOf(_[0], n), -1 === n) break HAYSTACK;
        for (t = 1; t < _.length; t++) if (e[n + t] !== _[t]) {
          n++;
          continue HAYSTACK
        }
        return n
      }
      return -1
    }
  }
}, function (e) {
  'use strict';

  function _(e) {
    const _ = t[e];
    switch (typeof _) {
      case'string':
        return _;
      case'function':
        var n = [].slice.call(arguments).slice(1);
        return _.apply(this, n);
    }
    return null
  }

  var n = e.exports;
  const t = {
    aborted: 'Session aborted',
    peer_aborted: 'Peer aborted session',
    already_aborted: 'Session already aborted',
    crc: function (e, _) {
      return this.got = e.slice(0), this.expected = _.slice(0), 'CRC check failed! (got: ' + e.join() + '; expected: ' + _.join() + ')'
    },
    validation: function (e) {
      return e
    }
  };
  n.Error = class extends Error {
    constructor(e) {
      super();
      var n = _.apply(this, arguments);
      n ? (this.type = e, this.message = n) : this.message = e
    }
  }
}, function (e) {
  'use strict';
  var _ = e.exports;
  const n = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102], t = {};
  for (var r = 0; r < n.length; r++) t[n[r]] = r;
  _.ENCODELIB = {
    pack_u16_be: function (e) {
      if (65535 < e) throw'Number cannot exceed 16 bits: ' + e;
      return [e >> 8, 255 & e]
    }, pack_u32_le: function (e) {
      var _ = e / 65536;
      return [255 & e, (65535 & e) >> 8, 255 & _, _ >> 8]
    }, unpack_u16_be: function (e) {
      return (e[0] << 8) + e[1]
    }, unpack_u32_le: function (e) {
      return e[0] + (e[1] << 8) + (e[2] << 16) + 16777216 * e[3]
    }, octets_to_hex: function (e) {
      for (var _ = [], t = 0; t < e.length; t++) _.push(n[e[t] >> 4], n[15 & e[t]]);
      return _
    }, parse_hex_octets: function (e) {
      for (var _ = Array(e.length / 2), n = 0; n < _.length; n++) _[n] = (t[e[2 * n]] << 4) + t[e[1 + 2 * n]];
      return _
    }
  }
}, function (e, _, n) {
  'use strict';
  var t = e.exports;
  Object.assign(t, n(0));
  var r, a;
  const s = t.ZMLIB.ZDLE;
  t.ZDLE = class e {
    constructor(e) {
      this._config = {}, e && this.set_escape_ctrl_chars(!!e.escape_ctrl_chars)
    }

    set_escape_ctrl_chars(e) {
      if ('boolean' != typeof e) throw'need boolean!';
      e !== this._config.escape_ctrl_chars && (this._config.escape_ctrl_chars = e, this._setup_zdle_table())
    }

    escapes_ctrl_chars() {
      return !!this._config.escape_ctrl_chars
    }

    encode(e) {
      if (!this._zdle_table) throw'No ZDLE encode table configured!';
      var _ = this._zdle_table, n = this._lastcode, t = new ArrayBuffer(2 * e.length), d = new Uint8Array(t),
        o = this._config.escape_ctrl_chars, i = 0;
      for (r = 0; r < e.length; r++) {
        if (a = _[e[r]], !a) throw console.trace(), console.error('bad encode() call:', JSON.stringify(e)), this._lastcode = n, 'Invalid octet: ' + e[r];
        n = e[r], 1 === a || (o || 2 === a || 64 == (127 & n)) && (d[i] = s, i++, n ^= 64), d[i] = n, i++
      }
      return this._lastcode = n, e.splice(0), e.push.apply(e, new Uint8Array(t, 0, i)), e
    }

    static decode(e) {
      for (var _ = e.length - 1; 0 <= _; _--) e[_] === s && e.splice(_, 2, e[_ + 1] - 64);
      return e
    }

    static splice(_, n, t) {
      var r = 0;
      n || (n = 0);
      for (var a = n; a < _.length && r < t; a++) r++, _[a] === s && a++;
      return r === t ? _.length === a - 1 ? void 0 : (_.splice(0, n), e.decode(_.splice(0, a - n))) : void 0
    }

    _setup_zdle_table() {
      for (var e = Array(256), _ = 0; _ < e.length; _++) e[_] = 96 & _ ? 1 : _ === s || _ === t.ZMLIB.XOFF || _ === t.ZMLIB.XON || _ === (128 | t.ZMLIB.XOFF) || _ === (128 | t.ZMLIB.XON) ? 2 : 16 === _ || 144 === _ ? this._config.turbo_escape ? 1 : 2 : 13 === _ || 141 === _ ? this._config.escape_ctrl_chars ? 2 : this._config.turbo_escape ? 1 : 3 : this._config.escape_ctrl_chars ? 2 : 1;
      this._zdle_table = e
    }
  }
}, function (e, _, n) {
  'use strict';

  function t() {
    o = Array(256);
    for (var e, _ = 0; 256 > _; _++) {
      e = _ << i - 8 & c;
      for (var n = 0; 8 > n; n++) 0 == (e & p) ? e <<= 1 : (e <<= 1, e ^= l);
      o[_] = e & c
    }
  }

  function r(e, _) {
    return o || t(), o[255 & _ >> 8] ^ (255 & _) << 8 ^ e
  }

  function a(e, _) {
    if (e.join() !== _.join()) throw new d.Error('crc', _, e)
  }

  const s = n(12);
  var d = e.exports;
  Object.assign(d, n(1), n(2));
  var o;
  const i = 16, l = 4129, c = 65535, p = 1 << i - 1;
  d.CRC = {
    crc16: function (e) {
      for (var _ = e[0], n = 1; n < e.length; n++) _ = r(e[n], _);
      return _ = r(0, r(0, _)), d.ENCODELIB.pack_u16_be(_)
    }, crc32: function (e) {
      return d.ENCODELIB.pack_u32_le(s.buf(e) >>> 0)
    }, verify16: function (e, _) {
      return a(this.crc16(e), _)
    }, verify32: function (e, _) {
      try {
        a(this.crc32(e), _)
      } catch (_) {
        throw _.input = e.slice(0), _
      }
    }
  }
}, function (e, _, n) {
  e.exports = n(6)
}, function (e, _, n) {
  'use strict';

  function t(e) {
    if (e.aborted()) throw new r.Error('aborted')
  }

  var r = e.exports;
  window.Zmodem = r, Object.assign(r, n(7)), r.Browser = {
    send_files: function (_, e, n) {
      function r() {
        var a = s[i];
        return a ? (i++, _.send_offer(a).then(function (s) {
          return n.on_offer_response && n.on_offer_response(a.obj, s), void 0 === s ? r() : new Promise(function (e) {
            var d = new FileReader;
            d.readAsArrayBuffer(a.obj), d.onerror = function (_) {
              throw console.error('file read error', _), 'File read error: ' + _
            };
            var o;
            d.onprogress = function (r) {
              r.target.result && (o = new Uint8Array(r.target.result, s.get_offset()), t(_), s.send(o), n.on_progress && n.on_progress(a.obj, s, o))
            }, d.onload = function (d) {
              o = new Uint8Array(d.target.result, s, o), t(_), s.end(o).then(function () {
                n.on_progress && o.length && n.on_progress(a.obj, s, o), n.on_file_complete && n.on_file_complete(a.obj, s), e(r())
              })
            }
          })
        })) : Promise.resolve()
      }

      n || (n = {});
      for (var a, s = [], d = 0, o = e.length - 1; 0 <= o; o--) a = e[o], d += a.size, s[o] = {
        obj: a,
        name: a.name,
        size: a.size,
        mtime: new Date(a.lastModified),
        files_remaining: e.length - o,
        bytes_remaining: d
      };
      var i = 0;
      return r()
    }, save_to_disk: function (e, _) {
      var n = new Blob(e), t = URL.createObjectURL(n), r = document.createElement('a');
      r.style.display = 'none', r.href = t, r.download = _, document.body.appendChild(r), r.click(), document.body.removeChild(r)
    }
  }
}, function (e, _, n) {
  Object.assign(e.exports, n(8))
}, function (e, _, n) {
  'use strict';
  var t = e.exports;
  Object.assign(t, n(0), n(9));
  const r = [42, 42, 24, 66, 48], a = ['to_terminal', 'on_detect', 'on_retract', 'sender'];

  class s {
    constructor(e, _, n, t) {
      this._confirmer = _, this._denier = n, this._is_valid = t, this._session_type = e
    }

    confirm() {
      return this._confirmer.apply(this, arguments)
    }

    deny() {
      return this._denier.apply(this, arguments)
    }

    is_valid() {
      return this._is_valid.apply(this, arguments)
    }

    get_session_role() {
      return this._session_type
    }
  }

  t.Sentry = class {
    constructor(e) {
      if (!e) throw'Need options!';
      var _ = this;
      a.forEach(function (n) {
        if (!e[n]) throw'Need \u201C' + n + '\u201D!';
        _['_' + n] = e[n]
      }), this._cache = []
    }

    _after_session_end() {
      this._zsession = null
    }

    consume(e) {
      if (e instanceof Array || (e = Array.prototype.slice.call(new Uint8Array(e))), this._zsession) {
        var _ = this._zsession;
        if (_.consume(e), _.has_ended()) e = 'receive' === _.type ? _.get_trailing_bytes() : []; else return
      }
      var n = this._parse(e), t = e;
      if (n) {
        let e = !!this._parsed_session;
        e && (this._parsed_session.type === n.type && (t = []), this._on_retract()), this._parsed_session = n;
        var r = this;
        this._on_detect(new s(n.type, function () {
          if (!this.is_valid()) throw'Stale ZMODEM session!';
          return n.on('garbage', r._to_terminal), n.on('session_end', r._after_session_end.bind(r)), n.set_sender(r._sender), delete r._parsed_session, r._zsession = n
        }, this._send_abort.bind(this), function () {
          return r._parsed_session === n
        }))
      } else {
        var a = this._parsed_session;
        this._parsed_session = null, a && (1 === t.length && 67 === t[0] && this._send_abort(), this._on_retract())
      }
      this._to_terminal(t)
    }

    get_confirmed_session() {
      return this._zsession || null
    }

    _send_abort() {
      this._sender(t.ZMLIB.ABORT_SEQUENCE)
    }

    _parse(e) {
      var _ = this._cache;
      for (_.push.apply(_, e); ;) {
        let e = t.ZMLIB.find_subarray(_, r);
        if (-1 === e) break;
        let n, a = _.splice(0, e);
        try {
          n = t.Session.parse(_)
        } catch (e) {
        }
        if (!n) break;
        return 1 === _.length && _[0] === t.ZMLIB.XON && _.shift(), _.length ? null : n
      }
      return _.splice(21), null
    }
  }
}, function (e, _, n) {
  'use strict';

  function t(e) {
    return 0 === r.ZMLIB.find_subarray(e, o) ? e.splice(0, o.length) : e[0] === o[o.length - 1] && e.splice(0, 1), e
  }

  var r = e.exports;
  r.DEBUG = !1, Object.assign(r, n(2), n(10), n(3), n(0), n(11), n(13), n(14), n(1));
  const a = ['CANFDX', 'CANOVIO', 'CANFC32'], s = 'spool_uint8array', d = 8, o = [79, 79], i = r.ZMLIB.ABORT_SEQUENCE;

  class l {
    constructor() {
      this._on_evt = {}, this._evt_once_index = {}
    }

    _Add_event(e) {
      this._on_evt[e] = [], this._evt_once_index[e] = []
    }

    _get_evt_queue(e) {
      if (!this._on_evt[e]) throw'Bad event: ' + e;
      return this._on_evt[e]
    }

    on(e, _) {
      var n = this._get_evt_queue(e);
      return n.push(_), this
    }

    off(e, _) {
      var n = this._get_evt_queue(e);
      if (_) {
        var t = n.indexOf(_);
        if (-1 === t) throw'\u201C' + _ + '\u201D is not in the \u201C' + e + '\u201D queue.';
        n.splice(t, 1)
      } else n.pop();
      return this
    }

    _Happen(e) {
      var _ = this._get_evt_queue(e), n = Array.apply(null, arguments);
      n.shift();
      var t = this;
      return _.forEach(function (e) {
        e.apply(t, n)
      }), _.length
    }
  }

  r.Session = class extends l {
    static parse(e) {
      var _;
      try {
        _ = r.Header.parse_hex(e)
      } catch (_) {
        return
      }
      if (_) switch (_.NAME) {
        case'ZRQINIT':
          return new r.Session.Receive;
        case'ZRINIT':
          return new r.Session.Send(_);
      }
    }

    set_sender(e) {
      return this._sender = e, this
    }

    has_ended() {
      return this._has_ended()
    }

    consume(e) {
      if (this._before_consume(e), this._aborted) throw new r.Error('already_aborted');
      return e.length ? (this._strip_and_enqueue_input(e), void (this._check_for_abort_sequence(e) || this._consume_first())) : void 0
    }

    aborted() {
      return !!this._aborted
    }

    constructor() {
      super(), this._config = {}, this._input_buffer = [], this._Add_event('receive'), this._Add_event('garbage'), this._Add_event('session_end')
    }

    get_role() {
      return this.type
    }

    _trim_leading_garbage_until_header() {
      var e = r.Header.trim_leading_garbage(this._input_buffer);
      e.length && 0 === this._Happen('garbage', e) && console.debug('Garbage: ', String.fromCharCode.apply(String, e), e)
    }

    _parse_and_consume_header() {
      this._trim_leading_garbage_until_header();
      var e = r.Header.parse(this._input_buffer);
      if (e) return r.DEBUG && this._log_header('RECEIVED HEADER', e[0]), this._consume_header(e[0]), this._last_header_name = e[0].NAME, this._last_header_crc = e[1], e[0]
    }

    _log_header(e, _) {
      console.debug(this.type, e, _.NAME, _._bytes4.join())
    }

    _consume_header(e) {
      this._on_receive(e);
      var _ = this._next_header_handler && this._next_header_handler[e.NAME];
      if (!_) throw console.error('Unhandled header!', e, this._next_header_handler), new r.Error('Unhandled header: ' + e.NAME);
      this._next_header_handler = null, _.call(this, e)
    }

    _check_for_abort_sequence() {
      var e = r.ZMLIB.find_subarray(this._input_buffer, i);
      if (-1 !== e) return this._input_buffer.splice(0, e + i.length), this._aborted = !0, this._on_session_end(), !0
    }

    _send_header() {
      if (!this._sender) throw'Need sender!';
      var e = Array.apply(null, arguments), _ = this._create_header_bytes(e);
      r.DEBUG && this._log_header('SENDING HEADER', _[1]), this._sender(_[0]), this._last_sent_header = _[1]
    }

    _create_header_bytes(e) {
      var _ = r.Header.build.apply(r.Header, e), n = this._get_header_formatter(e[0]);
      return [_[n](this._zencoder), _]
    }

    _strip_and_enqueue_input(e) {
      r.ZMLIB.strip_ignored_bytes(e), this._input_buffer.push.apply(this._input_buffer, e)
    }

    abort() {
      return this._sender(i.concat([d, d, d, d, d])), this._aborted = !0, this._sender = function () {
        throw new r.Error('already_aborted')
      }, void this._on_session_end()
    }

    _on_session_end() {
      this._Happen('session_end')
    }

    _on_receive(e) {
      this._Happen('receive', e)
    }

    _before_consume() {
    }
  }, r.Session.Receive = class extends r.Session {
    constructor() {
      super(), this._Add_event('offer'), this._Add_event('data_in'), this._Add_event('file_end')
    }

    _before_consume(e) {
      if (this._bytes_after_OO) throw'PROTOCOL: Session is completed!';
      this._bytes_being_consumed = e
    }

    get_trailing_bytes() {
      if (this._aborted) return [];
      if (!this._bytes_after_OO) throw'PROTOCOL: Session is not completed!';
      return this._bytes_after_OO.slice(0)
    }

    _has_ended() {
      return this.aborted() || !!this._bytes_after_OO
    }

    _get_header_formatter() {
      return 'to_hex'
    }

    _parse_and_consume_subpacket() {
      var e = 16 === this._last_header_crc ? 'parse16' : 'parse32';
      var _ = r.Subpacket[e](this._input_buffer);
      return _ && (r.DEBUG && console.debug(this.type, 'RECEIVED SUBPACKET', _), this._consume_data(_), _.frame_end() && (this._next_subpacket_handler = null)), _
    }

    _consume_first() {
      if (this._got_ZFIN) {
        if (2 > this._input_buffer.length) return;
        if (0 === r.ZMLIB.find_subarray(this._input_buffer, o)) return this._bytes_after_OO = t(this._bytes_being_consumed.slice(0)), void this._on_session_end();
        throw'PROTOCOL: Only thing after ZFIN should be \u201COO\u201D (79,79), not: ' + this._input_buffer.join()
      }
      var e;
      do e = this._next_subpacket_handler ? this._parse_and_consume_subpacket() : this._parse_and_consume_header(); while (e && this._input_buffer.length)
    }

    _consume_data(e) {
      if (this._on_receive(e), !this._next_subpacket_handler) throw'PROTOCOL: Received unexpected data packet after ' + this._last_header_name + ' header: ' + e.get_payload().join();
      this._next_subpacket_handler.call(this, e)
    }

    _octets_to_string(e) {
      return this._textdecoder || (this._textdecoder = new r.Text.Decoder), this._textdecoder.decode(new Uint8Array(e))
    }

    _consume_ZFILE_data(e, _) {
      if (this._file_info) throw'PROTOCOL: second ZFILE data subpacket received';
      var n = _.get_payload(), t = n.indexOf(0), r = this._octets_to_string(n.slice(0, t)),
        a = this._octets_to_string(n.slice(1 + t)).split(' '), s = a[1] && parseInt(a[1], 8) || void 0;
      s && (s = new Date(1e3 * s)), this._file_info = {
        name: r,
        size: a[0] ? parseInt(a[0], 10) : null,
        mtime: s || null,
        mode: a[2] && parseInt(a[2], 8) || null,
        serial: a[3] && parseInt(a[3], 10) || null,
        files_remaining: a[4] ? parseInt(a[4], 10) : null,
        bytes_remaining: a[5] ? parseInt(a[5], 10) : null
      };
      var d = new f(e.get_options(), this._file_info, this._accept.bind(this), this._skip.bind(this));
      this._current_transfer = d
    }

    _consume_ZDATA_data(e) {
      if (!this._accepted_offer) throw'PROTOCOL: Received data without accepting!';
      return this._offset_ok ? void (this._file_offset += e.get_payload().length, this._on_data_in(e), e.ack_expected() && !e.frame_end() && this._send_header('ZACK', r.ENCODELIB.pack_u32_le(this._file_offset))) : (console.warn('offset not ok!'), void _send_ZRPOS())
    }

    _make_promise_for_between_files() {
      var e = this;
      return new Promise(function (_) {
        var n = {
          ZFILE: function (e) {
            this._next_subpacket_handler = function (n) {
              this._next_subpacket_handler = null, this._consume_ZFILE_data(e, n), this._Happen('offer', this._current_transfer), _(this._current_transfer)
            }
          }, ZSINIT: function () {
            e._next_subpacket_handler = function (_) {
              e._next_subpacket_handler = null, e._consume_ZSINIT_data(_), e._send_header('ZACK'), e._next_header_handler = n
            }
          }, ZFIN: function () {
            this._consume_ZFIN(), _()
          }
        };
        e._next_header_handler = n
      })
    }

    _consume_ZSINIT_data(e) {
      this._attn = e.get_payload()
    }

    start() {
      if (this._started) throw'Already started!';
      this._started = !0;
      var e = this._make_promise_for_between_files();
      return this._send_ZRINIT(), e
    }

    _accept(e) {
      this._accepted_offer = !0, this._file_offset = e || 0;
      var _ = this, n = new Promise(function (e) {
        _._next_header_handler = {
          ZDATA: function (_) {
            this._consume_ZDATA(_), this._next_subpacket_handler = this._consume_ZDATA_data, this._next_header_handler = {
              ZEOF: function (_) {
                this._consume_ZEOF(_), this._next_subpacket_handler = null, this._make_promise_for_between_files(), e(), this._send_ZRINIT()
              }
            }
          }
        }
      });
      return this._send_ZRPOS(), n
    }

    _skip() {
      var e = this._make_promise_for_between_files();
      if (this._accepted_offer) {
        if (!this._current_transfer) return;
        var _ = function () {
          this._accepted_offer = !1, this._next_subpacket_handler = null, this._make_promise_for_between_files()
        }.bind(this);
        Object.assign(this._next_header_handler, {
          ZEOF: _, ZDATA: function () {
            _(), this._next_header_handler.ZEOF = _
          }.bind(this)
        })
      }
      return this._file_info = null, this._send_header('ZSKIP'), e
    }

    _send_ZRINIT() {
      this._send_header('ZRINIT', a)
    }

    _consume_ZFIN() {
      this._got_ZFIN = !0, this._send_header('ZFIN')
    }

    _consume_ZEOF(e) {
      if (this._file_offset !== e.get_offset()) throw'ZEOF offset mismatch; unimplemented (local: ' + this._file_offset + '; ZEOF: ' + e.get_offset() + ')';
      this._on_file_end(), this._file_info = null, this._current_transfer = null
    }

    _consume_ZDATA(e) {
      if (this._file_offset === e.get_offset()) this._offset_ok = !0; else throw'Error correction is unimplemented.'
    }

    _send_ZRPOS() {
      this._send_header('ZRPOS', this._file_offset)
    }

    _on_file_end() {
      this._Happen('file_end'), this._current_transfer && (this._current_transfer._Happen('complete'), this._current_transfer = null)
    }

    _on_data_in(e) {
      this._Happen('data_in', e), this._current_transfer && this._current_transfer._Happen('input', e.get_payload())
    }
  }, Object.assign(r.Session.Receive.prototype, {type: 'receive'});
  var c = {
    get_details: function () {
      return Object.assign({}, this._file_info)
    }, get_options: function () {
      return Object.assign({}, this._zfile_opts)
    }, get_offset: function () {
      return this._file_offset
    }
  };

  class p extends l {
    constructor(e, _, n, t) {
      super(), this._file_info = e, this._file_offset = _ || 0, this._send = n, this._end = t, this._Add_event('send_progress')
    }

    send(e) {
      this._send(e), this._file_offset += e.length
    }

    end(e) {
      var _ = this._end(e || []);
      return e && (this._file_offset += e.length), _
    }
  }

  Object.assign(p.prototype, c);

  class f extends l {
    constructor(e, _, n, t) {
      super(), this._zfile_opts = e, this._file_info = _, this._accept_func = n, this._skip_func = t, this._Add_event('input'), this._Add_event('complete'), this.on('input', this._input_handler)
    }

    _verify_not_skipped() {
      if (this._skipped) throw new r.Error('Already skipped!')
    }

    skip() {
      return this._verify_not_skipped(), this._skipped = !0, this._skip_func.apply(this, arguments)
    }

    accept(e) {
      if (this._verify_not_skipped(), this._accepted) throw new r.Error('Already accepted!');
      switch (this._accepted = !0, e || (e = {}), this._file_offset = e.offset || 0, e.on_input) {
        case null:
        case void 0:
        case'spool_array':
        case s:
          this._spool = [];
          break;
        default:
          if ('function' != typeof e.on_input) throw'Invalid \u201Con_input\u201D: ' + e.on_input;
      }
      return this._input_handler_mode = e.on_input || s, this._accept_func(this._file_offset).then(this._get_spool.bind(this))
    }

    _input_handler(e) {
      if (this._file_offset += e.length, 'function' == typeof this._input_handler_mode) this._input_handler_mode(e); else {
        if (this._input_handler_mode === s) e = new Uint8Array(e); else if ('spool_array' !== this._input_handler_mode) throw new r.Error('WTF?? _input_handler_mode = ' + this._input_handler_mode);
        this._spool.push(e)
      }
    }

    _get_spool() {
      return this._spool
    }
  }

  Object.assign(f.prototype, c);
  const u = {ZFILE: !0, ZDATA: !0};
  r.Session.Send = class extends r.Session {
    constructor(e) {
      if (super(), !e) throw'Need first header!'; else if ('ZRINIT' !== e.NAME) throw'First header should be ZRINIT, not ' + e.NAME;
      this._last_header_name = 'ZRINIT', this._subpacket_encode_func = 'encode16', this._zencoder = new r.ZDLE, this._consume_ZRINIT(e), this._file_offset = 0;
      this._start_keepalive_on_set_sender = !0
    }

    set_sender(e) {
      return super.set_sender(e), this._start_keepalive_on_set_sender && (this._start_keepalive_on_set_sender = !1, this._start_keepalive()), this
    }

    _get_header_formatter(e) {
      return u[e] ? 'to_binary16' : 'to_hex'
    }

    _start_keepalive() {
      if (!this._keepalive_promise) {
        var e = this;
        this._keepalive_promise = new Promise(function (_) {
          e._keepalive_timeout = setTimeout(_, 5e3)
        }).then(function () {
          e._next_header_handler = {
            ZACK: function () {
              e._got_ZSINIT_ZACK = !0
            }
          }, e._send_ZSINIT(), e._keepalive_promise = null, e._start_keepalive()
        })
      }
    }

    _stop_keepalive() {
      this._keepalive_promise && (clearTimeout(this._keepalive_timeout), this._keep_alive_promise = null)
    }

    _send_ZSINIT() {
      var e = [];
      this._zencoder.escapes_ctrl_chars() && e.push('ESCCTL'), this._send_header_and_data(['ZSINIT', e], [0], 'end_ack')
    }

    _consume_ZRINIT(e) {
      if (this._last_ZRINIT = e, e.get_buffer_size()) throw'Buffer size (' + e.get_buffer_size() + ') is unsupported!';
      if (!e.can_full_duplex()) throw'Half-duplex I/O is unsupported!';
      if (!e.can_overlap_io()) throw'Non-overlap I/O is unsupported!';
      if (e.escape_8th_bit()) throw'8-bit escaping is unsupported!';
      this._zencoder.set_escape_ctrl_chars(!0), !e.escape_ctrl_chars() && console.debug('Peer didn\u2019t request escape of all control characters. Will send ZSINIT to force recognition of escaped control characters.')
    }

    _ensure_receiver_escapes_ctrl_chars() {
      var e, _ = !this._last_ZRINIT.escape_ctrl_chars() && !this._got_ZSINIT_ZACK;
      if (_) {
        var n = this;
        e = new Promise(function (e) {
          n._next_header_handler = {
            ZACK: () => {
              e()
            }
          }, n._send_ZSINIT()
        })
      } else e = Promise.resolve();
      return e
    }

    _convert_params_to_offer_payload_array(e) {
      e = r.Validation.offer_parameters(e);
      var _ = e.name + '\0',
        n = [(e.size || 0).toString(10), e.mtime ? e.mtime.toString(8) : '0', e.mode ? (32768 | e.mode).toString(8) : '0', '0'];
      return e.files_remaining && (n.push(e.files_remaining), e.bytes_remaining && n.push(e.bytes_remaining)), _ += n.join(' '), this._string_to_octets(_)
    }

    send_offer(e) {
      function _() {
        t._next_header_handler = {
          ZRPOS: function () {
            r.DEBUG && console.warn('Mid-transfer ZRPOS \u2026 implementation error?'), _()
          }
        }
      }

      if (r.DEBUG && console.debug('SENDING OFFER', e), !e) throw'need file params!';
      if (this._sending_file) throw'Already sending file!';
      var n = this._convert_params_to_offer_payload_array(e);
      this._stop_keepalive();
      var t = this, a = function () {
        var r = new Promise(function (n) {
          t._next_header_handler = {
            ZSKIP: function () {
              t._start_keepalive(), n()
            }, ZRPOS: function (r) {
              t._sending_file = !0, _();
              let a = new p(e, r.get_offset(), t._send_interim_file_piece.bind(t), t._end_file.bind(t));
              this._current_transfer = a, n(a)
            }
          }
        });
        return t._send_header_and_data(['ZFILE'], n, 'end_ack'), delete t._sent_ZDATA, r
      };
      return this._ensure_receiver_escapes_ctrl_chars().then(a)
    }

    _send_header_and_data(e, _, n) {
      var t = this._create_header_bytes(e), a = this._build_subpacket_bytes(_, n);
      t[0].push.apply(t[0], a), r.DEBUG && (this._log_header('SENDING HEADER', t[1]), console.debug(this.type, '-- HEADER PAYLOAD:', n, a.length)), this._sender(t[0]), this._last_sent_header = t[1]
    }

    _build_subpacket_bytes(e, _) {
      var n = r.Subpacket.build(e, _);
      return n[this._subpacket_encode_func](this._zencoder)
    }

    _build_and_send_subpacket(e, _) {
      this._sender(this._build_subpacket_bytes(e, _))
    }

    _string_to_octets(e) {
      this._textencoder || (this._textencoder = new r.Text.Encoder);
      var _ = this._textencoder.encode(e);
      return Array.prototype.slice.call(_)
    }

    _send_interim_file_piece(e) {
      return this._send_file_part(e, 'no_end_no_ack'), Promise.resolve()
    }

    _ensure_we_are_sending() {
      if (!this._sending_file) throw'Not sending a file currently!'
    }

    _end_file(e) {
      this._ensure_we_are_sending(), this._send_file_part(e, 'end_no_ack');
      var _ = this, n = new Promise(function (e) {
        _._sending_file = !1, _._prepare_to_receive_ZRINIT(e)
      });
      return this._send_header('ZEOF', this._file_offset), this._file_offset = 0, n
    }

    _prepare_to_receive_ZRINIT(e) {
      this._next_header_handler = {
        ZRINIT: function (_) {
          this._consume_ZRINIT(_), e && e()
        }
      }
    }

    close() {
      var e = 'ZRINIT' === this._last_header_name;
      if (e || (e = 'ZSKIP' === this._last_header_name), e || (e = 'ZSINIT' === this._last_sent_header.name && 'ZACK' === this._last_header_name), !e) throw'Can\u2019t close; last received header was \u201C' + this._last_header_name + '\u201D';
      var _ = this, n = new Promise(function (e) {
        _._next_header_handler = {
          ZFIN: function () {
            _._sender(o), _._sent_OO = !0, _._on_session_end(), e()
          }
        }
      });
      return this._send_header('ZFIN'), n
    }

    _has_ended() {
      return this.aborted() || !!this._sent_OO
    }

    _send_file_part(e, _) {
      this._sent_ZDATA || (this._send_header('ZDATA', this._file_offset), this._sent_ZDATA = !0);
      for (var n = 0, t = e.length; ;) {
        var r = Math.min(n + 8192, t) - n, a = r + n >= t, s = e.slice(n, n + r);
        if (s instanceof Array || (s = Array.prototype.slice.call(s)), this._build_and_send_subpacket(s, a ? _ : 'no_end_no_ack'), this._file_offset += r, n += r, this._current_transfer && this._current_transfer._Happen('send_progress', (100 * (n / t)).toFixed(2)), n >= t) {
          this._current_transfer._Happen('send_progress', 100), this._current_transfer = null;
          break
        }
      }
    }

    _consume_first() {
      if (!this._parse_and_consume_header() && '67' === this._input_buffer.join()) throw'Receiver has fallen back to YMODEM.'
    }

    _on_session_end() {
      this._stop_keepalive(), super._on_session_end()
    }
  }, Object.assign(r.Session.Send.prototype, {type: 'send'})
}, function (e) {
  var _ = e.exports;
  _.Text = {
    Encoder: 'undefined' == typeof TextEncoder ? class {
      encode(e) {
        e = unescape(encodeURIComponent(e));
        for (var _ = Array(e.length), n = 0; n < e.length; n++) _[n] = e.charCodeAt(n);
        return new Uint8Array(_)
      }
    } : TextEncoder, Decoder: 'undefined' == typeof TextDecoder ? class {
      decode(e) {
        return decodeURIComponent(escape(String.fromCharCode.apply(String, e)))
      }
    } : TextDecoder
  }
}, function (e, _, n) {
  'use strict';

  function t(e) {
    if (!Z[e]) throw new c.Error('Invalid ZRINIT flag: ' + e);
    return Z[e]
  }

  function r(e) {
    if (!k[e]) throw'Invalid ZSINIT flag: ' + e;
    return k[e]
  }

  function a(e) {
    var _ = P[e];
    if ('string' == typeof _) throw'Received unsupported header: ' + _;
    return s(_)
  }

  function s(e) {
    return e.prototype instanceof D ? new e(0) : new e([])
  }

  function d(e) {
    var _ = c.ZDLE.splice(e, m.length, 7);
    return _ && o(_)
  }

  function o(e) {
    c.CRC.verify16(e.slice(0, 5), e.slice(5));
    var _ = e[0], n = a(_);
    return n._bytes4 = e.slice(1, 5), n
  }

  function i(e) {
    var _ = c.ZDLE.splice(e, y.length, 9);
    if (_) {
      c.CRC.verify32(_.slice(0, 5), _.slice(5));
      var n = _[0], t = a(n);
      return t._bytes4 = _.slice(1, 5), t
    }
  }

  function l(e) {
    var _ = e.indexOf(138);
    -1 === _ && (_ = e.indexOf(10));
    var n, t;
    if (-1 === _) return void (11 < e.length && (n = 'Invalid hex header - no LF detected within 12 bytes!'));
    if (t = e.splice(0, _), e.shift(), 19 === t.length) {
      var r = t.pop();
      13 !== r && 141 !== r && (n = 'Invalid hex header: (CR/)LF doesn\u2019t have CR!')
    } else 18 !== t.length && (n = 'Invalid hex header: invalid number of bytes before LF!');
    if (n) throw n += ' (' + t.length + ' bytes: ' + t.join() + ')', n;
    t.splice(0, 4);
    var a = c.ENCODELIB.parse_hex_octets(t);
    return o(a)
  }

  var c = e.exports;
  Object.assign(c, n(2), n(3), n(0), n(4), n(1));
  const p = 42, f = 65, u = 67, h = [13, 10], b = h.slice(0).concat([c.ZMLIB.XON]), g = [p, p, c.ZMLIB.ZDLE, 66],
    m = [p, c.ZMLIB.ZDLE, f], y = [p, c.ZMLIB.ZDLE, u];
  c.Header = class {
    static trim_leading_garbage(e) {
      var _, n, t = [];
      TRIM_LOOP:for (; e.length && !n;) {
        var r = e.indexOf(p);
        if (-1 === r) {
          _ = !0;
          break TRIM_LOOP
        } else {
          if (t.push.apply(t, e.splice(0, r)), 2 > e.length) break TRIM_LOOP; else if (e[1] === p) {
            if (!(e.length < g.length)) e[2] === g[2] && e[3] === g[3] && (n = l); else if (e.join() === g.slice(0, e.length).join()) break TRIM_LOOP;
          } else if (e[1] === c.ZMLIB.ZDLE) {
            if (e.length < m.length) break TRIM_LOOP;
            e[2] === m[2] ? n = d : e[2] === y[2] && (n = i)
          }
          n || t.push(e.shift())
        }
      }
      return _ && t.push.apply(t, e.splice(0)), t
    }

    static parse(e) {
      var _;
      if (e[1] === p) return _ = l(e), _ && [_, 16];
      if (e[2] === f) return _ = d(e, 3), _ && [_, 16];
      if (e[2] === u) return _ = i(e), _ && [_, 32];
      if (!(3 > e.length)) throw'Unrecognized/unsupported octets: ' + e.join()
    }

    static build(e) {
      var _ = 1 === arguments.length ? [arguments[0]] : Array.apply(null, arguments), n = H[e];
      if (!n) throw'No frame class \u201C' + e + '\u201D is defined!';
      _.shift();
      var t = new (n.bind.apply(n, [null].concat(_)));
      return t
    }

    to_hex() {
      var e = this._crc_bytes();
      return g.concat(c.ENCODELIB.octets_to_hex(e.concat(c.CRC.crc16(e))), this._hex_header_ending)
    }

    to_binary16(e) {
      return this._to_binary(e, m, c.CRC.crc16)
    }

    to_binary32(e) {
      return this._to_binary(e, y, c.CRC.crc32)
    }

    constructor() {
      this._bytes4 || (this._bytes4 = [0, 0, 0, 0])
    }

    _to_binary(e, _, n) {
      var t = this._crc_bytes(), r = _.concat(e.encode(t.concat(n(t))));
      return r
    }

    _crc_bytes() {
      return [this.TYPENUM].concat(this._bytes4)
    }
  }, c.Header.prototype._hex_header_ending = b;

  class E extends c.Header {
  }

  const Z = {CANFDX: 1, CANOVIO: 2, CANBRK: 4, CANCRY: 8, CANLZW: 16, CANFC32: 32, ESCCTL: 64, ESC8: 128};

  class I extends c.Header {
    constructor(e, _) {
      super();
      var n = 0;
      _ || (_ = 0), e.forEach(function (e) {
        n |= t(e)
      }), this._bytes4 = [255 & _, _ >> 8, 0, n]
    }

    get_buffer_size() {
      return c.ENCODELIB.unpack_u16_be(this._bytes4.slice(0, 2)) || void 0
    }

    can_full_duplex() {
      return !!(this._bytes4[3] & Z.CANFDX)
    }

    can_overlap_io() {
      return !!(this._bytes4[3] & Z.CANOVIO)
    }

    can_break() {
      return !!(this._bytes4[3] & Z.CANBRK)
    }

    can_fcs_32() {
      return !!(this._bytes4[3] & Z.CANFC32)
    }

    escape_ctrl_chars() {
      return !!(this._bytes4[3] & Z.ESCCTL)
    }

    escape_8th_bit() {
      return !!(this._bytes4[3] & Z.ESC8)
    }
  }

  const k = {ESCCTL: 64, ESC8: 128};

  class C extends c.Header {
    constructor(e, _) {
      super();
      var n = 0;
      if (e.forEach(function (e) {
        n |= r(e)
      }), this._bytes4 = [0, 0, 0, n], _) {
        if (31 < _.length) throw'Attn sequence must be <= 31 bytes';
        if (_.some(function (e) {
          return 255 < e
        })) throw'Attn sequence (' + _ + ') must be <256';
        this._data = _.concat([0])
      }
    }

    escape_ctrl_chars() {
      return !!(this._bytes4[3] & k.ESCCTL)
    }

    escape_8th_bit() {
      return !!(this._bytes4[3] & k.ESC8)
    }
  }

  class v extends c.Header {
    constructor(e) {
      super(), e && (this._bytes4 = e.slice())
    }
  }

  v.prototype._hex_header_ending = h;
  const N = {
    extended: {sparse: 64},
    transport: [void 0, 'compress', 'encrypt', 'rle'],
    management: [void 0, 'newer_or_longer', 'crc', 'append', 'clobber', 'newer', 'mtime_or_length', 'protect', 'rename'],
    conversion: [void 0, 'binary', 'text', 'resume']
  }, x = ['extended', 'transport', 'management', 'conversion'];

  class O extends c.Header {
    get_options() {
      var e = {sparse: !!(this._bytes4[0] & 64)}, _ = this._bytes4.slice(0);
      return x.forEach(function (n, t) {
        if (N[n] instanceof Array) 'management' === n && (e.skip_if_absent = !!(_[t] & 128), _[t] &= 31), e[n] = N[n][_[t]]; else for (var r in N[n]) e[r] = !!(_[t] & N[n][r]), e[r] && (_[t] ^= N[n][r]);
        !e[n] && _[t] && (e[n] = 'unknown:' + _[t])
      }), e
    }
  }

  class A extends c.Header {
  }

  class L extends c.Header {
  }

  class R extends c.Header {
  }

  class T extends c.Header {
  }

  R.prototype._hex_header_ending = h;

  class D extends c.Header {
    constructor(e) {
      super(), this._bytes4 = c.ENCODELIB.pack_u32_le(e)
    }

    get_offset() {
      return c.ENCODELIB.unpack_u32_le(this._bytes4)
    }
  }

  class S extends D {
  }

  class B extends D {
  }

  class F extends D {
  }

  const M = [[E, 'ZRQINIT'], [I, 'ZRINIT'], [C, 'ZSINIT'], [v, 'ZACK'], [O, 'ZFILE'], [A, 'ZSKIP'], void 0, [L, 'ZABORT'], [R, 'ZFIN'], [S, 'ZRPOS'], [B, 'ZDATA'], [F, 'ZEOF'], [T, 'ZFERR'], void 0, void 0, void 0, void 0, void 0, void 0, void 0];
  for (var H = {}, z = 0; z < M.length; z++) M[z] && (H[M[z][1]] = M[z][0], Object.assign(M[z][0].prototype, {
    TYPENUM: z,
    NAME: M[z][1]
  }));
  const P = [E, I, C, v, O, A, 'ZNAK', L, R, S, B, F, T, 'ZCRC', 'ZCHALLENGE', 'ZCOMPL', 'ZCAN', 'ZFREECNT', 'ZCOMMAND', 'ZSTDERR'];
  c.Header.parse_hex = l
}, function (e, _) {
  var n;
  (function (e) {
    'undefined' == typeof DO_NOT_EXPORT_CRC ? e(_) : e(n = {})
  })(function (e) {
    function _(e, _) {
      for (var t = -1 ^ _, r = e.length - 7, a = 0; a < r;) t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])], t = t >>> 8 ^ n[255 & (t ^ e[a++])];
      for (; a < r + 7;) t = t >>> 8 ^ n[255 & (t ^ e[a++])];
      return -1 ^ t
    }

    e.version = '1.1.1';
    var n = function () {
      for (var e = 0, _ = Array(256), t = 0; 256 != t; ++t) e = t, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1, _[t] = e;
      return 'undefined' == typeof Int32Array ? _ : new Int32Array(_)
    }();
    e.table = n, e.bstr = function (e, _) {
      for (var t = -1 ^ _, r = e.length - 1, a = 0; a < r;) t = t >>> 8 ^ n[255 & (t ^ e.charCodeAt(a++))], t = t >>> 8 ^ n[255 & (t ^ e.charCodeAt(a++))];
      return a == r && (t = t >>> 8 ^ n[255 & (t ^ e.charCodeAt(a))]), -1 ^ t
    }, e.buf = function (e, t) {
      if (1e4 < e.length) return _(e, t);
      for (var r = -1 ^ t, a = e.length - 3, s = 0; s < a;) r = r >>> 8 ^ n[255 & (r ^ e[s++])], r = r >>> 8 ^ n[255 & (r ^ e[s++])], r = r >>> 8 ^ n[255 & (r ^ e[s++])], r = r >>> 8 ^ n[255 & (r ^ e[s++])];
      for (; s < a + 3;) r = r >>> 8 ^ n[255 & (r ^ e[s++])];
      return -1 ^ r
    }, e.str = function (e, _) {
      for (var t, r, a = -1 ^ _, s = 0, d = e.length; s < d;) t = e.charCodeAt(s++), 128 > t ? a = a >>> 8 ^ n[255 & (a ^ t)] : 2048 > t ? (a = a >>> 8 ^ n[255 & (a ^ (192 | 31 & t >> 6))], a = a >>> 8 ^ n[255 & (a ^ (128 | 63 & t))]) : 55296 <= t && 57344 > t ? (t = (1023 & t) + 64, r = 1023 & e.charCodeAt(s++), a = a >>> 8 ^ n[255 & (a ^ (240 | 7 & t >> 8))], a = a >>> 8 ^ n[255 & (a ^ (128 | 63 & t >> 2))], a = a >>> 8 ^ n[255 & (a ^ (128 | 15 & r >> 6 | (3 & t) << 4))], a = a >>> 8 ^ n[255 & (a ^ (128 | 63 & r))]) : (a = a >>> 8 ^ n[255 & (a ^ (224 | 15 & t >> 12))], a = a >>> 8 ^ n[255 & (a ^ (128 | 63 & t >> 6))], a = a >>> 8 ^ n[255 & (a ^ (128 | 63 & t))]);
      return -1 ^ a
    }
  })
}, function (e, _, n) {
  'use strict';
  var t = e.exports;
  Object.assign(t, n(4), n(3), n(0), n(1));
  var r;
  t.Subpacket = class e {
    static build(e, _) {
      var n = r[_];
      if (!n) throw'No subpacket type \u201C' + _ + '\u201D is defined! Try one of: ' + Object.keys(r).join(', ');
      return new n(e)
    }

    encode16(e) {
      return this._encode(e, t.CRC.crc16)
    }

    encode32(e) {
      return this._encode(e, t.CRC.crc32)
    }

    get_payload() {
      return this._payload
    }

    static parse16(_) {
      return e._parse(_, 2)
    }

    static parse32(_) {
      return e._parse(_, 4)
    }

    constructor(e) {
      this._payload = e
    }

    _encode(e, _) {
      return e.encode(this._payload.slice(0)).concat([t.ZMLIB.ZDLE, this._frameend_num], e.encode(_(this._payload.concat(this._frameend_num))))
    }

    static _parse(e, _) {
      for (var n, r, a = {104: d, 105: i, 106: l, 107: o}, s = 0; s < e.length;) {
        if (s = e.indexOf(t.ZMLIB.ZDLE, s), -1 === s) return;
        var c = e[s + 1];
        if (r = a[c], r) {
          n = s + 1;
          break
        }
        s++
      }
      if (r) {
        var p = e[n];
        if (e[n - 1] !== t.ZMLIB.ZDLE) throw'Byte before frame end should be ZDLE, not ' + e[n - 1];
        var f = e.splice(0, n - 1), u = t.ZDLE.splice(e, 2, _);
        if (!u) return void e.unshift.apply(e, f);
        var h = t.ZDLE.decode(f);
        return t.CRC[2 === _ ? 'verify16' : 'verify32'](h.concat([p]), u), new r(h, u)
      }
    }
  };

  class a extends t.Subpacket {
    frame_end() {
      return !0
    }
  }

  class s extends t.Subpacket {
    frame_end() {
      return !1
    }
  }

  class d extends a {
    ack_expected() {
      return !1
    }
  }

  d.prototype._frameend_num = 104;

  class o extends a {
    ack_expected() {
      return !0
    }
  }

  o.prototype._frameend_num = 107;

  class i extends s {
    ack_expected() {
      return !1
    }
  }

  i.prototype._frameend_num = 105;

  class l extends s {
    ack_expected() {
      return !0
    }
  }

  l.prototype._frameend_num = 106, r = {end_no_ack: d, end_ack: o, no_end_no_ack: i, no_end_ack: l}
}, function (e, _, n) {
  'use strict';

  function t(e, _) {
    if (0 > _) throw new a.Error('validation', '\u201C' + e + '\u201D (' + _ + ') must be nonnegative.');
    if (_ !== r(_)) throw new a.Error('validation', '\u201C' + e + '\u201D (' + _ + ') must be an integer.')
  }

  var r = Math.floor, a = e.exports;
  Object.assign(a, n(1));
  const s = /\*\x18[AC]|\*\*\x18B/;
  a.Validation = {
    offer_parameters: function (e) {
      if (!e.name) throw new a.Error('validation', 'Need \u201Cname\u201D!');
      if ('string' != typeof e.name) throw new a.Error('validation', '\u201Cname\u201D (' + e.name + ') must be a string!');
      if (e = Object.assign({}, e), s.test(e.name) && console.warn('The filename ' + JSON.stringify(name) + ' contains characters that look like a ZMODEM header. This could corrupt the ZMODEM session; consider renaming it so that the filename doesn\u2019t contain control characters.'), null !== e.serial && void 0 !== e.serial) throw new a.Error('validation', '\u201Cserial\u201D is meaningless.');
      if (e.serial = null, ['size', 'mode', 'files_remaining', 'bytes_remaining'].forEach(function (_) {
        var n;
        switch (typeof e[_]) {
          case'object':
            n = null === e[_];
            break;
          case'undefined':
            e[_] = null, n = !0;
            break;
          case'number':
            t(_, e[_]), n = !0;
        }
        if (!n) throw new a.Error('validation', '\u201C' + _ + '\u201D (' + e[_] + ') must be null, undefined, or a number.')
      }), 'number' == typeof e.mode && (e.mode |= 32768), 0 === e.files_remaining) throw new a.Error('validation', '\u201Cfiles_remaining\u201D, if given, must be positive.');
      var _;
      switch (typeof e.mtime) {
        case'object':
          if (_ = !0, e.mtime instanceof Date) {
            var n = e.mtime;
            if (e.mtime = r(n.getTime() / 1e3), 0 > e.mtime) throw new a.Error('validation', '\u201Cmtime\u201D (' + n + ') must not be earlier than 1970.')
          } else null !== e.mtime && (_ = !1);
          break;
        case'undefined':
          e.mtime = null, _ = !0;
          break;
        case'number':
          t('mtime', e.mtime), _ = !0;
      }
      if (!_) throw new a.Error('validation', '\u201Cmtime\u201D (' + e.mtime + ') must be null, undefined, a Date, or a number.');
      return e
    }
  }
}]);
