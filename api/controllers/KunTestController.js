/**
*
* test
*/
module.exports = {
    testUpload:function(req,res){
        upload.uploadFile(req,res,"pic","aftersalecert");
    },
    sockettest: function (req, res) {
        console.log('sockettest: This is the function entry.  check it out: ');

        SocketService.refundMsg("打令智能", "", "receiver", function(err, results){
             return res.json({
                code: 200,
                result:results,
            });
        });
    },

    createtest: function (req, res) {
        console.log('createtest: This is the function entry.  check it out: ');
        var msg = msg || {};
        msg.receiver = "18028798846";
        msg.rid = 110;
        msg.type = req.param("type", '0');
        msg.storeid = req.param("storeid", '0');
        msg.senderid = req.param("senderid", '0');
        msg.sendername = req.param("sendername", 'darling_msg');
        msg.status = req.param("status", '0');
        msg.title = req.param("title", '商品退货信息');
        msg.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        msg.updatedAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        

        SmsService.createMsg(msg);
    },

    userMsg: function (req, res) {
        console.log('userMsg: This is the function entry.  check it out: ');
        var msg = msg || {};
        var phone = req.param("phone", '18028798846');
        msg.receiver = phone;
        msg.rid = 110;
        msg.type = req.param("type", '0');
        msg.storeid = req.param("storeid", '0');
        msg.senderid = req.param("senderid", '0');
        msg.sendername = req.param("sendername", '');
        msg.status = req.param("status", '0');
        msg.title = req.param("title", '商品退货信息');
        msg.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        msg.updatedAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        
        var receiver = "叶宇林";
        var address = msg.content = "广东深圳市龙华新区大浪街道深圳市龙华新区大浪华昌路华富工业园6-9栋";
console.log(msg);
        SmsService.textMsg(msg, receiver, address);
        return res.json({
                code: 200
        });
    },
/*
【打令精英生活】请确保商品包装完好，商品无破损，在快递包裹中备注商品订单号，寄到以下地址：
叶宇林,
13005418952,
广东深圳市龙华新区大浪街道深圳市龙华新区大浪华昌路华富工业园6-9栋.
*/
userMsg2222: function (req, res) {
        console.log('userMsg2222: This is the function entry.  check it out: ');
        var msg = msg || {};
        var phone = req.param("phone", '18028798846');
        msg.receiver = phone;
        msg.rid = 110;
        msg.type = req.param("type", '0');
        msg.storeid = req.param("storeid", '0');
        msg.senderid = req.param("senderid", '0');
        msg.sendername = req.param("sendername", '');
        msg.status = req.param("status", '0');
        msg.title = req.param("title", '支2付尾款通知');
        msg.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        msg.updatedAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        var address = msg.content = " 保千里打令V10S 4G+64G 全景拍摄VR智能手机 ";

        SmsService.sendSms(function (err,dat) {
            if (err) {
                console.log("textMsg: check it out: ", err);
                return;
            }
            return res.json({
                code: 200,
                msg: 'done'
            });
        },msg.receiver,144195,[address])

    },
    couponMsg: function(req, res) {
        console.log('couponMsg: This is the function entry.  check it out: ');
        var param = param || {};
        //param.sid = req.param("sid", false);
        param.rid = req.param("rid", '4');
        param.title = req.param("title", '优惠劵审核通知');
        param.rname = req.param("rname", "打令智能");
        param.storeid = req.param("storeid", '4');
        //param.sendname = req.param("sendname", false);
        param.detailbody = '{"couponname":"好人卡","id":35,"isreview":1,"reviewreason":"废了"}';

        //console.log(param);
        utils.couponNotice(param);
        return res.json({
                code: 200,
                msg: 'done'
        });
    },

 
    pushMsg: function(req, res) {
        console.log('pushMsg: This is the function entry.  check it out: ');
        var extra = {
                    sign: 'sign',
                    sender: 'sender',
                    sendavatar: 'sendavatar'
        };
        var sendUsers="dl_1042";
        //console.log(sendUsers.join(","));
        common.pushMessage(sendUsers,"darling_msg",'content',extra,function (err, ret) {
            if (err) {
                console.log(' 提送通知失败 ');
            }else{
                console.log(' 提送通知成功 ');
            }
        });
        return res.json({
                code: 200,
                msg: 'done'
        });
    },


};
