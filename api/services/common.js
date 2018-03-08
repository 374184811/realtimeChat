/**
 * Created by Administrator on 2016/9/5.
 */
var http = require('http');
var https = require('https');
var querystring = require('querystring');
module.exports = {
    baseApiUrl: "http://sso.luckshow.cn/ssos/rest/ssoAPI",
    config: {
        // host:"sso.luckshow.cn",
        // path:"/ssos/rest/ssoAPI",
        // port:80,
        // apiKey: "CF293EC06A924C75B248400456BD06F3",
        // secretKey: "AFC5312ADEF44F64B93005C7F99BE552",
        host:sails.config.globals.unityhost,
        path:sails.config.globals.unitypath,
        port:sails.config.globals.unityport,
        apiKey:sails.config.globals.unityapiKey,
        secretKey:sails.config.globals.unitysecretKey,
    },
    /**
     * 加密method方法
     * @param method
     * @param cb
     */
    generateMethod: function (method, cb) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var strDay = day + '';
        var strMonth = (month+1) + '';
        if (strDay.length < 2) {
            strDay = '0' + strDay + '';
        }

        if (strMonth.length < 2) {
            strMonth = '0' + strMonth + '';
        }
        var content = year + '-' + strMonth + '-' + strDay + this.config.apiKey + method;
        console.log(content);
        this.generateTokenKey(content, this.config.secretKey, cb);
    },
    /**
     * 发送http请求
     * @param res
     * @param params
     * @param method
     * @param next
     */
    httpServer: function (params, method, next) {
        var _this = this;
        var http = require('http');
        var querystring = require('querystring');
        async.series({
            one: function (cb) {
                _this.generateTokenKey(params, _this.config.secretKey, cb);//加密params
            },
            two: function (cb) {
                _this.generateMethod(method, cb); //加密sign
            }
        }, function (err, encryptRes) {
            if (err) return next(err,"{\"code\":502,\"msg\":\"服务器错误\"}");
            if (!encryptRes.one || !encryptRes.two) {
                callback( null,JSON.stringify({
                    code: 400,
                    msg: "加密失败"
                }));
            }
            console.log(encryptRes);
            var contents = querystring.stringify({
                apikey: _this.config.apiKey,
                params: encryptRes.one,
                method: method
            });
            var options = {
                host: _this.config.host,
                path: _this.config.path,
                // port: 80,
                port: _this.config.port,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(contents),
                    'sign': encryptRes.two,

                }
            };
            _this.sendhttpRequest(options,contents,next);

        });
    },
    /**
     * 发送请求
     * @param req
     * @param res
     * @param params
     * @param method
     * @param execute
     * @param callback
     */
    sendRequest: function (req, res, params, method, execute, callback) {

        var _this = this;
        async.series({
            func: function (next) {
                if (execute) {
                    execute(next);
                } else {
                    next(null, {code: 200});
                }
            },
            server: function (next) {
                _this.httpServer(res, params, method, next);
            }

        }, function (err, result) {
            if (err) return res.serverError(err);
            //console.log(result);
            callback(result);
        });
    },
    validSmsCode:function (res,userMobile,mobileCode,callback) {
        console.log('validSeverSmsCode: userMobile: ', userMobile, ' mobileCode: ', mobileCode)
        if (!userMobile || !mobileCode) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }
        if (!validator.isMobile(userMobile)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }

        var params = {
            "userMobile": userMobile,
            "mobileCode": mobileCode
        };

        var param = JSON.stringify(params);
        console.log("验证短信");
        //res, params, method, next
        this.httpServer(param, "validSMS",callback);
    },
    /**
     * 加密请求体
     * @param content
     * @param key
     * @param callback
     */
    generateTokenKey: function (content, key, callback) {
        content = content.toString();
        var cmdStr = 'java -jar ./libjar/nd-crypto.jar -e "' + content + '"  ' + key + " |sed '1d'";
        this.ndCrypto(cmdStr, callback);
    },
    /**
     * 解密请求体
     * @param content
     * @param key
     * @param callback
     */
    decryptTokenKey: function (content, key, callback) {
        var cmdStr = 'java -Dfile.encoding=utf8  -jar ./libjar/nd-crypto.jar -d ' + content + ' ' + key + " |sed '1d'";
        this.ndCrypto(cmdStr, callback);
    },

    ndCrypto: function (cmdStr, callback) {
        var exec = require('child_process').exec;

        exec(cmdStr, function (err, stdout, stderr) {
            var code = "";
            if (stdout) {
                code = stdout.replace("\n", "");
            }
            callback(err, code);

        });
    },

    docxToHTML: function (filePath, savePath, callback) {
        var mammoth = require("mammoth");
        var exec = require('child_process').exec;
        exec("mammoth " + filePath + " " + savePath, function (err, stdout, stderr) {

            callback(err, stdout);
        });
    },
    /**
     * 获取已登录用户
     * @param req
     * @param tokenId 用户传入的tokenId
     * @param mId 用户id
     * @param callback
     */
    getLoginUser: function (req, tokenId, mId, callback) {

        var self = this;
        if (tokenId) {
            self.getUserByToken(tokenId, mId, callback);
        } else
        if (req.session.user) {
            var user = req.session.user;
            callback(null, {code: 200, user: user, msg: "ok"});
        } else {
            callback(null, {code: 401, msg: "用户未登录"});
        }

    },
    getUserByToken:function (tokenId, mId, callback) {
        var client = redis.client({db: 2});

        client.get(mId + ":" + tokenId, function (err, value) {
            if (err) return  callback(err, null);
            var user = utility.decodeToken(value);
            if (user) {
                callback(null, {code: 200, user: user});
            } else {
                callback(null, {code: 401, msg: "用户未登录"});
            }
        });
    },
    /**
     * 获取后台登陆用户
     * @param req
     * @param tokenId
     * @param mId
     * @param callback
     */
    getAdminUser: function (req, tokenId, mId, callback) {

        if (tokenId) {
            var client = redis.client({db: 3});
            client.get(mId + ":" + tokenId, function (err, user) {
                if (err) callback(err, null);

                if (user) {
                    callback(null, {code: 200, user: user});
                } else {
                    callback(null, {code: 401, msg: "用户未登录"});
                }
            });
        } else {
            callback(null, {code: 401, msg: "用户未登录"});
        }
    },
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    /**
     * 发送http请求
     * @param options
     * @param content
     * @param next
     */
    sendhttpRequest:function (options,content,next) {
        var request = http.request(options, function (response) {
            var body = "";
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('error', function (err) {
                console.log(err);
                next(err, null);
            });
            response.on("end", function () {
                console.log("body::" + body);
                if (body == null || body.length < 0) {
                    next(null, JSON.stringify({code: 400, msg: "请求失败"}));
                } else {
                    next(null, body);
                }
            });
        });
        request.write(content,"utf8");
        request.end();
    },
    secureServer:function (options,content,next) {
        console.log(options);

        var request = https.request(options, function (response) {
            var body = "";
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('error', function (err) {
                console.log(err);
                next(err, null);
            });
            response.on("end", function () {
                console.log("body::" + body);
                if (body == null || body.length < 0) {
                    next(null, JSON.stringify({code: 400, msg: "请求失败"}));
                } else {
                    next(null, body);
                }
            });
        });
        request.write(content,"utf8");
        request.end();
    },

    /**
     * 消息推送
     * @param alias string 用户别名组成的字符串 中间用,分割 例如dl_30,dl_58
     * @param title string 标题
     * @param content string 内容
     * @param callback
     */
    pushMessage:function (alias,title,content,extra,callback) {
        var JPush = require('jpush-sdk');
        var client = JPush.buildClient('e468733cc6c3f08033fc6535', '27b7c5d26f8486b093d26ed7');
        client.push().setPlatform(JPush.ALL).setAudience(JPush.alias(alias))
        .setNotification(title).setMessage(content,title,"text",extra).send(callback);
    }





}

