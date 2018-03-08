
'use strict';
var msg = {
    updateGoodsList: function(param) {

        var a = "商品审核通过";
        var b = "商品审核不通过";
        var name = param.name;
        var status = param.status;
        var reserve5 = param.reserve5;
        var title = status === 3 ? a : b;
        var sellerlist = seller.getStoreArray();
        var sendname = sellerlist[param.storeid];
        var detailbody = JSON.stringify(param);

        param.id = -1;
        param.type = 5;
        param.title = title;
        param.sendname = sendname;
        param.detailbody = detailbody;
        utils.sendNotice(param);
    },

    destoryGoodslist: function(param) {

        var title = "商品被删除";
        var name = param.name;
        var status = param.status;
        var reserve5 = param.reserve5;
        var sellerlist = seller.getStoreArray();
        var sendname = sellerlist[param.storeid];
        var detailbody = "商品" + name + "，" + "编号" + param.sku + "被平台删除了。";

        param.id = -1;
        param.type = 0;
        param.title = title;
        param.sendname = sendname;
        param.detailbody = detailbody;
        utils.sendNotice(param);
    },

    sendHorizontalAlliances: function(param) {

        var detailbody = "";
        var title = "异业联盟申请";
        var id = param.meid;
        var name = param.name;
        var rid = param.operatorno;
        var storeid = param.storeid;
        var sellerlist = seller.getStoreArray();
        var rname = sellerlist[param.operatorno];
        var sendname = sellerlist[param.storeid];
 
        //构造消息
        var obj = {};
        obj.sendname = sendname;
        detailbody = JSON.stringify(obj);

        param.id = id;
        param.type = 1;
        param.rid = rid;
        param.storeid = rid;
        param.title = title;
        param.rname = rname;
        param.sendname = sendname;
        param.detailbody = detailbody;
        utils.sendHANotice(param);
    },
    userPay: function(param) {
        var title = "订单生成";
        var sellerlist = seller.getStoreArray();
        var rname = sellerlist[param.rid];
        //构造消息
        param.type = 4;
        param.rname = rname;
        param.title = title;
        utils.sendHANotice(param);
    },
    userApplyRefund: function(param) {
        var title = "退货/换货申请";
        var sellerlist = seller.getStoreArray();
        var rname = sellerlist[param.rid];
        //构造消息
        param.type = 4;
        param.rname = rname;
        param.title = title;
        utils.sendHANotice(param);
    },
}

module.exports = {
    notice:msg
};
