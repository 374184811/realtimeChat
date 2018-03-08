module.exports = {
    //快递物流签收刷新订单
        // elem.payorder;
        // elem.refundrnumber;
        // elem.tablenameofitem;
        // elem.saleflag;
    updateOrderHasSign: function(traceList) {
        var orderinfo={};
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        dateInfo.setDate(dateInfo.getDate()+7);
        var timestr_7_after = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        dateInfo.setDate(dateInfo.getDate()+8);
        var timestr_15_after = dateInfo.Format("yyyy-MM-dd hh:mm:ss");

        orderinfo.is_cancel=1;
        orderinfo.finished_time=timestr;
        orderinfo.expire_refund_money=timestr_7_after;
        orderinfo.expire_refund_item=timestr_15_after;

        if (traceList.length>=1) {
            traceList.forEach(function(elem,key){
                if(elem.saleflag==0){
                    Ordermain.update({'ordernumber':elem.payorder},orderinfo).exec(function afterwards(err, updated){
                        console.log('updateOrderHasSign1: ',updated);
                        if (err) {return;}
                    }); 
                }else if(elem.saleflag==1){
                    //payorder deliverorder subtablename status | ordernumber refundrnumber
                    var querytext = 'update  '+elem.tablenameofitem+' set is_cancel= '+ orderinfo.is_cancel +
                    ' , finished_time=\''+ orderinfo.finished_time +
                    ' , expire_refund_money=\''+ orderinfo.expire_refund_money +
                    ' , expire_refund_item=\''+ orderinfo.expire_refund_item +
                    '   WHERE ordernumber=\''+elem.payorder+'\' and refundrnumber=\''+elem.refundrnumber+'\'';
                    console.log('updateOrderHasSign2:',querytext);
                    Ordermain.query(querytext, function(err, results) {
                        if (err) {console.log('updateOrderHasSign2:',err);}
                    });

                }else{
                    console.log('updateOrderHasSign3');
                }
 
            });
        };
    },
    //后台再次发货
    updateSaleAfterDeliverStore: function(ordernum,delivercode,subtablename,refundpayorder) {
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        var querytext = 'update  '+subtablename+' set refund_time5=\''+timestr+'\',is_delivery2= 1' +
                    ' , logisticsnumber=concat(logisticsnumber,\','+delivercode +
                    '\')   WHERE ordernumber=\''+ordernum+'\' and refundrnumber=\''+refundpayorder+'\'';
        console.log('updateOrderHasSign2:',querytext);
        Ordermain.query(querytext, function(err, schedulelist) {
            if(err){
                console.log('err',err);
            }
        });
        utility2.addScheduleOfTime(refundpayorder,subtablename,15,5);
                                    

    },
    //客户端填写售后物流单号状态
    updateSaleAfterDeliver: function(ordernum,delivercode,subtablename,refundpayorder) {
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        var querytext = 'update  '+subtablename+' set is_delivery= 1' +
                    ' , logisticsnumber=\''+ delivercode +
                    '\',createdAt=\''+ timestr +
                    '\'   WHERE ordernumber=\''+ordernum+'\' and refundrnumber=\''+refundpayorder+'\'';
                    console.log('updateOrderHasSign1:',querytext);

        Ordermain.query(querytext, function(err, schedulelist) {
            if(err){
                console.log('err',err);
            }
        });
        // data3['ordernumber']=data['ordernumber'];
        // data3['tablenameofitem']=data['tablenameofitem'];
        // data3['orderdetailid']=data['orderdetailid'];
        // data3['is_delivery']=1;
        // utility2.updateOrderItemRecordDelivery(data3);

    },
    // 更新订单为完成状态
    updateOrderHasFinished: function(ordernum,finishCode) {
        var orderinfo={};
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        orderinfo.is_urgent=finishCode;
        orderinfo.updatedAt=timestr;
        Ordermain.update({'ordernumber':ordernum},orderinfo).exec(function afterwards(err, updated){
            if (err) {
                console.log('orderinfo.err : ',err);
            }
            console.log('orderinfo.update : ',updated);
          
        });
    },
};
    //1111111111111111