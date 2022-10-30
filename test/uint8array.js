/**
 * 字符串转uint8array的几个方法试验
 */

export function stringToUint8Array(str) {
  const arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.codePointAt(i));
  }
  const tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}

export function stringToUint8Array2(str) {
  var result = new Array();

  var k = 0;
  for (var i = 0; i < str.length; i++) {
    var j = encodeURI(str[i]);
    if (j.length == 1) {
      // 未转换的字符
      result[k++] = j.charCodeAt(0);
    } else {
      // 转换成%XX形式的字符
      var bytes = j.split("%");
      for (var l = 1; l < bytes.length; l++) {
        result[k++] = parseInt("0x" + bytes[l]);
      }
    }
  }

  const res = new Uint8Array(result);
  return res;
}

export function stringToUint8Array3(str) {
  return Uint8Array.from(str);
}

export function stringToUint8Array4(str) {
  return new TextEncoder().encode(str);
}

export function uint8Array2String(buffer) {
  return new TextDecoder().decode(buffer);
}
