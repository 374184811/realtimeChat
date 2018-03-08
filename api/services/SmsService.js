/**
 * Created by Administrator on 2016/12/22.
 */
var crypto=require("crypto");
module.exports = {
    config:{
        accountSid:"aaf98f894f4fbec2014f6dab7cfb1481",
        authToken:'35b9d4dd130547f6bc4e51732691bfb0',
        appId:"aaf98f89544cd9d901545b9b05fd118f",
        host:"app.cloopen.com",
        port:8883,
    },

    httpServer: function (Moptions, contents, next) {
        var content=contents;
        var options = {
            host: Moptions.hostname,
            path: Moptions.path,
            port: Moptions.port,
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length':Buffer.byteLength(content,"utf8"),
                'Authorization':Moptions.auth
            }
        };
        common.secureServer(options,content,next);
    },
    /**
     *
     * @param next
     * @param receiver 短信接收端手机号码集合，用英文逗号分开，每批发送的手机号数量不得超过200个
     * @param templateId 模板Id
     * @param datas 内容数据外层节点，模板如果没有变量，此参数可不传
     * @param data 内容数据，用于替换模板中{序号}
     */
    sendSms:function (next,receiver,templateId,datas,data) {
        var _this=this;
        var contents={
            to:receiver,
            appId:_this.config.appId,
            templateId:templateId,
            datas:datas,
            data:data
        };
        var md5=crypto.createHash("md5");
        var t=(new Date()).Format("yyyyMMddhhmmss");

        var str=this.config.accountSid+this.config.authToken+t;

        var sign=md5.update(str).digest("hex").toUpperCase();

        var auth= (new Buffer(_this.config.accountSid+":"+t)).toString("base64");

        var options={
            hostname:_this.config.host,
            path:'/2013-12-26/Accounts/'+_this.config.accountSid+'/SMS/TemplateSMS?sig='+sign,
            auth:auth,
            port:_this.config.port
        };
        var requestBody=JSON.stringify(contents);
        this.httpServer(options,requestBody,next);
    },
    /**
     * 验证短信验证码是否有效
     * @param usermobile 手机号码
     * @param mobilecode  验证码
     */
    validSmsCode:function(res,usermobile,mobilecode,cb){
        var myRedis = redis.client({db: 7});
        var key = 'smscode:'+ usermobile;
        myRedis.get(key, function(err, value) {
            if(err){
                console.log(err);
                cb(err,JSON.stringify({msgCode:500,msg:'redis报错'}));
            }
            if (value){
                console.log('-----验证验证码开始------');
                console.log("mobilecode ==>>> ",mobilecode);
                console.log("value ==>>> ",value);
                console.log('-----验证验证码结束------');
                if(value == mobilecode){
                    cb(null,JSON.stringify({success:true,code:0,msg:'验证码正确'}));
                }else{
                    cb(null,JSON.stringify({success:false,code:4000,msg:'验证码不正确'}));
                }
            }else{
                cb(null,JSON.stringify({success:false,code:4001,msg:'验证码不存在'}));
            }
        });
    },
    /**
     * 商品退货信息短信
     * @param msg 信息短信
     * @param receiver  接收人名
     * @param address  地址
     */
    textMsg: function (msg, receiver, address) {
        UserMsgprototype.sendMsg(msg, SmsService.sendSms(function (err,dat) {
            //console.log(dat);
            if (err) {
                console.log("textMsg: check it out: ", err);
                return;
            }
        },msg.receiver,196632,[receiver, msg.receiver, address]));
    },

    createTable: function (tableName, next) {
        var createSql = "create table " + tableName + " like usermsg_1";
        var _this = this;
         Creator.query(createSql, function (err, val) {
        //     var showTable = "show create table usermsgprototype";
        //     _this.query(showTable, function (err, table) {
        //         var createTableStr = table[0]["Create Table"];
        //         var unionTables = /.*UNION=\((.*)\).*/i.exec(createTableStr);
        //         var unionTb = [];

        //         if (unionTables&&unionTables[1] != undefined) {
        //             unionTb = unionTables[1].split(",");
        //         }
        //         if (unionTb.indexOf("`" + tableName + "`") == -1) {
        //             unionTb.push(tableName);
        //         }
        //         var alterSql = "ALTER TABLE `usermsgprototype` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ");";
        //         console.log(alterSql);
        //         _this.query(alterSql, next);
        //     });

         });
    },
    createMsg: function (msg) {
        var tableName = "usermsg_0";
        var _this = this;
        // _this.query("show tables like '"+tableName+"'",function (err,tables) {
           //  if(err){
           //      next(err,{code:412,msg:"服务器错误"});
           //  }
        //     if(tables.length>0){
        //         insertData(msg,next);
           // }else{
                _this.createTable(tableName, function (err, record) {
                    console.log(msg);
                    //insertData(msg,next);
                });
            //}

        //});
        function insertData(msg,next){
            var keys = [], values = [];

            for (key in msg) {
                keys.push(key);
                values.push("'" + msg[key] + "'");
            }

            var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
            _this.query(sql, next);
        }
    }
}
