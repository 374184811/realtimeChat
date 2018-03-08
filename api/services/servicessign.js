module.exports = {
   createNonceStr: function () {
  return Math.random().toString(36).substr(2, 15);
},

 createTimestamp: function () {
  return parseInt(new Date().getTime() / 1000) + '';
},

 raw: function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
},

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
sign: function (jsapi_ticket, appID,access_token,urlstring) {
  var self=this;
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: self.createNonceStr(),
    timestamp: self.createTimestamp(),
    url: urlstring
  };
  var string = self.raw(ret);
      jsSHA = require('jssha');
      shaObj = new jsSHA(string, 'TEXT');

  ret.signature = shaObj.getHash('SHA-1', 'HEX');

    ret.appId=appID;
    ret.access_token=access_token;
console.log(ret);
  return ret;
}

}

