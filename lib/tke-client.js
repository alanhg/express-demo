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
}

module.exports = TkeClient;