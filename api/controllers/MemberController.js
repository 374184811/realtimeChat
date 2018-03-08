var Passwords = require('machinepack-passwords');
var crc = require('crc');
var jwt = require("jwt-simple");
var crypto = require("crypto");

/**
 * MemberController
 *
 * @description :: Server-side logic for managing members
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    testLogin: function (req, res) {
        var _this = this;
        var userName = req.param("userName", false);
        var pwd = req.param("password", false);
        var param = '{\\"loginType\\": \\"' + 0 + '\\",\\"userName\\": \\"' + userName + '\\",\\"password\\": \\"' + pwd + '\\"}';
        common.httpServer(param, "userLogin", function (err, server) {
            if (err) return res.json(err);
            var serverData = JSON.parse(server);
            console.log(serverData);
            if(serverData.msgCode==0){
                common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, code) {
                    var serverResult = JSON.parse(code);
                    Account.findOne({useralias: userName}).exec(function (err, account) {
                        if (err) return res.negotiate(err);
                        return res.json({
                            code:200,
                            data:serverResult
                        });
                        if (account.password1 != undefined) delete account.password1;
                        if (account.password2 != undefined) delete account.password2;
                        var token = utility.generateToken(account);
                        console.log(account);
                        _this.redisSet(serverResult.tokenId, token, account.id, function (err, red) {
                            _this.logUserlog(req, account, "userlogin");
                            return res.json({
                                "success": true,
                                "msgCode": 0,
                                "msg": "登录成功",
                                "result": {
                                    'tokenId': serverResult.tokenId,
                                    'userId': account.id,
                                    'userMobile': account.usermobile,
                                    'userAlias': account.useralias,
                                    'shop_name': account.shop_name,
                                    'bqlId': serverResult.userId,
                                }
                            });

                        });
                    });


                });
            }else{
                return res.json(serverData);
            }


        });
    },
    /**
     * `MemberController.sendSms()`
     */
    sendSms: function (req, res) {
        var mobile = req.param("userMobile");
        if (!validator.isMobile(mobile)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }
        var param = '{\\"userMobile\\": \\"' + mobile + '\\"}';

        common.httpServer( param, "sendSMS",  function (err, result) {
            console.log(result);
            if (result) {
                var ret=JSON.parse(result);
                if(ret.success){
                    console.log("消息发送成功");
                    return res.json(ret);
                }else if(ret.msgCode == 423){
                    return res.json(ret);
                }else if(ret.msgCode == 423){
                    return res.json(ret);
                }
            }
            return res.json({
                code: 400,
                msg: "操作失败"
            });
        });
    },


    /**
     * `MemberController.validSms()`
     */
    validSms: function (req, res) {
        var userMobile = req.param("userMobile", 0);
        var mobileCode = req.param("mobileCode", false);
        this.validSeverSmsCode(req, res, userMobile, mobileCode, function (serverData) {
            if (serverData.msgCode == 0) {
                serverData.code = 200;
                serverData.msg = "验证码正确";
            }
            return res.json(serverData);
        });

    },
    validSeverSmsCode: function (req, res, userMobile, mobileCode, callback) {
        common.validSmsCode(res,userMobile,mobileCode,function (err, server) {
            if (err) return res.negotiate(err);
            var serverData = JSON.parse(server);
            if (callback) {
                callback(serverData);
            } else {
                return res.json(serverData);
            }

        });
    },

    /**
     * 验证用户
     * `MemberController.validUser()`
     */
    validUser: function (req, res) {

        var type = req.param("validType", 0);
        var validInfo = req.param("validInfo", false);
        var validType = parseInt(type);
        console.log(validType + "|" + validInfo);
        if (!validInfo || [0, 1, 2].indexOf(validType) == -1) {
            return res.json({
                "success": false,
                "msgCode": 411,
                "msg": "操作失败，传入参数错误",
                "result": {}
            });
        }

        if (validType == 0 && !validator.isMobile(validInfo)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }
        if (validType == 2 && !validator.isEmail(validInfo)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的邮箱",
                "result": {}
            });
        }
        var condition = {};
        if (validType == 0) {
            condition = {usermobile: validInfo};
        } else if (validType == 1) {
            condition = {useralias: validInfo};
        } else if (validType == 2) {
            condition = {useremail: validInfo};
        }
        var param = '{\\"validType\\": \\"' + validType + '\\",\\"validInfo\\": \\"' + validInfo + '\\"}';
        var _this = this;
        common.httpServer(param, "validUser", function (err, server) {
            if (err) return res.json(err);
            var serverData = JSON.parse(server);

            if (serverData.msgCode != undefined && serverData.msgCode == 413) {
                common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, decode) {
                    var serverResult = JSON.parse(decode);
                    Account.findOne(condition).exec(function (err, account) {
                        if (err) return res.negotiate(err);
                        if (account == undefined) {
                            var member = {
                                usermobile: serverResult.userMobile,
                                useralias: serverResult.userAlias,
                                userbqlid:serverResult.userid,
                            };
                            _this.addMember(req, res, member, "123456", function (err, record) {
                                if (err) return res.negotiate(err);
                                return res.json({
                                    "success": true,
                                    "msgCode": 413,
                                    "msg": "用户已存在",
                                    "result": {}
                                });
                            });
                        } else {
                            return res.json({
                                "success": true,
                                "msgCode": 413,
                                "msg": "用户已存在",
                                "result": {}
                            });
                        }
                    });

                });

            } else {
                return res.json(serverData);
            }
        });
    },


    /**
     * 用户注册
     * `MemberController.regUser()`
     */
    regUser: function (req, res) {
        console.log(req.path,req.allParams());
        var userAlias = req.param("userAlias", false);
        var userMobile = req.param("userMobile", false);
        var password = req.param("password", false);
        var mobileCode = req.param("mobileCode", false);
        var platform = req.param("platform", "App store");
        var deviceinfo = req.param("deviceinfo", "ios");

        if (!userMobile || !password || !mobileCode) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }
        var _this = this;
        var retData = {};
        // var param = '{\\"userAlias\\": \\"darling_' + userMobile + '\\",\\"userMobile\\": \\"' + userMobile + '\\",\\"password\\": \\"' + password + '\\",\\"mobileCode\\": \\"' + mobileCode + '\\"}';
        var param = '{\\"userMobile\\": \\"' + userMobile + '\\",\\"password\\": \\"' + password + '\\",\\"mobileCode\\": \\"' + mobileCode + '\\"}';

        common.httpServer(param, "regUser", function (err, server) {
            if (err) return res.json(err);
            var serverData = JSON.parse(server);
            if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, decode) {
                    console.log(decode);
                    var serverResult = JSON.parse(decode);

                    var member = {
                        usermobile: serverResult.userMobile,
                        useralias: serverResult.userAlias,
                        deviceinfo:deviceinfo,
                        platform:platform,
                        money : 0,
                        userbqlid: 0,
                        statuscode: 1,
                        operatorno:4,
                        shop_name: "打令智能",
                        id:0
                    };
                    Account.findOne({usermobile:serverResult.userMobile}).exec(function(err,user){
                        if(err) return res.negotiate(err);
                        
                        _this.logUserlog(req, member, "reguser");
                        retData.success = true;
                        retData.msgCode = 0;
                        retData.msg = 'success';
                        retData.result = serverResult;
                        
                        if(user){
                            Account.destroy({usermobile:serverResult.userMobile}).exec(function(err1){
                                if(err1){
                                    console.log(err1);
                                    retData.success = false;
                                    retData.msgCode = 500;
                                    retData.msg = '服务器错误';
                                    retData.result = [];
                                    return res.json(retData);
                                }
                                return res.json(retData);
                            });
                        }else{
                            return res.json(retData);
                            // _this.addMember(req, res, member, password);
                        }
                    });
                });
            } else {
                return res.json(serverData);
            }
        });
    },
    /**
     * 运营商后台添加用户和合约金
     * @param userMobile int 手机号码
     * @param mobileCode int 手机验证码
     * @param money int 合约金
     * @param req
     * @param res
     */
    addUser:function(req,res){
        var mine=req.session.mine;
        
        var userMobile = req.param("userMobile", false);
        var mobileCode = req.param("mobileCode", false);
        var money = req.param("money", 0);
        if (!validator.isMobile(userMobile)) {
            return res.json({
                "success": false,
                "msgCode": 400,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }

        if (!userMobile || !mobileCode) {
            return res.json({
                "success": false,
                "msgCode": 400,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }

        var _this = this;
        var storeid =mine.storeid;

        Accountseller.findOne({id: storeid}).exec(function (err, account) {
            var oldPwd = utility.generateMixed(6+Math.ceil(Math.random()*10)%3,false);
            var md5 = crypto.createHash("md5");
            var password = md5.update(oldPwd).digest("hex");

            var param = '{\\"userAlias\\": \\"darling_' + userMobile + '\\",\\"userMobile\\": \\"' + userMobile + '\\",\\"password\\": \\"' + password + '\\",\\"mobileCode\\": \\"' + mobileCode + '\\"}';

            _this.validSeverSmsCode(req, res, userMobile, mobileCode, function (msgData) {
                if (msgData.msgCode == 0) {
                    common.httpServer(param, "regUser", function (err, server) {
                        if (err) return res.json(err);
                        var serverData = JSON.parse(server);
                        if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                            common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, decode) {
                                var serverResult = JSON.parse(decode);
                               var shop_name="";
                                if(mine.shop_name){
                                    shop_name=mine.shop_name
                                }
                                var member = {
                                    usermobile: serverResult.userMobile,
                                    useralias: serverResult.userAlias,
                                    operatorno: storeid,
                                    money: money,
                                    shop_name:shop_name,
                                    platform:"后台添加"
                                };

                                Account.create(member).exec(function (err, record) {
                                    console.log("0000");
                                    if (err) return res.negotiate(err);
                                    if (record || record.length > 0) {
                                        _this.logUserlog(req, account, "reguser");
                                        SmsService.sendSms(function (err,dat) {
                                            console.log(dat);
                                            // return res.json({code: 200, msg: "操作成功"});
                                        },serverResult.userMobile,165261,[oldPwd+""]);
                                        return res.json({
                                            "success": true,
                                            "msgCode": 0,
                                            "msg": "success",
                                            "result": {
                                                "userId": record.id,
                                                "userMobile": record.usermobile,
                                                "userAlias": record.useralias
                                            }
                                        });
                                    } else {
                                        return res.json({
                                            "success": false,
                                            "msgCode": 400,
                                            "msg": "false",
                                            "result": {}
                                        });
                                    }
                                });
                            });
                        } else {
                            return res.json(serverData);
                        }
                    });
                } else {
                    return res.json(msgData);
                }

            });

        });
    },
    /**
     * 用户登录
     * `MemberController.userLogin()`
     */
    userLogin: function (req, res) {//req.session.user
        console.log(req.path,req.allParams());
        var _this = this;
        var loginType = req.param("loginType", 1);
        var userName = req.param("userName", false);
        var userid = req.param("userid", false);
        var pwd = req.param("password", false);
        var platform = req.param("platform", "App store");
        var deviceinfo = req.param("deviceinfo", "ios");
        console.log(loginType + "|" + userName + "|" + pwd);

        if (!userName || !pwd) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }
        if (loginType == 1 && !validator.isMobile(userName)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }
        conditions = {or: [{usermobile: userName}, {useralias: userName}]};

        var _this = this;
        var param = '{\\"loginType\\": \\"' + 0 + '\\",\\"userName\\": \\"' + userName + '\\",\\"password\\": \\"' + pwd + '\\"}';

        common.httpServer(param, "userLogin", function (err, server) {
            if (err) return res.json(err);
            var serverData = JSON.parse(server);
                console.log(serverData);
            if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, decode) {
                    var serverResult = JSON.parse(decode);
                    Account.findOne(conditions).exec(function (err, account) {
                        if (err) return res.negotiate(err);
                        if (account == undefined) {
                            var member = {
                                usermobile: serverResult.userMobile,
                                useralias: serverResult.userAlias,
                                userbqlid:serverResult.userid,
                                platform:platform,
                                deviceinfo:deviceinfo
                            };
                            _this.addMember(req, res, member, pwd, function (err, record) {
                                if (err) return res.negotiate(err);
                                localuserLogin(serverResult, record,1);
                            });
                        } else if (account.statuscode == 2) {
                            return res.json({
                                "success": false,
                                "msgCode": 400,
                                "msg": "用户已停用",
                                "result": {}
                            });
                        }else if (account.statuscode == 3) {
                            return res.json({
                                "success": false,
                                "msgCode": 401,
                                "msg": "该用户已被冻结",
                                "result": {}
                            });
                        } else {
                            localuserLogin(serverResult, account,0);
                        }
                    });
                });
            } else {
                return res.json(serverData);
            }
        });
        function localuserLogin(serverResult, account,isNewUser) {
            if (account.password1 != undefined) delete account.password1;
            if (account.password2 != undefined) delete account.password2;
            var token = utility.generateToken(account);

            var paypwd=false;
            if(account.psecret&&account.psecret.length>0){
                paypwd=true;
            };
            _this.redisSet(serverResult.tokenId, token, account.id, function (err, red) {
                _this.firstLogin(account,isNewUser);
                _this.logUserlog(req, account, "userlogin");
              
                return res.json({
                    "success": true,
                    "msgCode": 0,
                    "msg": "登录成功",
                    "result": {
                        'tokenId': serverResult.tokenId,
                        'userId': account.id,
                        'userMobile': account.usermobile,
                        'userAlias': account.useralias,
                        'shop_name': account.shop_name,
                        'nickName': account.nickname,
                        'sex': account.sex,
                        'birthday': account.birthday,
                        'bqlId': serverResult.userId,
                         paypwd:paypwd,
                         money:account.money,
                         userpic:account.userpic,
                         storeid:account.operatorno
                    }
                });
            });
        }
    },
    /**
     * 跳转第三方应用
     * `MemberController.userLoginbyApp()`
     */
    userLoginbyApp: function (req, res) {//req.session.user
        console.log(req.path,req.allParams());
        var _this = this;
        var loginType = req.param("loginType", 0);
        var userName = req.param("userName", false);
        var pwd = req.param("password", false);
        var userid = req.param("userid", false);
        var userAlias = req.param("userAlias", false);
        var tokenid = req.param("tokenId", false);
        var nickName = req.param("nickName", false);
        var userPic = req.param("userPic", false);
        var platform = req.param("platform", "App store");
        var deviceinfo = req.param("deviceinfo", "ios");
        var serverResult = {
            tokenId: tokenid,
            userId: userid,
        };
        console.log(loginType + "|" + userName + "|" + userid);

        if (!userName || !userid) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }
        if (!validator.isMobile(userName)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }

        conditions = {or: [{usermobile: userName}, {useralias: userName}]};

        Account.findOne(conditions).exec(function (err, account) {
            if (err) return res.negotiate(err);
            if (account == undefined) {
                var member = {
                    usermobile: userName,
                    useralias: userAlias,
                    userbqlid: userid,
                    nickname: nickName,
                    userpic: userPic,
                    platform: platform,
                    deviceinfo: deviceinfo
                };
                _this.addMember(req, res, member, pwd, function (err, record) {
                    if (err) return res.negotiate(err);
                    localuserLogin(serverResult, record,1);
                });
            } else if (account.statuscode == 2) {
                return res.json({
                    "success": false,
                    "msgCode": 400,
                    "msg": "用户已停用",
                    "result": {}
                });
            }else if (account.statuscode == 3) {
                return res.json({
                    "success": false,
                    "msgCode": 401,
                    "msg": "该用户已被冻结",
                    "result": {}
                });
            } else {
                localuserLogin(serverResult, account,0);
            }
        });

        function localuserLogin(serverResult, account,isNewUser) {
            if (account.password1 != undefined) delete account.password1;
            if (account.password2 != undefined) delete account.password2;
            var token = utility.generateToken(account);

            var paypwd=false;
            if(account.psecret&&account.psecret.length>0){
                paypwd=true;
            };
            _this.redisSet(serverResult.tokenId, token, account.id, function (err, red) {
                _this.firstLogin(account,isNewUser);
                _this.logUserlog(req, account, "userlogin");
              
                return res.json({
                    "success": true,
                    "msgCode": 0,
                    "msg": "登录成功",
                    "result": {
                        'tokenId': serverResult.tokenId,
                        'userId': account.id,
                        'userMobile': account.usermobile,
                        'userAlias': account.useralias,
                        'shop_name': account.shop_name,
                        'nickName': account.nickname,
                        'sex': account.sex,
                        'birthday': account.birthday,
                        'bqlId': serverResult.userId,
                         paypwd:paypwd,
                         money:account.money,
                         userpic:account.userpic,
                         storeid:account.operatorno
                    }
                });
            });
        }
    },
    /**
     * 第一次登陆进行的操作
     * @param account
     */
    firstLogin:function (account,isNewUser) {
        console.log(isNewUser);
        if(isNewUser){
            coupon.check({mobile:account.usermobile,id:account.id},function (ret) {
                console.log("-------------------------首次登陆领取优惠券----------------");
                console.log(ret);
                console.log("-------------------------首次登陆领取优惠券----------------");

            });
        }
    },
    registerUser:function (account,cb) {
        console.log("添加本地用户数据");
        account.createdAt=(new Date(account.createdAt)).Format("yyyy-MM-dd hh:mm:ss");
        coupon.find({storeid:account.operatorno,starttime:{"<":account.createdAt},endtime:{">":account.createdAt},createdAt:{"<":account.createdAt},isvalid:1,isdel:0,couponmode:3,sort:"createdAt DESC"}).exec(function (err,cps) {
            if(err) cb(err,null);
            console.log("发放新人券:",cps.length);
            async.mapSeries(cps,function (cp,next) {
                var sql="select count(*) as cnt from user_coupon where cid="+cp.id+" AND (user IS NOT NULL) UNION ALL select count(*) as cnt from user_coupon where cid="+cp.id+" AND uid="+account.id;
                UserCoupon.query(sql,function (err,cnt) {
                    if(err) next(err,null);

                    var grangTotal=cnt&&cnt[0]?cnt[0]["cnt"]:0; //已发放数量
                    var count=cnt&&cnt[1]?cnt[1]["cnt"]:0; //自己已领取数量
                    console.log(grangTotal,count);
                    if(grangTotal<cp.couponamount &&count<cp.limitnum){
                        var tmpCps=[];
                        var num=cp.limitnum-count;//优惠券还需要领取多少张
                        var total=cp.couponamount-grangTotal;//优惠券剩余多少张
                        var actual=Math.min(num,total);
                        for(var i=0;i<actual;i++){
                            var myCoupon={};
                            myCoupon.cid=cp.id;
                            myCoupon.uid=account.id;
                            myCoupon.user=account.usermobile;
                            myCoupon.type=cp.coupontype;
                            myCoupon.cmode=cp.couponmode;
                            myCoupon.cendtime=(new Date(cp.endtime)).Format("yyyy-MM-dd hh:mm:ss");
                            myCoupon.createdAt=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                            myCoupon.cmoney=cp.parvalue;
                            myCoupon.cname=cp.couponname;
                            myCoupon.status=0;
                            myCoupon.qcode=cp.picture;
                            tmpCps.push(myCoupon);

                        }
                        console.log('tmpCps --> ',tmpCps.length);
                        if(tmpCps.length>0){
                            UserCoupon.insertData(tmpCps,next);
                        }
                    }else{
                        next(null,{code:401,msg:"优惠券"});
                    }
                });
            },cb);
        })
    },
    addMember: function (req, res, member, password, callback) {
        var _this = this;
        member.money = 0;
        member.userbqlid = 0;
        member.statuscode = 1;
        member.operatorno = 4;
        member.shop_name = "打令智能";

        Account.create(member).exec(function (err, record) {
            if (err) return res.negotiate(err);
            if (record || record.length > 0) {
                _this.registerUser(record,function (err,ret) {
                    console.log(err,ret);
                    if (callback) {
                        callback(err, record);
                    } else {
                        return res.json({
                            "success": true,
                            "msgCode": 0,
                            "msg": "success",
                            "result": {
                                "userId": record.id,
                                "userMobile": record.usermobile,
                                "userAlias": record.useralias
                            }
                        });
                    }
                });
            } else {
                return res.json({
                    "success": false,
                    "msgCode": 400,
                    "msg": "false",
                    "result": {}
                });
            }
        });
    },
    userLogout: function (req, res) {
        var tokenId = req.param("tokenId");
        var mId = req.param("mId");
        var _this=this;
        if (!tokenId) {
            return res.json({
                code: 400,
                msg: "tokenId未传递"
            });
        }
        var client = redis.client({db: 2});
        console.log("====logout===");
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                client.del(mId + ":" + tokenId, function (err, val) {
                    req.session.user = null;
                    _this.logUserlog(req, member, "userlogout");
                    return res.json({
                        code: 200,
                        msg: "退出登录成功"
                    });
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });


    },

    /**
     * 获取用户信息
     * `MemberController.getUserInfo()`
     */
    getUserInfo: function (req, res) {

        var userId = req.param("userId", 0);
        var tokenId = req.param("tokenId", 0);
        var queryUserId = req.param("queryUserId", 0);
        var Mid = req.param("mId", 0);

        // console.log("+++++++++++++++++++++getUserInfo+++++++++++++++++++++++");
        // console.log(userId + "|" + tokenId + "|" + queryUserId);
        // console.log("+++++++++++++++++++++getUserInfo+++++++++++++++++++++++");
        var param = '{\\"userId\\": \\"' + userId + '\\",\\"tokenId\\": \\"' + tokenId + '\\",\\"queryUserId\\": \\"' + queryUserId + '\\"}';
        var _this = this;
        //console.log("hello");
        common.httpServer(param, "getUserInfo", function (err, server) {
            if (err) return res.json(err);
            var serverData = JSON.parse(server);

            if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, decode) {
                    var serverResult = JSON.parse(decode);
                    var member = utils.clone(serverResult);
                    member.statuscode = member.statuscode || 1;

                    var  bqlId=member.userid;
                    delete member.userid;
                    member.userbqlid=bqlId;

                    //console.log(member);
                    Account.findOne({usermobile: serverResult.userMobile}).exec(function (err, account) {
                        if (err) return res.negotiate(err);
                        if (account == undefined) {
                            _this.addMember(req, res, member, "123456", function (err, record) {
                                if (err) return res.negotiate(err);
                                member.money = 0;
                                member.userId=record[0].id;
                                member.bqlId=bqlId;
                                //console.log(member);
                                return res.json({
                                    "success": true,
                                    "msgCode": 0,
                                    "msg": "true",
                                    "result": member
                                });
                            });
                        } else {
                            console.log(member);
                            _this.updateLocalUserInfo({usermobile: serverResult.userMobile}, member, res, tokenId, false, function (err, record) {
                                member.tokenId = tokenId;
                                // console.log("-----------update------------");
                                // console.log(record);
                                // console.log("-----------update------------");
                                member.money = record[0].money;
                                member.userId=record[0].id;
                                member.bqlId=bqlId;
                              //  console.log(member);
                                return res.json({
                                    "success": true,
                                    "msgCode": 0,
                                    "msg": "true",
                                    "result": member
                                });

                            });
                        }
                    });

                });

            } else {
                //console.log("serverData. check it out. ",serverData);
                return res.json(serverData);
            }
        });
    },


    /**
     * 修改用户信息
     * `MemberController.updateUserInfo()`
     * nickName 用户昵称
     * realName 真实姓名
     * userPic 用户头像
     * birthday 生日
     * province 省
     * city 城市
     * area 地区
     * address 地址
     * strAddress 详细地址
     * statusCode 状态
     * userId 用户id
     * tokenId
     * updateUserId 更新用户的id
     */
    updateUserInfo: function (req, res) {
        console.log(req.ip,req.path,req.allParams());
        var set = {};
        set.nickname = req.param("nickName", 0);
        set.realname = req.param("realName", 0);
        set.userpic = req.param("userPic", 0);

        set.birthday = req.param("birthday", 0);
        set.province = req.param("province", 0);
        set.city = req.param("city", 0);
        set.area = req.param("area", 0);
        set.address = req.param("address", 0);
        set.straddress = req.param("strAddress", 0);

        userId = req.param("userId", 0);
        var tokenId = req.param("tokenId", 0);
        updateUserId = req.param("updateUserId", 0);
        var mId = req.param("mId", 0);
        var conditions = {};
        for (i in set) {
            if (set[i] != 0) {
                conditions[i] = set[i];
            }
        }
        set.sex = req.param("sex", 0);
        set.statuscode = req.param("statusCode", 1);

        var _this = this;
        var param = '{\\"nickName\\": \\"' + set.nickname + '\\",\\"realName\\": \\"' + set.realname +
            '\\",\\"userPic\\": \\"' + set.userpic + '\\",\\"sex\\": \\"' + set.sex +
            '\\",\\"birthday\\": \\"' + set.birthday + '\\",\\"province\\": \\"' + set.province +
            '\\",\\"city\\": \\"' + set.city + '\\",\\"area\\": \\"' + set.area +
            '\\",\\"userId\\": \\"' + userId + '\\",\\"tokenId\\": \\"' + tokenId +
            '\\",\\"updateUserId\\": \\"' + updateUserId + '\\",\\"address\\": \\"' + set.address +
            '\\",\\"strAddress\\": \\"' + set.straddress + '\\",\\"statuscode\\": \\"' + set.statuscode + '\\"}';
        common.httpServer(param, "updateUserInfo", function (err, server) {
            if (err) return res.json(err);
            if (!server) {
                return res.json({
                    code: 400,
                    msg: "服务器错误"
                });
            }
            var serverData = JSON.parse(server);
            console.log(serverData);
            if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                if (userId == updateUserId) {//修改自己
                    _this.redisGet(tokenId, mId, function (err, value) {
                        if (err) return res.negotiate(err);
                        var member = utility.decodeToken(value);
                        console.log("member:", member);
                        if (updateUserId == userId) {
                            common.decryptTokenKey(serverData.result, common.config.secretKey, function (err, decode) {
                                if (err) return res.negotiate(err);
                                var serverResult = JSON.parse(decode);
                                set.userbqlid=serverResult.userid;
                                set.statuscode=1;
                                updateUserInfo(member.id, set, serverResult.tokenId);
                            });

                        } else {
                            res.json({
                                "success": false,
                                "msgCode": 411,
                                "msg": "操作失败，传入参数错误",
                                "result": {}
                            });
                        }
                    });
                } else { //修改

                    return res.json({
                        "success": false,
                        "msgCode": 411,
                        "msg": "操作失败，传入参数错误",
                        "result": {}
                    });
                }

            } else {
                return res.json(serverData);
            }

        });


        function updateUserInfo(userId, set, tokenId) {
            for (key in set) {
                if (set[key] == 0) {
                    delete set[key];
                }
            }
            console.log("userinfo:", userId, set, tokenId);
            _this.updateLocalUserInfo({id: userId}, set, res, tokenId, true);
        }

    },
    updateLocalUserInfo: function (where, set, res, tokenId, saved, callback) {
        var _this = this;
        Account.update(where, set).exec(function (err, accounts) {
            if (err) return res.negotiate(err);
            if (callback) {
                callback(err, accounts);
            } else {
                console.log(where, set, accounts);
                if (accounts.length > 0) {
                    if (saved) {
                        var record = accounts[0];
                        delete record.password1;
                        delete record.password2;
                        var source = utility.generateToken(record);
                        _this.redisSet(tokenId, source, record.id, function (err, code) {
                            return res.json({
                                "success": true,
                                "msgCode": 0,
                                "msg": "success",
                                "result": {
                                    "tokenId": tokenId
                                }
                            });
                        });
                    } else {
                        return res.json({
                            "success": true,
                            "msgCode": 0,
                            "msg": "success",
                            "result": {
                                "tokenId": tokenId
                            }
                        });
                    }
                } else {
                    return res.json({
                        "success": false,
                        "msgCode": 100,
                        "msg": "false",
                        "result": {}
                    });
                }
            }
        });

    },

    /**
     * 修改用户密码
     * `MemberController.updateUserPwd()`
     */
    updateUserPwd: function (req, res) {

        var oldPwd = req.param("oldPwd", false);
        var newPwd = req.param("newPwd", false);
        var userId = req.param("userId", false);
        var tokenId = req.param("tokenId", false);
        if (!oldPwd || !newPwd) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }
        var _this = this;
        var param = '{\\"oldPwd\\": \\"' + oldPwd + '\\",\\"newPwd\\": \\"' + newPwd + '\\",\\"userId\\": \\"' + userId + '\\",\\"tokenId\\": \\"' + tokenId + '\\"}';
        console.log(param);
        common.httpServer(param, "updateUserPwd", function (err, server) {
            if (err) return res.json(err);
            var serverData = JSON.parse(server);
            return res.json(serverData);
        });
        /*       _this.redisGet(tokenId, function (err, value) {
         if (err) return res.negotiate(err);
         var member = utility.decodeToken(value);
         if (member) {
         var param = '{\\"oldPwd\\": \\"' + oldPwd + '\\",\\"newPwd\\": \\"' + newPwd + '\\",\\"userId\\": \\"' + userId + '\\",\\"tokenId\\": \\"' + tokenId + '\\"}';

         } else {
         return res.json({
         "success": false,
         "msgCode": 407,
         "msg": "用户未登录",
         "result": {}
         });
         }

         });*/
    },
    /**
     * 验证用户旧密码
     * @param oldPwd string 用户旧密码 必传
     * @param tokenId string 用户tokenId 必传
     * @param req
     * @param res
     */
    validUserPwd: function (req, res) {
        var oldPwd = req.param("oldPwd", false);
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        if (!tokenId || !oldPwd) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }

        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var user=ret.user;
                Account.findOne({id: user.id}).exec(function (err, account) {
                    if (err) return res.negotiate(err);
                    if (!account) {
                        return res.json({
                            "success": false,
                            "msgCode": 412,
                            "msg": "不存在的用户",
                            "result": {}
                        });

                    }
                    Passwords.checkPassword({
                        passwordAttempt: oldPwd,
                        encryptedPassword: account.password1,
                    }).exec({
                        error: function (err) {
                            return res.json({
                                "success": false,
                                "msgCode": 417,
                                "msg": "密码错误",
                                "result": {}
                            });

                        },
                        success: function () {
                            return res.json({
                                "success": true,
                                "msgCode": 0,
                                "msg": "success",
                                "result": []
                            });
                        }
                    });

                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });

    },

    /**
     * 重置密码
     * `MemberController.resetUserPwd()`
     */
    resetUserPwd: function (req, res) {
        var userMobile = req.param("userMobile", false);
        var password = req.param("password", false);
        var mobileCode = req.param("mobileCode", false);

        if (!userMobile || !password || !mobileCode) {
            return res.json({
                "success": false,
                "msgCode": 407,
                "msg": "参数解密错误，请检查传入参数",
                "result": {}
            });
        }
        var _this = this;
        var param = '{\\"userMobile\\": \\"' + userMobile + '\\",\\"password\\": \\"' + password + '\\",\\"mobileCode\\": \\"' + mobileCode + '\\"}';
        this.validSeverSmsCode(req, res, userMobile, mobileCode, function (msgData) {
            if (msgData.msgCode == 0) {
                common.httpServer( param, "resetUserPwd", function (err, server) {
                    if (err) return res.json(err);
                    var serverData = JSON.parse(server);
                    return res.json(serverData);
                });
            } else {
                return res.json(msgData);
            }
        });


    },

    getLoginUser: function (req, res) {
        var tokenId = req.param("tokenId", false);
        var userId = req.param("mId", false);

        if (!req.session.user && !tokenId) {
            return res.json({
                "success": false,
                "msgCode": 101,
                "msg": "用户已过期，请重新登录",
                "result": {}
            });
        } else {
            this.redisGet(tokenId, userId, function (err, tokenId) {
                if (!tokenId) {
                    return res.json({
                        "success": false,
                        "msgCode": 101,
                        "msg": "用户已过期，请重新登录",
                        "result": {}
                    });
                }
            });
        }
        return req.session.user;
    },
    redisSet: function (key, value, id, callback, expire) {
        if (!this.redisClient) {
            var client = this.redisClient = redis.client({db: 2});
        } else {
            var client = this.redisClient;
        }

        var prefix = id + ":";
        var newKey = prefix + key;
        client.keys(prefix + "*", function (err, keys) {
            console.log(keys);
            if(keys&&keys.length>0){
                client.del(keys, function (err, val) {

                    client.set(newKey, value, callback);
                });
            }else{
                client.set(newKey, value, callback);
            }

        });

    },
    redisGet: function (key, id, callback) {
        if (!this.redisClient) {
            var client = this.redisClient = redis.client({db: 2});
        } else {
            var client = this.redisClient;
        }

        var prefix = id + ":";
        var key = prefix + key;
        client.get(key, callback);
    },
    synUserInfo: function (req, res) {
        // var ip = req.ip.substring("::ffff:".length);
        var apiKey = req.param("apikey", false);
        var client = redis.client();
        client.get("synUserinfo." + apiKey, function (error, record) {
            if (error)  return res.negotiate(error);
            var date = new Date();
            var curYearMonth = date.getFullYear() + "-" + (date.getMonth() + 1) + "-";
            var curDate = curYearMonth + date.getDate();
            console.log(record);
            if (record && date.getTime() < record + 60 * 60 * 1000) {
                return res.json({
                    "success": false,
                    "msgCode": 100,
                    "msg": "操作太频繁，操作时间间隔1个小时",
                    "result": {}
                });
            }
            var synDate = req.param("synDate", false);
            if (!synDate) {
                var date = new Date();
                synDate = curDate + " 00:00:00";
            }
            if (synDate < curYearMonth + (date.getDate() - 3)) {
                synDate = curYearMonth + (date.getDate() - 3)
            }
            console.log(synDate);

            var sql = "select id as userId,usermobile,useralias,useremail,nickname,realname,userpic," +
                "sex,birthday,straddress,address,statuscode from account where createdAt>'"
                + synDate + "' order by createdAt DESC limit 1000 ";
            Account.query(sql, function (err, accounts) {
                if (err) return res.negotiate(err);
                if (accounts.length > 0) {
                    client.set("synUserinfo." + apiKey, date.getTime());
                    return res.json({
                        "success": true,
                        "msgCode": 0,
                        "msg": "success",
                        "result": accounts
                    });
                }
            });
        });

    },
    updatePwd: function (res, password, member, oldTokenId) {
        var _this = this;
        Passwords.encryptPassword({
            password: password,
            difficulty: 10,
        }).exec({
            error: function (err) {
                console.log("err:  When this error is returned, the encryption operation fails.");
                return res.negotiate(err);
            },
            success: function (encryptpassword) {
                set = {
                    password2: member.password1,
                    password1: encryptpassword,
                };
                Account.update({id: member.id}, set).exec(function (err, record) {
                    if (err) return res.negotiate(err);
                    delete record.password1;
                    delete record.password2;
                    if (record) {
                        return res.json({
                            "success": true,
                            "msgCode": 0,
                            "msg": "success",
                            "result": {}
                        });
                    } else {
                        return res.json({
                            "success": false,
                            "msgCode": 100,
                            "msg": "false",
                            "result": {}
                        });
                    }


                });
            }
        });
    },
    isLogin: function (req, res) {
        var tokenId = req.param("tokenId");
        var mId = req.param("mId");
        if (!tokenId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        this.redisGet(tokenId, mId, function (err, val) {
            if (err) return res.negotiate(err);
            if (val) {
                return res.json({
                    code: 200,
                    msg: "用户已经登录"
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "用户未登录"
                });
            }


        });

    },
    logUserlog: function (req, user, method) {

        function recordUserLog(req, user) {
            var loginfo = {};
            loginfo['ipaddress'] = utility.getClientIp(req);
            loginfo["userid"] = user.id;
            loginfo["username"] = user.usermobile;
            if (method == "userlogin") {
                loginfo["islogin"] = 1;
            } else if (method == "userlogout") {
                loginfo["islogin"] = 2;
            } else if (method == "reguser") {
                loginfo["islogin"] = 3;
            }
            loginfo['createdAt']=(new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
            Loguserlogin.createLog(loginfo,function userRegister(err, newUser) {

            });
        }

        recordUserLog(req, user);
    },
    /**
     * 同步用户
     * @param req
     * @param res
     */
    asyncUsers: function (req, res) {
        var _this = this;
        var apiKey = req.param("apikey", _this.config.apiKey);
        var date = (new Date()).Format("yyyy-mm-dd");

        var param = '{\\"synDate\\": \\"' + date + '\\"}';

        common.httpServer(param, "synUserInfo", function (err, server) {
            console.log(result);
            if (err) return res.json(err);
            var serverData = JSON.parse(server);
            if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                if (serverData.amount > 0) {
                    var users = server.data;
                    async.mapSeries(users, function (user, cb) {
                        Account.findOne({or: [{useralias: user.userAlias}, {usermobile: user.userMobile}]}).exec(function (err, record) {
                            if (err) cb(err, null);
                            if (!record) {
                                Account.create(user).exec(function (err, newUser) {
                                    if (err) cb(err, null);
                                    cb(null, newUser);
                                });
                            } else {
                                cb(null, record);
                            }

                        });
                    }, function (err, result) {
                        if (err) {
                            return res.json({
                                code: 400,
                                msg: "操作失败"
                            });
                        } else {
                            return res.json({
                                code: 200,
                                msg: "操作成功"
                            });
                        }
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: "操作失败"
                    })
                }
            } else {
                return res.json(serverData);
            }

        });

    },
    /**
     *获取用户的收货地址
     * @param req
     * @param res
     */
    getConsignee: function (req, res) {
        var tokenId = req.param("tokenId", false);
        var userId = req.param("mId", false);
        if (!tokenId || !userId) {
            return res.json({
                code: 400,
                msg: "tokenId或者mId未传递"
            });
        }

        this.redisGet(tokenId, userId, function (err, token) {
            if (err) return res.negotiate(err);

            if (!token) {
                return res.json({
                    code: 400,
                    msg: "没有登录"
                });
            } else {
                var member = utility.decodeToken(token);
                console.log(tokenId + "||" + userId);
                console.log(member);
                var sql = "select consignee from account where id=" + member.id;
                Account.query(sql, function (err, account) {
                    if (err) return res.negotiate(err);
                    return res.json({
                        code: 200,
                        data: account[0]["consignee"]
                    });
                })
            }

        })
    },
    /**
     * 添加收货地址
     * @param req
     * @param res
     */
    setConsignee: function (req, res) {
        var tokenId = req.param("tokenId", false);
        var consignee = req.param("consignee", "");
        var mId = req.param("mId", "");
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "tokenId或者mId未传递",

            });
        }
        this.redisGet(tokenId, mId, function (err, token) {
            if (err) return res.negotiate(err);

            if (!token) {
                return res.json({
                    code: 400,
                    msg: "没有登录"
                });
            } else {
                var member = utility.decodeToken(token);
                Account.update({id: member.id}, {consignee: consignee}).exec(function (err, account) {
                    if (err) return res.negotiate(err);
                    return res.json({
                        code: 200,
                        data: account[0]["consignee"]
                    });
                })
            }
        })
    },
    /**
     * @param mobileCode int 手机验证码
     * @param userMobile int 手机号码
     * @param secret int 密码
     * @param tokenId int tokenId
     * @param mId int  用户id
     * @param req
     * @param res
     */
    updateUserPayPwd: function (req, res) {
        var mobileCode = req.param("mobileCode", false);
        var userMobile = req.param("userMobile", false);
        var secret = req.param("secret", false);
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        var _this = this;
        this.validSeverSmsCode(req, res, userMobile, mobileCode, function (serverData) {
            console.log("++++++++++");
            console.log(serverData);
            console.log("++++++++++");
            // var serverData = JSON.parse(server);
            if (serverData.msgCode != undefined && serverData.msgCode == 0) {
                doUpdatePayPwd(tokenId, mId, secret)
            } else {
                return res.json(serverData);
            }
        });
        function doUpdatePayPwd(tokenId, mId, secret) {
            _this.redisGet(tokenId, mId, function (err, value) {
                if (err) return res.negotiate(err);
                if (!value) {
                    return res.json({
                        code: 400,
                        msg: "用户未登录，或登录已失效"
                    });
                }
                var member = utility.decodeToken(value);
                console.log(member);
                _this.setPaymentPassword(res, secret, member);
            });
        }
    },
    /**
     *oldPwd 旧密码
     * tokenId
     * mId 用户id
     * @param req
     * @param res
     */
    validPayPwd: function (req, res) {
        var oldPwd = req.param("oldPwd", false);
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        var _this = this;
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                Account.findOne({id: member.id}).exec(function (err, account) {
                    if (err) return res.negotiate(err);
                    if (account) {
                        Passwords.checkPassword({
                            passwordAttempt: oldPwd,
                            encryptedPassword: account.psecret,
                        }).exec({
                            error: function (err) {
                                return res.json({
                                    "success": false,
                                    "msgCode": 417,
                                    "msg": "原始支付密码错误",
                                    "result": {}
                                });

                            },
                            success: function () {
                                return res.json({
                                    code:200,
                                    msg:"密码正确"
                                });
                            }
                        });
                    } else {
                        return res.json({code: 400, msg: "该用户已不存在"});
                    }
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
        // _this.redisGet(tokenId, mId, function (err, value) {
        //     if (err) return res.negotiate(err);
        //     if (!value) {
        //         return res.json({
        //             code: 400,
        //             msg: "用户未登录，或登录已失效"
        //         });
        //     }
        //     var member = utility.decodeToken(value);
        //     console.log(member);
        //
        // });
    },
    /**
     * 修改支付密码
     * @param oldPwd string 原始支付密码
     * @param newPwd string 新支付密码
     * @param tokenId int tokenId
     * @param mId int  用户id
     * @param req
     * @param res
     */
    editPayPwd: function (req, res) {
    var oldPwd = req.param("oldPwd", false);
    var newPwd = req.param("newPwd", false);
    var tokenId = req.param("tokenId", false);
    var mId = req.param("mId", false);
    var _this = this;
        //getLoginUser: function (req, tokenId, mId, callback)
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                Account.findOne({id: member.id}).exec(function (err, account) {
                    if (err) return res.negotiate(err);
                    if (account) {
                        Passwords.checkPassword({
                            passwordAttempt: oldPwd,
                            encryptedPassword: account.psecret,
                        }).exec({
                            error: function (err) {
                                return res.json({
                                    "success": false,
                                    "msgCode": 417,
                                    "msg": "原始支付密码错误",
                                    "result": {}
                                });

                            },
                            success: function () {
                                _this.setPaymentPassword(res, newPwd, member);
                            }
                        });
                    } else {
                        return res.json({code: 400, msg: "该用户已不存在"});
                    }
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });

},
    IsSetPayPwd:function(req,res){
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        var _this = this;
        _this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            console.log(member);
            Account.findOne({id: member.id}).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    if(account.psecret){
                        return res.json({
                            code:200,
                            msg:"支付密码存在"
                        });
                    }else{
                        return res.json({
                            code:400,
                            msg:"支付密码存在"
                        });
                    }

                } else {
                    return res.json({code: 400, msg: "该用户已不存在"});
                }
            });
        });
    },
    setPaymentPassword: function (res, secret, member) {
        Passwords.encryptPassword({
            password: secret,
            difficulty: 10,
        }).exec({
            error: function (err) {
                console.log("err:  When this error is returned, the encryption operation fails.");
                return res.negotiate(err);
            },
            success: function (encryptpassword) {
                console.log(encryptpassword);
                Account.update({id: member.id}, {psecret: encryptpassword}).exec(function (err, account) {
                    if (err)return res.negotiate(err);
                    if (account.length > 0) {
                        return res.json({
                            code: 200,
                            msg: "修改成功"
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "操作失败"
                        });
                    }
                });
            }
        });
    },
    /**
     * 修改收藏列表
     * @param type int [1店铺，2商品]
     * @param items string  商铺id或者商品sku,逗号分隔
     * @param tokenId
     * @param mId
     * @param req
     * @param res
     * @constructor
     */
    setCollection: function (req, res) {
        var type = req.param("type", 0);
        var items = req.param("items", 0);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!type) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }

        this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            console.log(value);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            if (type == 1) {
                var set = {collection_shop: items};
            } else {
                var set = {collection_goods: items};
                 set.collection_goods=set.collection_goods?set.collection_goods:"";
            }

            Account.update({id: member.id}, set).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account.length > 0) {
                    return res.json({
                        code: 200,
                        msg: "操作成功"
                    });
                }
                return res.json({
                    code: 400,
                    msg: "操作失败"
                });
            });
        })

    },
    /**
     * 获取收藏
     * @param type int [1店铺，2商品]
     * @param items string  商铺id或者商品sku,逗号分隔
     * @param tokenId
     * @param limit int 每页显示数据量 非必传
     * @param page  int 页码  非必传
     *
     * @param mId
     * @param req
     * @param res
     */
    getCollection: function (req, res) {
        var type = req.param("type", 0);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var limit = req.param("limit", 0);
        var page = req.param("page", 1);
        if (!type) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        var offset = 0;
        if (limit) {
            offset = (page - 1) * limit;
        }
        this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            Account.findOne({id: member.id}).exec(function (err, me) {
                if (err) return res.negotiate(err);
                if (me) {
                    if (type == 1) {
                        if (me.collection_shop && me.collection_shop.length > 0) {
                            var shops = me.collection_shop.split(",");
                            shops= shops.filter(function (item) {
                                console.log(item);
                                if(item){
                                   return item;
                                }
                            });
                            var ishops = shops;

                            if (limit) {
                                console.log(shops, offset, limit + offset);
                                ishops = shops.slice(offset, parseInt(limit) + parseInt(offset));
                            }
                            console.log(ishops);
                            for(var i=0;i<ishops.length;i++){
                                if(isNaN(parseInt(ishops[i]))){
                                    ishops[i]=parseInt(ishops[i]);
                                }
                            }
                            Accountseller.find({id: ishops}).exec(function (err, sellers) {
                                if (err) return res.negotiate(err);
                                if (sellers.length > 0) {
                                    var merchants = [];

                                    sellers.forEach(function (seller) {
                                        merchants.push({
                                            id: seller.id,
                                            shop_name: seller.useralias,
                                            nickname: seller.nickname,
                                            realname: seller.realname,
                                            store_banner_pic: seller.store_banner_pic,
                                            store_show_pic: seller.store_show_pic,
                                            userpic: seller.userpic,
                                            id: seller.id,
                                        });
                                    });
                                    return res.json({
                                        code: 200,
                                        data: merchants
                                    });
                                } else {
                                    return res.json({
                                        code: 400,
                                        msg: "没有数据"
                                    });
                                }

                            })
                        } else {
                            return res.json({
                                code: 400,
                                msg: "操作失败,没有数据"
                            });
                        }

                    } else {
                        if (me.collection_goods && me.collection_goods.length > 0) {
                            var goods = me.collection_goods.split(",");
                            var igoods = goods;

                            if (limit) {
                                igoods = goods.slice(offset, parseInt(limit) + parseInt(offset));
                            }
                            console.log(igoods);
                            async.mapSeries(igoods, function (product, cb) {
                                var skuArray = product.split("-");
                                var storeid = skuArray[1]||0;
                                if(storeid){
                                    console.log(skuArray);

                                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                                    var gd = ["name","storeid","sku","imagedefault","price","id","createdAt",
                                    "type","deposit","premoneey","presaleendtime","presaleflow","presaleflowdescript",
                                    "presaledescript","precustomerserivice","presubtitle","storecategoryid"];

                                    var sql = "select " + gd.join(',') + " from " + tb_M_Name + " where sku='" + product + "' order by recommend asc,createdAt desc";
                                    console.log('sql. check it out. ',sql);
                                    Creator.query(sql, function (err, goods) {
                                        if (err) return res.negotiate(err);
                                        if (goods) {
                                            if (goods.length > 0) {
                                                cb(null, goods[0]);
                                            } else {
                                                cb(null, null);
                                            }
                                        }
                                    });
                                }else{
                                    cb(null, null);
                                }


                            }, function (err, result) {
                                if (err) return res.negotiate(err);
                                console.log(result);
                                if (result&&result.length > 0) {
                                    var items = [];
                                    result.forEach(function (item) {
                                        if (item != null) {
                                            items.push(item);
                                        }

                                    });
                                    if(items.length>0){
                                        return res.json({
                                            code: 200,
                                            data: items
                                        });
                                    }
                                }
                                return res.json({
                                    code: 400,
                                    msg: "没有数据"
                                });
                            });

                        } else {
                            return res.json({
                                code: 400,
                                msg: "操作失败,没有数据"
                            });
                        }
                    }

                } else {
                    return res.json({
                        code: 400,
                        msg: "操作失败,没有数据"
                    });
                }
            });
        });

    },
    /**
     * 添加收藏
     * @param type int [1店铺，2商品]
     * @param item string  商铺id或者商品sku
     * @param tokenId
     * @param mId 用户id int 必传
     * @param req
     * @param res
     */
    addCollection: function (req, res) {
        var item = req.param("item");
        var type = req.param("type");
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!type || !item) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            console.log(value);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            Account.findOne({id: member.id}).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    var set = {};
                    if (type == 1) {
                        var shopIds = [];

                        if (account.collection_shop) {
                            shopIds = account.collection_shop.split(",");
                        }
                        if (shopIds.indexOf(item) == -1) {
                            shopIds.push(item);
                        }
                        set = {collection_shop: shopIds.join(",")};
                    } else {
                        var goodsIds = [];

                        if (account.collection_goods) {
                            goodsIds = account.collection_goods.split(",");
                        }
                        console.log(goodsIds);
                        var skuArray=gcom.revertSku(item);
                        if(!skuArray.randomNum||!skuArray.storeid||!skuArray.timestamp){
                            return res.json({
                                code:400,
                                msg:"商品sku不符合规范"
                            });
                        }
                       var sku=skuArray.randomNum+"-"+skuArray.storeid+"-"+skuArray.timestamp;
                        if (goodsIds.indexOf(sku) == -1) {
                            goodsIds.push(sku);
                        }
                        set = {collection_goods: goodsIds.join(",")};
                    }
                    console.log("------------collection-------------");
                    console.log(set);
                    console.log("------------collection-------------");
                    Account.update({id: member.id}, set).exec(function (err, val) {
                        if (err) return res.negotiate(err);
                        if (val.length > 0) {
                            return res.json({
                                code: 200,
                                msg: "操作成功"
                            });
                        } else {
                            return res.json({
                                code: 400,
                                msg: "操作失败"
                            });
                        }
                    })
                } else {
                    return res.json({
                        code: 400,
                        msg: "操作不成功"
                    });
                }
            });
        })
    },
    /**
     * 删除收藏
     * @param type int [1店铺，2商品]
     * @param item string  商铺id或者商品sku
     * @param tokenId
     * @param mId 用户id int 必传
     * @param req
     * @param res
     */
    deleteCollection: function (req, res) {
        var item = req.param("item");
        var type = req.param("type");
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!type || !item) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        console.log(item);
        this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            console.log(value);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            Account.findOne({id: member.id}).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    var set = {};
                    if (type == 1) {
                        var shopIds = [];

                        if (account.collection_shop) {
                            shopIds = account.collection_shop.split(",");
                        }
                        var newShopIds = [];
                        shopIds.forEach(function (shopId) {
                            if (parseInt(shopId) != parseInt(item)) {
                                newShopIds.push(shopId);
                            }
                        });
                        set = {collection_shop: newShopIds.join(",")};
                    } else {
                        var goodsIds = [];

                        if (account.collection_goods) {
                            goodsIds = account.collection_goods.split(",");
                        }
                        var skuArray=gcom.revertSku(item);
                        if(!skuArray.randomNum||!skuArray.storeid||!skuArray.timestamp){
                            return res.json({
                                code:400,
                                msg:"商品sku不符合规范"
                            });
                        }
                        var sku=skuArray.randomNum+"-"+skuArray.storeid+"-"+skuArray.timestamp;
                        var newGoodsIds=[];
                        goodsIds.forEach(function (goodsId) {
                            if (goodsId != sku) {
                                newGoodsIds.push(goodsId);
                            }
                        });
                        set = {collection_goods: newGoodsIds.join(",")};
                    }
                    Account.update({id: member.id}, set).exec(function (err, val) {
                        if (err) return res.negotiate(err);
                        if (val.length > 0) {
                            return res.json({
                                code: 200,
                                msg: "操作成功"
                            });
                        } else {
                            return res.json({
                                code: 400,
                                msg: "操作失败"
                            });
                        }
                    })
                } else {
                    return res.json({
                        code: 400,
                        msg: "操作不成功"
                    });
                }
            });
        })
    },
    /**
     * 判断是否收藏
     * @param type int [1店铺，2商品]
     * @param item string  商铺id或者商品sku
     * @param tokenId
     * @param mId 用户id int 必传
     * @param req
     * @param res
     */
    hasCollection: function (req, res) {
        var item = req.param("item");
        var type = req.param("type");
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!type || !item) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            console.log(value);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            Account.findOne({id: member.id}).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    var IsCollection = false;
                    if (type == 1) {
                        var shopIds = [];

                        if (account.collection_shop) {
                            shopIds = account.collection_shop.split(",");
                        }

                        for(var i=0;i<shopIds.length;i++){
                            if (parseInt(shopIds[i]) == parseInt(item)) {
                                IsCollection = true;
                            }
                        }

                    } else {
                        var goodsIds = [];

                        if (account.collection_goods) {
                            goodsIds = account.collection_goods.split(",");
                        }
                        var skuArray=gcom.revertSku(item);
                        if(!skuArray.randomNum||!skuArray.storeid||!skuArray.timestamp){
                            return res.json({
                                code:400,
                                msg:"商品sku不符合规范"
                            });
                        }
                        var sku=skuArray.randomNum+"-"+skuArray.storeid+"-"+skuArray.timestamp;
                        for(var i=0;i<goodsIds.length;i++){
                            if (goodsIds[i] == sku) {
                                IsCollection = true;
                            }
                        }
                    }
                    var msg = IsCollection ? "已收藏" : "未收藏";
                    return res.json({
                        code: 200,
                        msg: "操作成功",
                        data: {
                            isCollection: IsCollection,
                            message: msg
                        }
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: "获取数据失败"
                    });
                }
            });
        })
    },
    /**
     * @param tokenId
     * @param mId 用户id int 必传
     * @param req
     * @param res
     */
    getCollectionCnt: function (req, res) {
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        this.redisGet(tokenId, mId, function (err, value) {
            if (err) return res.negotiate(err);
            console.log(value);
            if (!value) {
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
            var member = utility.decodeToken(value);
            Account.findOne({id: member.id}).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    var shopIds = [];
                    if (account.collection_shop) {
                        shopIds = account.collection_shop.split(",");
                    }
                    var goodsIds = [];
                    if (account.collection_goods) {
                        goodsIds = account.collection_goods.split(",");
                    }

                    return res.json({
                        code: 200,
                        msg: "",
                        data: {
                            goods_count: goodsIds.length,
                            shop_count: shopIds.length,
                        }
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: "操作不成功"
                    });
                }
            });
        })
    },


    /**
     * 游客登录
     * @param req
     * @param res
     */
    guestlogin: function (req, res) {
        var tokenId = "aaaabbbb";
        var id = 0;
        var account = {
            'tokenId': tokenId,
            'userId': 0,
            'userMobile': 12345678910,
            'userAlias': '',
            'shop_name': "打令智能",
            'nickName': "游客",
            'sex': "未知",
            'birthday': "未知",
            'bqlId': "未知",
            paypwd: "",
            storeid: 4,
            operatorno:4,
        };
        var token = utility.generateToken(account);
        this.redisSet(tokenId, token, id, function (err, red) {
            return res.json({
                "success": true,
                "msgCode": 0,
                "code": 200,
                "msg": "登录成功",
                "result": account
            });

        });
    }
};
