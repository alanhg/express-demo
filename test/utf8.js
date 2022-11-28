function stringToUint8Array(str) {
  const arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }

  const tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}


const res = {
  message: '123',
  error: 'some wrong'
}
if ('error' in res) {
  console.log('Class: , Function: , Line 17, Param: ', res);
} else {
  console.log('Class: , Function: , Line 18, Param: ', res);
}
