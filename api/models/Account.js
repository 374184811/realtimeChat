/**
 * Account.js
 * 用户（买家信息表）
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var Passwords = require('machinepack-passwords');
module.exports = {
    attributes: {
        //id 应用记录id

        userbqlid: {//保千里ID
            type: 'integer',
            size: 20
        },
        usermobile: {//手机
            type: 'string',
            size: 12,
            defaultsTo: '111-222-3333',
            unique: true
        },
        useralias: {//用户名
            type: 'string',
            size: 100,
            defaultsTo: '',
            unique: true
        },
        useremail: {//用户邮箱
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        password1: {//密码
            type: 'string',
            defaultsTo: ''
        },
        password2: {//密码
            type: 'string',
            defaultsTo: ''
        },
        nickname: {//用户昵称
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        realname: {//用户真名
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        userpic: {//用户头像
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        sex: {//性别 0男 1女 2保密
            type: 'integer',
            defaultsTo: 0
        },
        birthday: {//生日
            type: 'string',
            defaultsTo: ''
        },


        province: {//省
            type: 'string',
            size: 20,
            defaultsTo: ''
        },


        city: {//城市
            type: 'string',
            size: 50,
            defaultsTo: ''
        },


        area: {//地区
            type: 'string',
            size: 100,
            defaultsTo: ''
        },


        straddress: {//地址备注
            type: 'string',
            size: 200,
            defaultsTo: ''
        },

        deviceinfo: {//用户设备类型
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        address: {//用户地址
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        // 收货人信息 [elem1,elem2,elemN]   elem对象的属性：  收货人姓名,地区ID,地区名称,详细地址,电话,默认地址
        // elem1  {name:'zhangsan',regionid:56,regionname:'guangdong',address:'detail info',zipcode:'0755',mobile:'13005418988',isdefaut:1}
//"[{name:'zhangsan',regionid:56,regionname:'guangdong',address:'detail info',zipcode:'0755',mobile:'13005418988'},{name:'zhangsan',regionid:56,regionname:'guangdong',address:'detail info',zipcode:'0755',mobile:'13005418988'}]"
        consignee: {type: 'text', defaultsTo: ''},
        unfreeztime: {//解冻日期
            type: 'date',
            defaultsTo: new Date()
        },

        operatorno: {//运营商号码
            type: 'integer',
            defaultsTo: 0
        },
        money: {type: 'float', size: '15,4', required: true},//充值金额
        statuscode: {//状态 1 正常， 2 停用 ，3 冻结
            type: 'integer',
            defaultsTo: 0
        },
        shop_name: {
            type: "string",//用户所属商铺名称
            size: 20
        },
        psecret: {
            type: "string", //支付密码
            defaultsTo: ''
        },
        collection_shop:{ //收藏的店铺列表
            type:"string",
            defaultsTo: ''
        },
        collection_goods:{ //收藏的商品
            type:"string",
            defaultsTo: ''
        },
        platform:{ //用户app下载渠道
            type:"string",
            defaultsTo: ''
        },
        os:{ //用户操作系统
            type:"string",
            defaultsTo: ''
        },
        deviceToken:{ //苹果设备号
            type:"string",
            defaultsTo: ''
        }

    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
    /**
     *
     * @param tokenId 用户tokenId
     * @param userId 用户id
     * @param money  用户金额
     * @param callback
     */
    updateUserAmount: function (tokenId, userId, money, callback) {
        var _this = this;
         var client = redis.client({db: 2});
        // getLoginUser: function (req, tokenId, mId, callback)
        console.log(userId + ":" + tokenId);
        common.getUserByToken(tokenId, userId, function (err,ret) {
            console.log(ret);
            if (err||!ret||ret.code!=200){

                callback(err,{code:400,msg:"没有tokenId或用户id,用户未登录或登录失效"});
            }else{
                var member = ret.user;
                var sql = "update account set money=money-" + money + " where id=" + member.id + " AND money>=" + money;
                console.log(sql);
                _this.query(sql, function (err, record) {
                    if (err){
                        callback(err, {code: 400, msg: "操作失败,数据库错误"});
                        return ;
                    }
                    console.log("过程完成",record.changedRows);

                    if (record.changedRows > 0) {
                        console.log("更新成功");
                        Account.findOne({id: member.id}).exec(function (err, account) {

                            if (err){
                                callback(err, {code: 400, msg: "操作失败,数据库错误"});
                                return ;
                            }
                            newToken = utility.generateToken(account);
                            console.log("updateUserAmount:支付完成");
                            //console.log(newToken);
                            client.set(userId + ":" + tokenId, newToken, function (err, val) {
                                callback(err, account);
                            });
                        });
                    } else {
                        console.log(err,"updateUserAmount:支付失败,金额不足");
                        callback(err, {code: 412, msg: "支付失败,金额不足"});
                    }

                });
            }

        });
        // client.get(userId + ":" + tokenId, function (err, token) {
        //
        //     var member = utility.decodeToken(token);
        //     if (!err || !member) {
        //         console.log(err,"updateUserAmount:没有tokenId,用户未登录或登录失效");
        //         if (err) callback(err, {code: 400, msg: "没有tokenId,用户未登录或登录失效"});
        //         return ;
        //     }
        //
        // });
    },
    /**
     * 验证用户支付密码
     * @param tokenId 用户tokenid
     * @param userId  用户id
     * @param password 用户支付密码
     * @param callback 回调
     */
    validPayPassword: function (tokenId, userId, password, callback) {
        var _this = this;
        var client = redis.client({db: 2});
        client.get(userId + ":" + tokenId, function (err, token) {
            if (err) callback(err, {code: 401, msg: "打令精英平台正在调试中"});//操作失败,服务器错误
            var member = utility.decodeToken(token);
            if (!member) {
                console.log(err,"validPayPassword:登录时间过长或您的账号已在另一个设备登录");
                if (err) callback(err, {code: 402, msg: "登录时间过长或您的账号已在另一个设备登录"});//没有tokenId,用户未登录或登录失效
            }
            Account.findOne({id: member.id}).exec(function (err, account) {
                if (err) callback(err, {code: 403, msg: "打令精英平台正在调试中"});//数据库服务器错误
                if (!account) {
                    console.log(err,"validPayPassword:您的账户找不到");
                    callback(err, {code: 404, msg: "您的账户找不到"});//没有该用户
                } else {
                    if(!account.psecret||account.psecret.length<=0){
                        console.log(err,"validPayPassword:您的支付密码未设置");
                        callback(null,{code: 405, msg: "您的支付密码未设置"});
                    }else{
                        Passwords.checkPassword({
                            passwordAttempt: password,
                            encryptedPassword: account.psecret,
                        }).exec({
                            error: function (err) {
                                console.log(err,"validPayPassword:支付密码有误");
                                callback(err, {code: 406, msg: "您的密码输入有误"});//解密有误
                            },
                            success: function () {
                                console.log(err,"validPayPassword:支付密码正确");
                                callback(err, {code: 200, msg: "您的密码输入正确", data: account});//解密成功
                            }
                        });
                    }
                }

            });
        });


    }
};
/*

 */