/**
 * 测试基于私钥导出公钥
 */
//
// const szStart = Buffer.from('rz\r**\x18B00000000000000\r');
// const szStart2 = Buffer.from('rz\r**B00000000000000\r');
// //
// // console.log(szStart.toString() === szStart2.toString());
// //
// // const BSON = require('bson');
// //
// // console.log(typeof BSON.serialize({a: 1, b: 'username'}));
// // console.log(BSON.deserialize(JSON.stringify({a: 1, b: 'username'})),);
//
// const moment = require('moment');
// const date = moment("2014-02-27T10:00:00").format('DD-MM-YYYY');
// console.log(date);

function handleLongRights(str) {
  const processRights = (item) => {
    return item.replace(/-/g, '');
  };
  return str.substring(1).match(/[a-z-]{3}/g).reduce((res, item, index) => {
    if (index === 0) {
      res.user = processRights(item);
    }
    if (index === 1) {
      res.group = processRights(item);
    }
    if (index === 2) {
      res.other = processRights(item);
    }
    return res;
  }, {
    user: '', group: '', other: ''
  });
}

const files = [{
  "Type": "l",
  "Name": "bin",
  "Size": 7,
  "ModifyTime": 1587627172,
  "AccessTime": 1663500641,
  "Owner": 0,
  "Group": 0,
  "Rights": "lrwxrwxrwx"
}, {
  "Type": "d",
  "Name": "boot",
  "Size": 4096,
  "ModifyTime": 1651058661,
  "AccessTime": 1663505550,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "cdrom",
  "Size": 4096,
  "ModifyTime": 1592378569,
  "AccessTime": 1649334671,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "data",
  "Size": 4096,
  "ModifyTime": 1643118383,
  "AccessTime": 1649334668,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "dev",
  "Size": 3940,
  "ModifyTime": 1663505546,
  "AccessTime": 1663505546,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "etc",
  "Size": 12288,
  "ModifyTime": 1663505552,
  "AccessTime": 1663505547,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "home",
  "Size": 4096,
  "ModifyTime": 1655983871,
  "AccessTime": 1663505655,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "l",
  "Name": "lib",
  "Size": 7,
  "ModifyTime": 1587627172,
  "AccessTime": 1663500641,
  "Owner": 0,
  "Group": 0,
  "Rights": "lrwxrwxrwx"
}, {
  "Type": "l",
  "Name": "lib32",
  "Size": 9,
  "ModifyTime": 1587627172,
  "AccessTime": 1663487831,
  "Owner": 0,
  "Group": 0,
  "Rights": "lrwxrwxrwx"
}, {
  "Type": "l",
  "Name": "lib64",
  "Size": 9,
  "ModifyTime": 1587627172,
  "AccessTime": 1663500641,
  "Owner": 0,
  "Group": 0,
  "Rights": "lrwxrwxrwx"
}, {
  "Type": "l",
  "Name": "libx32",
  "Size": 10,
  "ModifyTime": 1587627172,
  "AccessTime": 1663487831,
  "Owner": 0,
  "Group": 0,
  "Rights": "lrwxrwxrwx"
}, {
  "Type": "d",
  "Name": "lost+found",
  "Size": 16384,
  "ModifyTime": 1592378508,
  "AccessTime": 1592378508,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwx------"
}, {
  "Type": "d",
  "Name": "media",
  "Size": 4096,
  "ModifyTime": 1587627175,
  "AccessTime": 1649334671,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "mnt",
  "Size": 4096,
  "ModifyTime": 1587627175,
  "AccessTime": 1649334668,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "opt",
  "Size": 4096,
  "ModifyTime": 1655983961,
  "AccessTime": 1649334661,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "proc",
  "Size": 0,
  "ModifyTime": 1663505542,
  "AccessTime": 1663505542,
  "Owner": 0,
  "Group": 0,
  "Rights": "dr-xr-xr-x"
}, {
  "Type": "d",
  "Name": "root",
  "Size": 4096,
  "ModifyTime": 1651058944,
  "AccessTime": 1663311225,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwx------"
}, {
  "Type": "d",
  "Name": "run",
  "Size": 1120,
  "ModifyTime": 1663558406,
  "AccessTime": 1663505547,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "l",
  "Name": "sbin",
  "Size": 8,
  "ModifyTime": 1587627172,
  "AccessTime": 1663503421,
  "Owner": 0,
  "Group": 0,
  "Rights": "lrwxrwxrwx"
}, {
  "Type": "d",
  "Name": "srv",
  "Size": 4096,
  "ModifyTime": 1587627175,
  "AccessTime": 1649334667,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "sys",
  "Size": 0,
  "ModifyTime": 1663505543,
  "AccessTime": 1663505543,
  "Owner": 0,
  "Group": 0,
  "Rights": "dr-xr-xr-x"
}, {
  "Type": "d",
  "Name": "tmp",
  "Size": 4096,
  "ModifyTime": 1663554806,
  "AccessTime": 1663554395,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxrwxrwt"
}, {
  "Type": "d",
  "Name": "usr",
  "Size": 4096,
  "ModifyTime": 1587627242,
  "AccessTime": 1663487654,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}, {
  "Type": "d",
  "Name": "var",
  "Size": 4096,
  "ModifyTime": 1611021663,
  "AccessTime": 1651056717,
  "Owner": 0,
  "Group": 0,
  "Rights": "drwxr-xr-x"
}];
files.forEach(f => {
  console.log(handleLongRights(f.Rights));
})

// console.log(handleLongRights('drwxrwxrwt'));
