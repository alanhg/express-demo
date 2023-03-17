/**
 * 测试kubectl相关命令
 */

const {execSync} = require('child_process');

const podname = process.env.podname
const namespace = process.env.namespace
const command = 'ls -l';
const output = execSync(`kubectl exec -it ${podname} -n ${namespace} -- ${command}`, {encoding: 'utf8'});

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

console.log(lsToJson(output));