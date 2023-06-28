var Bson = require('bson')
var Net = require('net');
var EventEmitter = require('events');
var WebSocket = require('ws');
require('log-timestamp');

function random(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

//shanghai
let ws_url = 'ws://81.68.158.6:3333'

//东京
//let ws_url = 'ws://43.133.179.35:3333'
let port = '36100';

console.time();
const event_emitter = new EventEmitter();
let ws_session_id = 's-' + random(10)

const ws = new WebSocket(ws_url);
ws.on('open', function () {
  console.info('WebSocket connected');
  let json = JSON.stringify({
    Type: 'PtyStart',
    Data: {
      SessionId: ws_session_id,
      Cols: 100,
      Rows: 50,
    }
  });
  ws.send(json);
})

ws.on('error', function (err) {
  console.log('recive pty error', err);
});

ws.on('message', function (data, is_binary) {
  try {
    if (!is_binary) {
      let msg = JSON.parse(data);
      if (msg.Type == 'PtyReady') {
        console.log('recive pty ready');
      }
      return
    }
    if (is_binary) {
      let msg = Bson.deserialize(data);
      //console.log("recv proxy msg")
      if (msg.Type == 'PtyProxyReady') {
        proxy_id = msg.Data.Data.ProxyId;
        proxy_event = proxy_id + '#ready';
        event_emitter.emit(proxy_event, 'ready')
      } else if (msg.Type == 'PtyProxyData') {
        proxy_id = msg.Data.Data.ProxyId;
        let proxy_event = proxy_id + '#data';
        data = msg.Data.Data.Data;
        event_emitter.emit(proxy_event, data)
      } else if (msg.Type == 'PtyProxyClose') {
        proxy_id = msg.Data.Data.ProxyId;
        let proxy_event = proxy_id + '#close';
        console.log('pty proxy msg', proxy_id)
        event_emitter.emit(proxy_event, 'close')
      } else {
        console.log('unknown proxy msg')
      }
    }
  } catch (e) {
    console.error(e);
  }
})

function proxy_start(proxy_id, port) {
  let msg = {
    Type: 'PtyProxyNew',
    Data: {
      SessionId: ws_session_id,
      CustomData: '',
      Data: {
        ProxyId: proxy_id,
        Port: port,
        Ip: '127.0.0.1',
      },
    }
  }
  ws.send(Bson.serialize(msg));
}

function proxy_data(proxy_id, data) {
  let msg = {
    Type: 'PtyProxyData',
    Data: {
      SessionId: ws_session_id,
      CustomData: '',
      Data: {
        ProxyId: proxy_id,
        Data: data,
      },
    }
  }
  ws.send(Bson.serialize(msg));
}

function proxy_close(proxy_id) {
  let msg = {
    Type: 'PtyProxyClose',
    Data: {
      SessionId: ws_session_id,
      CustomData: '',
      Data: {
        ProxyId: proxy_id,
      },
    }
  }
  ws.send(Bson.serialize(msg));
}

var server = Net.createServer(function (socket) {

  let proxy_id = 'p-' + random(10)
  console.log(proxy_id, 'new connection')

  let event_ready = proxy_id + '#ready';
  let event_data = proxy_id + '#data';
  let event_close = proxy_id + '#close';

  // let data_from_proxy = 0;
  // let data_from_cnt = 0;

  event_emitter.on(event_data, (data) => {
    //data from tat
    //console.log(proxy_id, 'recive  proxy data size:', data.length);
    // data_from_proxy += data.length
    // data_from_cnt += 1
    try {
      //let xxx = Uint8Array.from(data);
      let xxx = new Uint8Array(data.buffer)
      socket.write(xxx)
    } catch (err) {
      console(proxy_id, 'write get error');
    }
  })

  event_emitter.on(event_ready, (msg) => {
    console.log(proxy_id, 'recive proxy ready');
    socket.on('data', (buf) => {
      var data = Array.prototype.slice.call(buf)
      proxy_data(proxy_id, data)
    })
  })

  event_emitter.on(event_close, (msg) => {
    console.log(proxy_id, 'recive proxy close');
    remote_closed = true;
    socket.destroy()
  })

  proxy_start(proxy_id, port)

  socket.on('close', () => {
    console.log(proxy_id, 'client close');
    proxy_close(proxy_id)
    event_emitter.removeAllListeners(event_ready);
    event_emitter.removeAllListeners(event_data);
    event_emitter.removeAllListeners(event_close);
  })

})


server.listen(1337, () => {
  console.log('http://127.0.0.1:1337');
});





