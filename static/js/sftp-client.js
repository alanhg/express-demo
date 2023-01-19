class SftpClient extends EventEmitter {
  constructor(url) {
    super();
    const socket = new WebSocket(url);
    socket.onopen = () => {
      this.send('connect', JSON.parse(document.getElementById('proxyHost').value))
    }
    socket.onmessage = (evt) => {
      if (typeof evt.data === 'string') {
        const opts = JSON.parse(evt.data)
        this.emit(opts.type, opts.data);
      } else {
        this.emit('binary-data', evt.data);
      }
    }
    this.socket = socket;
  }

  send(type, data) {
    this.socket.send(JSON.stringify({type, data}));
    return this;
  }
}

export default SftpClient;
