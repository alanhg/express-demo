const {execSync} = require('child_process');

const lsToJson = (stdout) => {
  const lines = stdout.trim().split('\n').slice(1);
  // Convert the lines to JSON
  const json = lines.map(line => {
    const parts = line.split(/\s+/);
    return {
      type: line[0],
      name: parts[8],
      size: parseInt(parts[4], 10),
      modifyTime: `${parts[5]} ${parts[6]} ${parts[7]}`,
      accessTime: null,
      rights: parts[0],
      owner: parts[2],
      group: parts[3],
      longname: line,
    };
  });
  return json;
}
const RIGHTS_NUM_TO_STR = {
  7: 'rwx',
  6: 'rw-',
  5: 'r-x',
  4: 'r--',
  3: '-wx',
  2: '-w-',
  1: '--x',
  0: '---',
};

function formatUserIdentifyCommandOutput(data1, data2) {
  const idStr = data1.toString();
  const arr = idStr.match(/\d+/g);
  const pwdStr = data2.toString().replace(/\n$/, '');
  return {
    uid: +arr[0],
    gid: +arr[1],
    loginPwd: pwdStr,
  };
}

function handleFileModeRights(str) {
  return (str & parseInt('777', 8)).toString(8)
      .split('')
      .reduce((res, item) => {
        res += RIGHTS_NUM_TO_STR[+item];
        return res;
      }, '');
}


class TkeClient {

  constructor(podname, namespace) {
    this.podname = podname;
    this.namespace = namespace;
  }


  connect() {

  }

  list(path) {
    const command = `ls -l ${path}`;
    const output = execSync(`kubectl exec -it ${this.podname} -n ${this.namespace} -- ${command}`, {encoding: 'utf8'});
    return lsToJson(output);
  }


  stat(path) {
    const command = `stat ${path}`;
    const output = execSync(`kubectl exec -it ${this.podname} -n ${this.namespace} -- ${command}`, {encoding: 'utf8'});

    const size = output.match(/(?<=Size: )(\d+)/)[0];
    const type = output.match(/(?<=Access: \(\d+\/)(\w)/)[0];
    const rights = output.match(/(?<=Access: \(\d)(\d+)/)[0];
    const owner = output.match(/(?<= Uid: \(\s+)(\d+)/)[0];
    const group = output.match(/(?<= Gid: \(\s+)(\d+)/)[0];
    return {
      path: path,
      isDirectory: type === 'd',
      isFile: type === '-',
      isSymbolicLink: type === 'l',
      size: +size,
      rights: handleFileModeRights(rights),
      owner: owner,
      group: group,
    };
  }

  downloadFile() {

  }

  uploadFile() {

  }

  id(username = 'root') {
    const command = `id ${username}`;
    const output = execSync(`kubectl exec -it ${this.podname} -n ${this.namespace} -- ${command}`, {encoding: 'utf8'});
    console.log(output);
    return output;
  }

  pwd() {
    const command = `pwd`;
    const output = execSync(`kubectl exec -it ${this.podname} -n ${this.namespace} -- ${command}`, {encoding: 'utf8'});
    return output;
  }

  execUserIdentity() {
    return formatUserIdentifyCommandOutput(this.id(), this.pwd());
  }

}

module.exports = TkeClient;