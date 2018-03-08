var schedule = require("node-schedule");
module.exports = {
	arr: ['danhuang', 'jimi', 'teley'],
	isServerStart:false,
	mportalcategorydata:[],
	musergroupMin:[],
    mPingpp:null,
    mCrypto:null,
    mPingpp_aipIdArray:null,
    mPayLimit:null,
    mStoreIds:null,
    mJobObj:null,
    mOrderScheduleInfo:'0',
    mPubRedis:null,
    killList:[],
	getOrderMainTableId: function() {
        this.ordermainTableId+=1;
        var querytext = 'UPDATE platcounter set counterno='+this.ordermainTableId +' where id=1'
        Platcounter.query(querytext, function(err, results) {
            console.log(querytext);
            console.log(results);
        });
        return this.ordermainTableId;
	},

    initEmitter: function() {

        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        this.platformSchedule();
        var querytext = 'select * from bping ';
        var  data={};
        var self=this;

        Bping.query(querytext, function(err, results) {
            if(err){
                console.log(err);
            }else{
                for (var i = 0; i < results.length; i++) {
                    if(data[results[i]['storeid']]==null){
                        data[results[i]['storeid']]={};
                    }
                    data[results[i]['storeid']][results[i]['key1']] = results[i];
                };
                self.mPingpp_aipIdArray=data;
                //console.log(self.mPingpp_aipIdArray[4]['ios']['aipkey']);
            //    utility.mPingpp = require('pingpp')(self.mPingpp_aipIdArray[4]['ios']['aipkey']);
            //utility.mPingpp.setPrivateKeyPath("node_modules/pingpp/example/your_rsa_private_key.pem");
                //console.log(self.mPingpp_aipIdArray);
            }
            
        });

        var  data2={};
        var querytext2 = 'select * from paylimit ';
        Paylimit.query(querytext2, function(err, results) {
            if(err){
                console.log(err);
            }else{
                for (var i = 0; i < results.length; i++) {
                    if(data2[results[i]['sku']]==null){
                        data2[results[i]['sku']]={};
                    }
                    var sku =  results[i]['sku'].trim();
                    data2[sku] = results[i];
                };
                self.mPayLimit=data2;
                //console.log(data2);
                
            }
            
        });

        var querytext4='select  distinct(operatorno) from account';
        Ordermain.query(querytext4, function(err, results4) {
            //console.log(querytext4);
            //console.log(results4);
            self.mStoreIds=results4;
            if(err)console.log(err);
        });
        

        var tRandom=Math.floor(Math.random()*20);
        console.log('orderSerChannel tRandom:',tRandom);
        var nowDate = new Date().getTime()+1000*tRandom;
        var nowDate2 = new Date().setTime(nowDate);
        var timeStr = new Date(nowDate2).Format("yyyy-MM-dd hh:mm:ss");
        self.mPubRedis=redis.client({db:6});
    },
    updateBping: function() {
        var querytext = 'select * from bping ';
        var  data={};
        var self=this;
        Bping.query(querytext, function(err, results) {
            if(err){
                console.log(err);
            }else{
                for (var i = 0; i < results.length; i++) {
                    if(data[results[i]['storeid']]==null){
                        data[results[i]['storeid']]={};
                    }
                    data[results[i]['storeid']][results[i]['key1']] = results[i];
                };
                self.mPingpp_aipIdArray=data;
            }
        });
    },
    updatePaylimit: function() {
        var  data2={};
        var self=this;
        var querytext2 = 'select * from paylimit ';
        Paylimit.query(querytext2, function(err, results) {
            if(err){
                console.log(err);
            }else{
                for (var i = 0; i < results.length; i++) {
                    if(data2[results[i]['sku']]==null){
                        data2[results[i]['sku']]={};
                    }
                    var sku =  results[i]['sku'].trim();
                    data2[sku] = results[i];
                };
                self.mPayLimit=data2;
            }
        });
    },
    createPayment: function(orderData,client_ip,ispad, cb) {
        var extra = {};
        var channel='';
        console.log('createPayment ping ',orderData['paymentid']);
        switch (parseInt(orderData['paymentid']))
        {
            case 2:
                channel='alipay';
                break;
            case 3:
                if(ispad==1){
                    channel='alipay_pc_direct';
                    extra = {
                        //'new_version':true,
                        'success_url': sails.config.connections.alipaywap_success_pc_url
                        //'cancel_url': sails.config.connections.alipaywap_cancel_pc_url
                    }
                }else{
                    channel='alipay_wap';
                    extra = {
                        'new_version':true,
                        'success_url': sails.config.connections.alipaywap_success_url,
                        'cancel_url': sails.config.connections.alipaywap_cancel_url
                    }
                }

                break;
            case 4:
                channel='alipay_qr';
                break;
            case 5:
                channel='wx';
                break;
            case 6:
                channel='wx_pub_qr';//微信公众号扫码支付
                extra = {
                'product_id': orderData['ordernumber']      //REQUIRED 商品 ID，1-32 位字符串。此 id 为二维码中包含的商品 ID，商户自行维护
                //'open_id': 'open_id'        response-only, string
                };
                break;
            case 7:
                channel='wx_pub';
                extra = {
                'open_id': orderData['openid']// 用户在商户微信公众号下的唯一标识，获取方式可参考 wxPubOauth.js
                };
                break;
            case 8:
                channel='wx_wap';
                extra = {
                'open_id': 'open_id'// 用户在商户微信公众号下的唯一标识，获取方式可参考 wxPubOauth.js
                };
                break;
            case 9:
                channel='upacp';
                extra = {
                //  'result_url': 'http://www.darlinglive.com:1337/order/pingPayNotice'// 银联同步回调地址
                };
                break;
            case 10:
                channel='upacp_wap';
                // extra = {
                //   'result_url': 'http://dev.darlinglive.com/h5/darling/www?succeed=1'// 银联同步回调地址
                // };
                if(ispad==1){
                    extra = {
                        'result_url':sails.config.connections.upacpwap_result_pc_url
                    }
                }else{
                    extra = {
                        'result_url':sails.config.connections.upacpwap_result_url
                    }
                }
                break;
            case 11:
                channel='alipay_pc_direct';
                extra = {
                    'success_url': sails.config.connections.alipaywap_success_pc_url
                }
                break;
                
        }
        var pingxx_appid=1;
        //if(ispad==1){
        //    pingxx_appid=this.mPingpp_aipIdArray['4']['android']['aipid'];
        //}else{
        pingxx_appid=this.mPingpp_aipIdArray['4']['ios']['aipid'];
        //}



 
        console.log('pingxx_appid : ',pingxx_appid);
        var subjectName = orderData['itemNames'];
        if(subjectName.length>15){

            subjectName = subjectName.slice(0,15);
            console.log('subjectName ',subjectName);
        }
        var pTotal_amount=orderData['total_amount']*100;
    
        // if(orderData['mId']==58){
        //     channel='alipay_wap';
        //     extra = {
        //             'new_version':true,
        //         // success_url 和 cancel_url 在本地测试不要写 localhost ，请写 127.0.0.1。URL 后面不要加自定义参数
        //         'success_url': 'http://dev.darlinglive.com/wechat/darling/www/#/myOrder/0',
        //         'cancel_url': 'http://dev.darlinglive.com/wechat/darling/www/#/myOrder/0'
        //         };
        //     pingxx_appid=this.mPingpp_aipIdArray['5']['ios']['aipid'];
        // }
        if(orderData['mId']==52){
            //channel='alipay_qr';
            pTotal_amount=1;
        }

        console.log('pTotal_amount **************************************: ',pTotal_amount);
        console.log(
        {
            order_no:  orderData['ordernumber'],    // 推荐使用 8-20 位，要求数字或字母，不允许其他字符
            app:       {id: pingxx_appid},
            channel:   channel,                     // 支付使用的第三方支付渠道取值，请参考：https://www.pingxx.com/api#api-c-new
            amount:    pTotal_amount.toFixed(0),// 订单总金额, 人民币单位：分（如订单总金额为 1 元，此处请填 100）
            client_ip: client_ip,                   // 发起支付请求客户端的 IP 地址，格式为 IPV4，如: 127.0.0.1
            currency:  "cny",
            subject:   subjectName,
            body:      orderData['itemNames'],
            metadata:  orderData['metadata'],
            extra:     extra
        });
        utility.mPingpp.charges.create({
            order_no:  orderData['ordernumber'],    // 推荐使用 8-20 位，要求数字或字母，不允许其他字符
            app:       {id: pingxx_appid},
            channel:   channel,                     // 支付使用的第三方支付渠道取值，请参考：https://www.pingxx.com/api#api-c-new
            amount:    pTotal_amount.toFixed(0),// 订单总金额, 人民币单位：分（如订单总金额为 1 元，此处请填 100）
            client_ip: client_ip,                   // 发起支付请求客户端的 IP 地址，格式为 IPV4，如: 127.0.0.1
            currency:  "cny",
            subject:   subjectName,
            body:      orderData['itemNames'],
            metadata:  orderData['metadata'],
            extra:     extra
        }, cb);
    },

    adminRefundlog: function(reqdata, resdata,reqdata2){

        var querystring = require('querystring');
        var contents ='无',refuse='无';
        for (var i = 0; i < reqdata2.length; i++) {
            contents+=querystring.stringify(reqdata2[i]);
        };
        if(resdata['data']){
            contents+=querystring.stringify(resdata['data']);
        }
        contents=contents.replace(/"([^"]*)"/g, "$1");
        contents=contents.replace(/'/g, "");
        if(reqdata['refuse_reason']){
            refuse=reqdata['refuse_reason'];
        }

        
        refuse=refuse.replace(/"([^"]*)"/g, "$1");
        refuse=refuse.replace(/'/g, "");
        var querytext = 'insert into refundlog ( tablenameofitem,tablenameofitemid,ordernumber,status,refuse_reason,code,codeInfo,detailbody) value( \''+
            reqdata['tablenameofitem']+'\','+reqdata['id']+',\''+reqdata['ordernumber']+'\','+reqdata['status']+
            ',\''+refuse+'\','+resdata['code']+',\''+resdata['codeInfo']+'\',\''+contents+'\')';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if(err){
                console.log(err);
            }
        });


    },

    // isPingppp 是否是ping++ 的回调 用于处理预售退还尾款
    adminRefund: function(dataInfo,isPingppp, res) {
        console.log('utility2 adminRefund start');
        console.log(dataInfo);
        console.log('isPingppp  :',isPingppp);
        console.log('utility2 adminRefund end');
        var self = this;
        var retdata={'code':200,'codeInfo':'ok'};
        var refuse_reason = '无';
        if(dataInfo.refuse_reason){
            refuse_reason=dataInfo.refuse_reason;
        }
        var smsInfoList = new Array();
        smsInfoList.push(dataInfo.ordernumber);

        var querytext    = 'SELECT a.* ,b.refundrnumber ,b.is_refund ,b.refund_num,b.pre_price,b.refund_type,b.discount_price,b.buy_price,b.buy_num,b.refund_amount from ordermain as a , '+
        dataInfo.tablenameofitem +' as b where a.ordernumber=\''+ dataInfo.ordernumber +'\' and b.ordernumber=a.ordernumber   and b.id='+dataInfo.id+' limit 1';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            var refundData2=results;
            if(err){
                retdata['code']=4000;
                retdata['codeInfo']='主订单不存在';
                self.adminRefundlog(dataInfo,retdata,refundData2);
                
                if(isPingppp==1){
                    console.log('refund final payment error 1');
                    console.log(err);
                }else{
                    return res.json(retdata);
                }
            }
            if(results.length==0){
                retdata['code']=4010;
                retdata['codeInfo']='主订单不存在';
                self.adminRefundlog(dataInfo,retdata,refundData2);
                
                if(isPingppp==1){
                    console.log('refund final payment error 2');
                }else{
                    return res.json(retdata);
                }
            }
            var dateInfoTime = new Date();
            var timestr = dateInfoTime.Format("yyyy-MM-dd hh:mm:ss");
            if(dataInfo.status==1){
                if(results[0]['refund_type']==2||results[0]['refund_type']==3){

                    if (results.length==1 &&results[0]['is_refund']>=1&&results[0]['is_refund']!=5&&results[0]['is_refund']!=6&&results[0]['is_refund']!=7) {
                        console.log(results);
                        if (results[0]['paymentid']!=1) {
                            var chargeid=results[0]['chargeid'];
                            var amount = 0; var metadata={};
                            if(results[0]['ordertype']==0){
                                amount=results[0]['refund_amount']*100;
                                console.log('amount11 ',amount);
                                metadata={tablenameofitem:dataInfo.tablenameofitem,ordernumber:dataInfo.ordernumber,ordertype:0,orderitemid:dataInfo.id};
                            }else{
                                if(isPingppp==1){
                                    chargeid=results[0]['chargeid2'];
                                    amount=results[0]['refund_num']*(results[0]['buy_price']-results[0]['pre_price'])*100;
                                    console.log('amount22 ',amount);
                                    metadata={tablenameofitem:dataInfo.tablenameofitem,ordernumber:dataInfo.ordernumber,ordertype:13,orderitemid:dataInfo.id};
                                }else{
                                    amount=results[0]['refund_num']*results[0]['pre_price']*100;
                                    console.log('amount33 ',amount);
                                    metadata={tablenameofitem:dataInfo.tablenameofitem,ordernumber:dataInfo.ordernumber,ordertype:11,orderitemid:dataInfo.id};
                                }
                            }

                            console.log('amount44 ',amount.toFixed(0));
                            var pingRefundData={};
                            if (isPingppp==1) {
                                if(results[0]['paymentid2']>=5 && results[0]['paymentid2']<=8 ){
                                    pingRefundData.metadata=metadata;
                                    pingRefundData.amount=amount.toFixed(0);
                                    pingRefundData.description=refuse_reason;
                                    pingRefundData.funding_source=sails.config.connections.admin_refund_type;// unsettled_funds
                                }else{
                                    pingRefundData.metadata=metadata;
                                    pingRefundData.amount=amount.toFixed(0);
                                    pingRefundData.description=refuse_reason;
                                }
                            }else{
                                if(results[0]['paymentid']>=5 && results[0]['paymentid']<=8 ){
                                    pingRefundData.metadata=metadata;
                                    pingRefundData.amount=amount.toFixed(0);
                                    pingRefundData.description=refuse_reason;
                                    pingRefundData.funding_source=sails.config.connections.admin_refund_type;// unsettled_funds
                                }else{
                                    pingRefundData.metadata=metadata;
                                    pingRefundData.amount=amount.toFixed(0);
                                    pingRefundData.description=refuse_reason;
                                }
                            }
                            console.log('utility2 adminRefund start2');
                            console.log('chargeid :',chargeid);
                            console.log('utility2 adminRefund end2');
                            smsInfoList.push( pingRefundData.amount/100);
                            smsInfoList.push('1-7');
                            utility.mPingpp.charges.createRefund(
                                chargeid,
                                pingRefundData,
                                function(err, refund) {
                                    if(err){
                                        retdata['code']=4001;
                                        retdata['codeInfo']='error';
                                        retdata['data']=err;
                                        self.adminRefundlog(dataInfo,retdata,refundData2);
                                        
                                        if(isPingppp==1){
                                            console.log(err);
                                            console.log('refund final payment error 3');
                                        }else{
                                            return res.json(retdata);
                                        }
                                    }
                                    console.log(refund);


                                    if(refund['failure_code']==null&&refund['failure_msg']==null){
                                            
                                        var querytext66='select usermobile from account where id='+ results[0]['buyerid'];
                                        console.log(querytext66);
                                        Ordermain.query(querytext66, function(err, results66) {
                                            if(!err){
                                                var querytext77='select servicetelephone from accountseller where id='+ results[0]['storeid'];
                                                console.log(querytext77);
                                                Ordermain.query(querytext77, function(err, results77) {
                                                    if(!err){
                                                        smsInfoList.push(results77[0].servicetelephone);
                                                        SmsService.sendSms(function (err,dat) {
                                                            if (err) {
                                                                console.log("textMsg: check it out: ", err);
                                                                return;
                                                            }
                                                        },results66[0]['usermobile'],'211809',smsInfoList);
                                                    }
                                                });
                                            }
                                        });



                                        console.log('refund succeed true');
                                        retdata['data']=refund;
                                        self.adminRefundlog(dataInfo,retdata,refundData2);
                                        
                                        utility2.addScheduleOfTime(results[0]['refundrnumber'],dataInfo.tablenameofitem,7,2);
                                        if(isPingppp==1){
                                            console.log('refund final payment error 5');
                                        }else{
                                            var querytext33='update '+dataInfo.tablenameofitem+' set mer_agree2=2,refund_time3=\''+timestr+'\' ,is_refund=17 where id='+ dataInfo.id;

                                            console.log(querytext33);
                                            Ordermain.query(querytext33, function(err, results33) {

                                                console.log(querytext33);
                                                if(err){}
                                            });
                                            return res.json(retdata);
                                        }
                                    }else{
                                        retdata['code']=401;
                                        retdata['codeInfo']=refund["failure_msg"];
                                        retdata['data']=refund["failure_msg"];
                                        self.adminRefundlog(dataInfo,retdata,refundData2);
                                        
                                        if(isPingppp==1){
                                            console.log('refund final payment error 4');
                                        }else{
                                            return res.json(retdata);
                                        }

                                    }
                                }
                            );
                        }else{
                            //退合約金
                            smsInfoList.push( results[0]['refund_amount']);
                            smsInfoList.push('1-7');
                            var querytext66='select usermobile from account where id='+ results[0]['buyerid'];
                            console.log(querytext66);
                            Ordermain.query(querytext66, function(err, results66) {
                                if(!err){
                                    var querytext77='select servicetelephone from accountseller where id='+ results[0]['storeid'];
                                    console.log(querytext77);
                                    Ordermain.query(querytext77, function(err, results77) {
                                        if(!err){
                                            smsInfoList.push(results77[0].servicetelephone);
                                            SmsService.sendSms(function (err,dat) {
                                                if (err) {
                                                    console.log("textMsg: check it out: ", err);
                                                    return;
                                                }
                                            },results66[0]['usermobile'],'211809',smsInfoList);
                                        }
                                    });
                                }
                            });

                            var querytext3='update '+dataInfo.tablenameofitem+' set  refund_time3=\''+timestr+'\' ,mer_agree2=2, is_refund=5  where id='+ dataInfo.id;
                            var deltaMoney =results[0]['refund_amount'];
                            if(deltaMoney<0){deltaMoney=0;}
                            var querytext4='update account set money=money+'+deltaMoney+'  where id='+ results[0]['buyerid'];
                            console.log(querytext3);
                            console.log(querytext4);

                            utility2.addScheduleOfTime(results[0]['refundrnumber'],dataInfo.tablenameofitem,7,2);
                            Ordermain.query(querytext3, function(err, results) {
                                if(err){
                                    retdata['code']=402;
                                    retdata['data']=err;
                                    retdata['codeInfo']='退合約金';
                                    return res.json(retdata);
                                };
                                Account.query(querytext4, function(err, results) {
                                    if(err){
                                        retdata['code']=403;
                                        console.log(err);
                                        retdata['codeInfo']='退合約金';
                                        return res.json(retdata);
                                    };
                                    retdata['code']=200;
                                    retdata['codeInfo']='退合約金';
                                    return res.json(retdata);
                                });
                            });
                        }
                    }else{
                        if(results[0]['is_refund']==0){
                            retdata['code']=4002;
                            retdata['codeInfo']='请client先申请退款';
                        }else if(results[0]['is_refund']==5){
                            retdata['code']=4004;
                            retdata['codeInfo']='之前已经退款';
                        }
                        self.adminRefundlog(dataInfo,retdata,refundData2);
                        
                        if(isPingppp==1){
                            console.log('refund final payment error 6');
                        }else{
                            return res.json(retdata);
                        }
                    }
                }else if(results[0]['refund_type']==1){

                    refuse_reason=refuse_reason.replace(/"([^"]*)"/g, "$1");
                    refuse_reason=refuse_reason.replace(/'/g, "");
                    var querytext22    = 'update '+dataInfo.tablenameofitem+' set  mer_agree2=2,  is_refund=4, refund_time3=\''+ timestr +'\', refuse_reason=\''+ refuse_reason +'\' where ordernumber='+ dataInfo.ordernumber+' and id='+ dataInfo.id;
                    
                    console.log(querytext22);
                    Orderchilditem.query(querytext22, function(err, results) {
                    });
                }

            }else{
                refuse_reason=refuse_reason.replace(/"([^"]*)"/g, "$1");
                refuse_reason=refuse_reason.replace(/'/g, "");
                var querytext2    = 'update '+dataInfo.tablenameofitem+' set  mer_agree2=1,is_finished=1,  is_refund=6, refund_time3=\''+ timestr +'\', refuse_reason=\''+ refuse_reason +'\' where ordernumber='+ dataInfo.ordernumber+' and id='+ dataInfo.id;
                
                console.log(querytext2);
                Orderchilditem.query(querytext2, function(err, results) {
                    if(err){
                        retdata['code']=4003;
                        retdata['codeInfo']='拒绝更新失败';
                        self.adminRefundlog(dataInfo,retdata,refundData2);
                        
                        if(isPingppp==1){
                            console.log('refund final payment error 7');
                        }else{
                            return res.json(retdata);
                        }
                    }

                    retdata['data']=results;
                    self.adminRefundlog(dataInfo,retdata,refundData2);
                    
                    if(isPingppp==1){
                        console.log('refund final payment error 8');
                    }else{
                        return res.json(retdata);
                    }
                });
            }

            
        });
        
    },

    addScheduleOfTime:function(refundrnumber,tablenameofitem,triggerDay,typeOfTri,scheduleinfo3){
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        dateInfo.setDate(dateInfo.getDate()+triggerDay);
        var timestrdayAfter = dateInfo.Format("yyyy-MM-dd hh:mm:ss");

        if(!scheduleinfo3){
            scheduleinfo3='0';
        }
        var sql_orderSche   = 'INSERT INTO orderschedule (scheduleinfo, scheduleinfo2,scheduleinfo3, triggertime, is_expire, is_trace, type,createdAt,updatedAt) VALUES (\''+
            refundrnumber +'\',\''+tablenameofitem+'\',\''+scheduleinfo3+'\',\''+timestrdayAfter+
            '\',0,0,'+typeOfTri+',\''+timestr+'\',\''+timestr+'\')';
        console.log(sql_orderSche);
        Orderchilditem.query(sql_orderSche, function(err, reslist) {
            if(err){
                retdata['code']=4006;
                retdata['codeInfo']='sql_orderSche_err';
                retdata['codeInfo2']=err;
                console.log(retdata);
            }else{
                utility2.redisSubPubPCI();
            }
        });
    },

    addSchedule3Day:function(refundrnumber){

        var sql_orderSche   = 'update orderschedule set triggertime=DATE_ADD(triggertime,INTERVAL 3 DAY) where type=1 and is_expire=0 and scheduleinfo=\''+refundrnumber+'\'';
        console.log(sql_orderSche);
        Orderchilditem.query(sql_orderSche, function(err, reslist) {
            if(err){
                retdata['code']=4006;
                retdata['codeInfo']='sql_orderSche_err';
                retdata['codeInfo2']=err;
                console.log(retdata);
            }else{
                utility2.redisSubPubPCI();
            }
        });
    },

    platformSchedule: function() {
        var myRedis =  redis.client({db: 5});
        myRedis.get('schedule', function (err, value) {
            if(!err){
                if( value )
                {
                    
                }else{
                    myRedis.set('schedule',1,
                        function (err, red) {
                            myRedis.expire('schedule',100);
                    });

                    var schedule = require('node-schedule');
                    schedule.scheduleJob('1 1 * * * *', function(){
                        console.log('schedule-schedule');
                        var dd = new Date();
                        var timestr = dd.Format("yyyy-MM-dd hh:mm:ss");

                        var tableNames=['orderchilditem201703',
                        'orderchilditem201704','orderchilditem201705',
                        'orderchilditem201706','orderchilditem201707',
                        'orderchilditem201708','orderchilditem201709',
                        'orderchilditem201710','orderchilditem201711','orderchilditem201712'
                        ];

                        tableNames.forEach(function(element) {
                            //console.log(element);
                            var querytext='update '+element+' set is_refund=7 where is_refund=5 and updatedAt<\''+timestr+'\'';
                            Ordermain.query(querytext, function(err, results2) {
                                //console.log(querytext);
                                //console.log(results2);
                                if(err)console.log(err);
                            });
                        });
                    });
                }
            }else{
                console.log(err);
            }
        });


         


    },

    
    redisSubPubPCI: function() {
        this.mPubRedis.publish("orderchannel", "I am sending a message.C");
    },

    checkPaylimit: function(userid,sku,num,cb) {
        var paylimitkey= sku+'-'+userid;
        var self=this;
        console.log(self.mPayLimit);
        console.log(self.mPayLimit[sku]);

        console.log('sku length = ',sku.length);
            console.log(sku);
            console.log( 'typeof sku = ',typeof sku);
        for (var p in self.mPayLimit) {
            console.log(p);
            console.log('typeof p = ', typeof p);
            console.log('p length = ',p.length);
            if(p==sku){
                console.log('*********************************haha*******haha*******checkPaylimit0');
            }
            console.log(self.mPayLimit[p]);

            console.log('*********************************haha**************checkPaylimit0');
        };
        console.log('*********************************haha**************checkPaylimit1');
        if(self.mPayLimit[sku]){

            var myRedis =  redis.client({db: 5});

            console.log('*****************************haha******************checkPaylimit2');
            myRedis.get(paylimitkey, function (err, value) {

            console.log('***********************************************checkPaylimit3');
            console.log('value = ',value);
            console.log('num = ',num);
            console.log('limitnum = ',self.mPayLimit[sku]['limitnum']);
                if(!err){

                    console.log('***********************************************checkPaylimit4');
                    console.log(value);
                    console.log(self.mPayLimit);
                    if(value){

                        console.log('***********************************************checkPaylimit5');
                        if( (parseInt(value)+parseInt(num)) > self.mPayLimit[sku]['limitnum'] )
                        {
                            console.log('***********************************************checkPaylimit6');
                            return cb(null,0);
                        }else{
                            console.log('***********************************************checkPaylimit7');
                            return cb(null,1);
                        }
                    }else{

                        console.log('***********************************************checkPaylimit8');
                        if(parseInt(num)> self.mPayLimit[sku]['limitnum']){
                            console.log('***********************************************checkPaylimit9');
                            return cb(null,0);
                        }else{
                            console.log('***********************************************checkPaylimit10');
                            return cb(null,1);
                        }
                    }
                    
                }else{
                    console.log('***********************************************checkPaylimit11');
                    return cb(null,1);
                }
            });
        }else{
            console.log('***********************************************checkPaylimit12');
            return cb(null,1);
        }
        
    },

    savePaylimit: function(userid,sku,num) {

        var self=this;
        console.log('***********************************************savePaylimit1');

        console.log('userid = ',userid);
        console.log('num = ',num);
        console.log('sku = ',sku);
        console.log(self.mPayLimit);
        console.log('***********************************************savePaylimit2');

        if(self.mPayLimit[sku]) {
            console.log('***********************************************savePaylimit3');
            var paylimitkey= sku+'-'+userid;

            var myRedis =  redis.client({db: 5});
            myRedis.get(paylimitkey, function (err, value) {
                console.log('***********************************************savePaylimit4');
                if(!err){

                    
                        console.log('value = ',value);
                        console.log('num = ',num);
                        console.log('limitnum = ',self.mPayLimit[sku]['limitnum']);
                    if( value )
                    {
                        value=parseInt(value)+parseInt(num);
                    }else{
                        value=parseInt(num) ;
                    }
                    myRedis.set(paylimitkey,value,
                        function (err, red) {

                        console.log('***********************************************savePaylimit6');
                    });
                }else{
                        console.log('***********************************************savePaylimit7');
                    console.log(err);
                }
            });

        };
        
    },

    updateOrderRecord: function(data) {
        var ordernumber = data['ordernumber'];
        delete data.ordernumber;
        var setstr=' ';
        for ( var key in data ){
            setstr=setstr+key+'=\''+data[key]+'\','
        }
        if(setstr.length>2){
            setstr = ' set '+setstr;
            setstr = setstr.slice(0,setstr.length-1);
        }
        var querytext='update ordermain '+setstr+' where ordernumber=\''+ ordernumber+'\'';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if(err){
                console.log(err);
                return 4000;
            }else{
                console.log({"OK":200});
                return 200;
            }
        });

    },
    /*物流订阅
          http://www.kuaidi100.com/poll?param=
          {"number":"3910630379404",
          "key":"ZfYvUpFI2926", "parameters":{"callbackurl":"http://dev.darlinglive.com:1336/deliver/deliverTrack?no=12349"}}


    */
    deliverSubscript: function(subscriptData,cb){
        var retData={'code':200,'codeInfo':''};
        var querystring = require('querystring');

        var http = require('http');
        /**
        *company-订阅的快递公司的编码,   number-订阅的快递单号,    from-出发地城市,    to-目的地城市
        *key-授权码,    callbackurl-回调接口的地址,    salt-签名用随机字符串（可选）
        *resultv2-添加此字段表示开通行政区域解析功能（仅对开通签收状态服务用户有效）,
        *autoCom-添加此字段且将此值设为1，则表示开始智能判断单号所属公司的功能
        *interCom-添加此字段表示开启国际版,     departureCountry-出发国家编码,    departureCom-出发的快递公司的编码
        *destinationCountry-目的国家编码,    destinationCom-目的的快递公司的编码
        */
        var pathStr='{\"company\":\"'+subscriptData['company']+
                '\",\"number\":\"'+subscriptData['deliverorder']+
                '\",\"from\":\"'+subscriptData['fromaddre']+
                '\",\"to\":\"'+subscriptData['toaddre']+
                '\",\"key\":\"ZfYvUpFI2926\",\"parameters\":{\"callbackurl\":\"'+sails.config.globals.kuaidi100+subscriptData['interface']+
                '\",\"salt\":\"\",\"resultv2\":\"1\",\"autoCom\":\"1\",\"interCom\":\"1\",\"departureCountry\":\"'+
                '\",\"departureCom\":\"\",\"destinationCountry\":\"\",\"destinationCom\":\"\"}}';
        console.log(pathStr);
        var options = {
            host: "www.kuaidi100.com",
            path: '/poll?param='+pathStr,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        var request = http.request(options, function (response)
        {
            var body = "";
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
              body += chunk;
            });
            response.on('error', function (err) {
              console.log(err);
              next(err, null);
            });
            response.on("end", function ()
            {
                console.log("body::" + body);
                var infobody=null;
                if( typeof body == 'string'){
                    console.log("body::*******************************" );
                    
                    infobody = eval('(' + body + ')');
                    console.log(infobody);
                    console.log("body::*******************************" );
                }
                var newsql=
                'INSERT INTO kuaidilog_9 (`company`, `payorder`, `deliverorder`, `dayinfo`, `status`, `detailbody`) VALUES (\''+
                subscriptData['company']+'\',\''+
                subscriptData['payorder']+'\',\''+
                subscriptData['deliverorder']+'\',\''+
                utility2.getCurday()+'\',\''+
                subscriptData['status']+'\',\''+
                body+'\')';
                // kuaidilog_9 这个表是用来和快递100对账用的
                console.log(newsql);
                Kuaidilog9.query(newsql, function(err, results) {
                    if (err) {
                        console.log(err);
                        retData['code']=4002;
                        retData['codeInfo']=querystring.stringify(err);
                        return cb(null,retData);
                    }
                });
                if(infobody['returnCode']==200)
                {
                    var sqlStr =
                    'select * from kuaidilog where deliverorder=\''+ subscriptData['deliverorder'] + '\' and payorder=\''+ subscriptData['payorder'] +'\'';
                    Kuaidilog.query(sqlStr, function(err, results) {
                        if (err) {
                            retData['code']=4000;
                            retData['codeInfo']=querystring.stringify(err);
                            return cb(null,retData);
                        }

                        console.log(sqlStr);
                        if (results.length==0)
                        {
                            console.log("body::!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
                            var sqlStr2 =
                            'INSERT INTO kuaidilog (`company`, `payorder`, `refundrnumber`,`deliverorder`, `tablenameofitem`,`saleflag`,`imgaddress`,`remark`,`dayinfo`, `status`, `detailbody`) VALUES (\''+
                            subscriptData['company']+'\',\''+
                            subscriptData['payorder']+'\',\''+
                            subscriptData['refundrnumber']+'\',\''+
                            subscriptData['deliverorder']+'\',\''+
                            subscriptData['tablenameofitem']+'\',\''+
                            subscriptData['saleflag']+'\',\''+
                            subscriptData['imgaddress']+'\',\''+
                            subscriptData['remark']+'\',\''+
                            utility2.getCurday()+'\',\''+
                            subscriptData['status']+'\',\''+
                            subscriptData['detailbody']+'\')';
                            console.log(sqlStr2);
                            Kuaidilog.query(sqlStr2, function(err, results) {
                                if (err) {
                                    console.log(err);
                                    retData['code']=4001;
                                    retData['codeInfo']=querystring.stringify(err);
                                    return cb(null,retData);
                                }else{
                                    retData['codeInfo']=querystring.stringify(results);
                                    return cb(null,retData);
                                }
                            });
                        }else{
                            retData['code']=4001;
                            retData['codeInfo']='物流信息重复';
                            return cb(null,retData);
                        }
                    });
                } else if(infobody['returnCode']==501){
                    console.log("body::!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
                    retData['code']=infobody['returnCode'];
                    retData['codeInfo']=infobody['message'];
                    return cb(null,retData);
                } else{
                    retData['code']=infobody['returnCode'];
                    retData['codeInfo']=infobody['message'];
                    return cb(null,retData);
                }
            });
        });
        console.log(request);
        request.end();
               
    },
    // 获得昨天的日期
    getYesterday: function() {
        var dd = new Date();
        var y1 = dd.getFullYear();
        var m1 = dd.getMonth()+1;//获取当前月份的日期
        var d1 = dd.getDate();
        dd.setDate(dd.getDate()-1);//获取AddDayCount天后的日期
        var y2 = dd.getFullYear();
        var m2 = dd.getMonth()+1;//获取当前月份的日期
        var d2 = dd.getDate();
        var retData=[];
        retData.push(y1+'-'+m1+'-'+d1);
        retData.push(y2+'-'+m2+'-'+d2);
        // var retData[y1+"-"+m1+"-"+d1,y2+"-"+m2+"-"+d2];
        return retData;
    },
    getCurday: function() {
        var dd = new Date();
        var y1 = dd.getFullYear();
        var m1 = dd.getMonth()+1;//获取当前月份的日期
        var d1 = dd.getDate();
        return y1+'-'+m1+'-'+d1;
    },
    getSqlSelectUnionSort: function(selectArr,tablename,times,whereinfo) {
        var querytext   = ' ';
        var selecttext   = ' ';
        for (var i = 0; i < selectArr.length; i++) {
            selecttext+= selectArr[i]+' ,';
        };
        selecttext = selecttext.slice(0,selecttext.length-1);
        for (var i = 0; i < times; i++) {
            querytext+= ' (SELECT  '+ selecttext +' from '+ tablename+i+' where '+ whereinfo +' )  UNION';
        };
        querytext = querytext.slice(0,querytext.length-5);
        return querytext;
    },

    updateOrderItemRecord: function(data) {
        var ordernumber = data['ordernumber'];
        var tablenameofitem = data['tablenameofitem'];
        var id=data['orderdetailid'];
        delete data.ordernumber;
        delete data.tablenameofitem;
        delete data.orderdetailid;
        
        var setstr=' ';
        for ( var key in data ){
            setstr=setstr+key+'=\''+data[key]+'\','
        }
        if(setstr.length>2){
            setstr = ' set '+setstr;
            setstr = setstr.slice(0,setstr.length-1);
        }

        var querytext='update '+tablenameofitem+setstr+' where id='+ id;
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if(err){
                console.log(err);
                return 4000;
            }else{
                console.log({"OK":200});
                return 200;
            }
        });
    },
    updateOrderItemRecordDelivery: function(data) {
        var ordernumber = data['ordernumber'];
        var tablenameofitem = data['tablenameofitem'];
        delete data.ordernumber;
        delete data.tablenameofitem;
        delete data.orderdetailid;
        
        var setstr=' ';
        for ( var key in data ){
            setstr=setstr+key+'=\''+data[key]+'\','
        }
        if(setstr.length>2){
            setstr = ' set '+setstr;
            setstr = setstr.slice(0,setstr.length-1);
        }

        var querytext='update '+tablenameofitem+setstr+' where is_delivery=0 and   ordernumber=\''+ ordernumber+'\' limit 1';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if(err){
                console.log(err);
                return 4000;
            }else{
                console.log({"OK":200});
                return 200;
            }
        });
    },
    isPushCategorety:function(obj_arr,parent_ojb){
        for(var i = 0;i<obj_arr.length;i++){
            var obj = obj_arr[i];
            console.log('obj: check it out: ',obj);
            if (obj.parent.id == parent_ojb.id) {

            }
        }
    }
}



/*
alter table       orderchilditem add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201607 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201608 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201609 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201610 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201611 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201612 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201701 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201702 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201703 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201704 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201705 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
alter table orderchilditem201706 add column refuse_reason varchar(250) DEFAULT  '' AFTER is_refund;
*/
