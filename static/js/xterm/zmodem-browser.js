Object.assign(Terminal.prototype, {
  zmodemAttach: function zmodemAttach(ws, opts) {
    const term = this;

    if (!opts) opts = {};

    const senderFunc = function _ws_sender_func(octets) {
      ws.send(new Uint8Array(octets));
    };

    let zsentry;

    function _shouldWrite() {
      return !!zsentry.get_confirmed_session() || !opts.noTerminalWriteOutsideSession;
    }

    zsentry = new Zmodem.Sentry({
      to_terminal: function _to_terminal(octets) {
        if (_shouldWrite()) {
          term.write(String.fromCharCode.apply(String, octets));
        }
      },

      sender: senderFunc,

      on_retract: function _on_retract() {
        if (term.zmodemRetract) {
          term.zmodemRetract();
        }
      },

      on_detect: function _on_detect(detection) {
        if (term.zmodemDetect) {
          term.zmodemDetect(detection);
        }
      },
    });

    function handleWSMessage(evt) {
      // In testing with xterm.js’s demo the first message was
      // always text even if the rest were binary. While that
      // may be specific to xterm.js’s demo, ultimately we
      // should reject anything that isn’t binary.
      if (typeof evt.data === 'string') {
        if (_shouldWrite()) {
          term.write(evt.data)
        }
      } else {
        zsentry.consume(evt.data);
      }
    }

    ws.binaryType = 'arraybuffer';
    ws.addEventListener('message', handleWSMessage);
  },

  zmodemBrowser: Zmodem.Browser,
})
