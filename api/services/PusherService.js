/**
 * Created by Administrator on 2016/10/14.
 */
var http = require('http');
var querystring = require('querystring');
var crypto = require("crypto");
module.exports = {
    serverConfig: {
        accountSid:"aaf98f894f4fbec2014f6dab7cfb1481",
        authToken:"35b9d4dd130547f6bc4e51732691bfb0",
        AppID:"aaf98f89544cd9d901545b9b05fd118f",
        appToken:"1352f9337d4ce19edcc2c877ef8be888"
    },
    generateSig:function (timestamp) {
        var cmd5 = crypto.createHash("md5");
        var accountId=this.serverConfig.accountSid;
        var token=this.serverConfig.authToken;
        var str = accountId+token+timestamp;
        return cmd5.update(str,"utf8").digest("hex").toUpperCase();
    },
    generateAuth:function (timestamp) {
        var _this=this;
        var buffer=(new Buffer(_this.serverConfig.accountSid+":"+timestamp));
        return buffer.toString("base64");
    },
    httpServer: function (contents, next) {
        var _this=this;
        var content=contents;
        var timestamp=(new Date()).Format("yyyyMMddhhmmss");
        var sign=this.generateSig(timestamp);

        var auth=this.generateAuth(timestamp);
        console.log(timestamp,sign,auth);
        var options = {
            host: "app.cloopen.com",
            path: "/2013-12-26/Accounts/"+_this.serverConfig.accountSid+"/IM/PushMsg?sig="+sign,
            port: 8883,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF8',
                 Accept:'application/json',
                 'Content-Length':Buffer.byteLength(content,"utf8"),
                // 'Content-Length':256,
                'Authorization':auth
            }
        };
        console.log("--------------------------------------------");
        console.log(options, contents);
        console.log("--------------------------------------------");
        common.secureServer(options,content,next);
    },
    pushMessage:function (next,msg) {
        msg.appId = this.serverConfig.AppID;
         var encodeBody = JSON.stringify(msg);
        this.httpServer(encodeBody, next);
    }
}
