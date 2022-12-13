// const {Base64} = require('js-base64');
//
// let config = {username: 'root', host: '121.4.29.15'};
//
// console.log(Base64.isValid('123'));


function generatePassword() {
  var length = 20,
    charset =
      "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
    password = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

console.log(generatePassword());
