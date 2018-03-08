var schedule = require("node-schedule");
module.exports = {
    /**用于预售
    *开启定时任务
    * goodsArr 一个数组
    * @param id
    * @param storeid
    * @param type
    * @param storecategoryid
    * @param sku
    * @param presaleendtime
    */
    startTiming: function(goodsArr){
        _this = this;
        console.log("Wangcy:" + goodsArr);

        async.mapSeries(goodsArr, function(item, callback){
            var keystr = item.id + ":" + item.storeid + ":"+ item.type +":"+ item.storecategoryid+":"+item.sku;
            var timingName = item.sku;
            var sku = item.sku;
            var storeid = item.storeid;
            var endTime = new Date(item.presaleendtime).Format("yyyy-MM-dd hh:mm:ss");
            
            var nowDateNum = new Date().getTime();
            var endDateNum = new Date(item.presaleendtime).getTime();
            if(nowDateNum>=endDateNum){
                callback(null,[]);
            }else{
                _this.timing(timingName, endTime, sku, keystr);
    
                try{
                    timingmsg.findOne({sku:item.sku, is_expire:1})
                      .exec(function(err, one){
                          if(err) {
                              console.log("startTiming err: " + err);
                              return;
                          }
                          if(!one){
                              var insertStr = "INSERT INTO timingmsg (timingname,sku,storeid,endtime,";
                              insertStr += "is_expire, storecategoryid, goodsid, type)VALUES(";
                              insertStr += "'"+ timingName +"','" + sku + "'," + storeid +",'"+ endTime +"', 1,";
                              insertStr += item.storecategoryid + "," + item.id + "," + item.type + ")";
                              console.log("startTiming insertStr:" + insertStr);
                              timingmsg.query(insertStr, function(err, timingmsg){
                                  callback(err, timingmsg);
                              });
                          } else {
                              // 更新定时器的结束时间
                              timingmsg.update({timingname:timingName, sku:sku, is_expire:1},{endtime: endTime})
                                .exec(function(err, result){
                                    callback(err, result);
                                });
                          }
                      });
                }catch(err){
                    callback(err, []);
                }
            }
        },function(err, rusult){
            if(rusult){
                console.log("startTiming");
            }
            if(err){
                console.log("startTiming err: ", err);
            }
            //return res.json({});
        });
    },
    /**
    *更新定时任务
    * goodsobj是一个对象
    * @param goodsobj.id
    * @param goodsobj.storeid
    * @param goodsobj.type
    * @param goodsobj.storecategoryid
    * @param goodsobj.sku
    * @param goodsobj.presaleendtime
    */
    updateTiming: function(goodsobj){
        _this = this;
        var id = goodsobj.id;
        var sku = goodsobj.sku;
        var storeId =  goodsobj.storeid;
        var type =  goodsobj.type;
        var storecategoryId =  goodsobj.storecategoryid;
        var endTime =  goodsobj.presaleendtime;
        var timmingName = goodsobj.sku;

        var keystr = id+":"+ storeId+ ":"+type+":"+storecategoryId;

        var j = schedule.scheduledJobs[sku]; // 获取定时任务
        console.log(schedule.scheduledJobs);
        if(j!=null || j!=undefined){
            // 取消定时
            console.log(j);
            j.cancel();
            // 重新开启定时器
            _this.timing(timmingName, endTime, sku, keystr);
            // 更新定时器的结束时间
            timingmsg.update({timingname:timmingName, sku:sku},{endtime: endTime})
            .exec(function(err, result){
                if(rusult){
                    console.log("updateTiming");
                }
                if(err){
                   console.log("updateTiming err: ", err);
                }
            });
        }
    },
    /**
    *定时函数
    * @param timingname  定时器名字
    * @param time  定时的时间
    * @param sku   商品货号
    * @param keystr  key字符串
    */
    timing: function(timingname, time, sku, keystr){
         try{
            schedule.scheduleJob(timingname, time, function(){
                // 开启支付尾款状态
                var dd = new Date();
                var timestr = dd.Format("yyyy-MM-dd hh:mm:ss");

                console.log('timestrtimestrtimestr ',timestr + " " + timingname);
                console.log('time ',time);
                var querytext1='select ordernumber,buyerid,storeid,tablenameofitem from ordermain    where ordertype=11 and presale_endtime<=\''+timestr+'\'';
                Ordermain.query(querytext1, function(err, results) {
                    if(err)console.log(err);
                    console.log(querytext1);
                    console.log("timing  WCY :results===> " + results);

                    if(results.length>=1){
                        var merNameList=seller.getStoreArray();
                        results.forEach(function(element2) {
                            var querytext2='select sku,goodsname from '+element2['tablenameofitem']+' where ordernumber=\''+element2['ordernumber']+'\'';

                            Ordermain.query(querytext2, function(err, results2) {
                                console.log(querytext2);
                                console.log( "timing  WCY : element2===>"+ results2.length);
                                if (results2.length>=1) {

                                    var sign = utility.generateMixed(3, false);
                                    sign += Math.ceil((new Date()).getTime() / 1000);
                                    var extra={
                                        sign:sign,
                                        sender:merNameList[element2['storeid']],
                                        sendavatar:0
                                    };
                                    var content='你预定的 '+ results2[0]['goodsname']+' 预售期已结束，快来补齐尾款吧。前往个人中心，查找待付款的订单进行尾款支付。';
                                    console.log(content);
                                    var sendUsers=[];
                                    // receiverUsers.forEach(function (ac) {
                                    //     sendUsers.push("dl_"+element2['buyerid']);
                                    // });
                                    // console.log(sendUsers.join(","));
                                    // common.pushMessage(sendUsers.join(","),"darling_msg",content,extra,function (err, ret) {
                                    //     if (err) {
                                    //         console.log(' 尾款通知失败 ',element2);
                                    //     }else{
                                    //         console.log(' 尾款通知成功 ',element2);
                                    //         console.log(' 尾款通知成功2 ',ret);
                                    //     }
                                    // });

                                };
                            });

                        })

                        var querytext3='update ordermain set count=total_amount-payment_amount, ordertype=12 where ordertype=11 and presale_endtime<=\''+timestr+'\'';
                        Ordermain.query(querytext3, function(err, results3) {
                            console.log(querytext3);
                            console.log(results3);
                            if(err)console.log(err);
                        });

                        var querytext4='update ordermain set  ordertype=9 where ordertype=10 and presale_endtime<=\''+timestr+'\'';
                        Ordermain.query(querytext4, function(err, results4) {
                            console.log(querytext4);
                            console.log(results4);
                            if(err)console.log(err);
                        });

                        var querytext5='select  distinct(operatorno) from account';
                        Ordermain.query(querytext5, function(err, results5) {
                            console.log(results5);
                            if(err)console.log(err);
                        });
                    }
                });

                // 更新预售商品状态
                gcom.updatePreGoods(keystr);

                timingmsg.update({sku:sku, is_expire:1},{is_expire: 2})
                .exec(function(err, result){
                    if(err) {
                        console.log("timing err: " + err);
                        return;
                    }
                });
                console.log("定时器停止, 时间是 " + new Date().Format("yyyy-MM-dd hh:mm:ss"));
            });
        }catch(e){
            console.log('timing err: ',e);
        }
    },
    /**
    *取消定时任务
    * @param key 定时任务的key值
    */
    cancelTiming: function(key){
        // 获取定时任务
        var j = schedule.scheduledJobs[key];
        if(j!=null || j!=undefined){
            // 取消定时
            console.log(j.name + "定时取消");
            j.cancel();
        }
    },
    /**
     * 售后自动确认
     * @param obj  一个对象
     * @param obj['ordernumber'] 退单号
     * @param obj['tablenameofitem']  详细表名
     * @param obj['orderdetailid']  子表中对应的id值
     * @param obj['endtime']  结束时间
     */
    autoAfterMarket: function(obj){
        console.log('autoAfterMarket ==> ',obj);
        var _this = this;
        var ordernumber = obj['ordernumber'];
        var tablenameofitem = obj['tablenameofitem'];
        var orderitemid = obj['orderdetailid'];

        var timeStr = new Date(obj['endtime']).Format("yyyy-MM-dd hh:mm:ss");;
        var timingname = 'aftermarket-'+tablenameofitem+'-'+orderitemid;

        // 插入数据到定时表
        timingmsg.findOne({timingname:timingname,sku:ordernumber, is_expire:1})
        .exec(function(err, one){
            if(err) {
                console.log(err);
                return;
            }
            if(!one){
                var insertStr = "INSERT INTO timingmsg (timingname,sku,storeid,endtime,";
                insertStr += "is_expire, storecategoryid, goodsid, type)VALUES(";
                insertStr += "'"+ timingname +"','" + ordernumber + "'," + 0 +",'"+ timeStr +"', 1,";
                insertStr += 0 + "," + 0 + "," + 0 + ")";
                console.log(insertStr);
                timingmsg.query(insertStr, function(err, timingmsg){
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log("update ok");
                });
            }
        });

        schedule.scheduleJob(timingname, timeStr, function(){
            var udpatetext = "UPDATE "+ tablenameofitem +" SET is_finished=1,refund_time3='" + new Date().Format("yyyy-MM-dd hh:mm:ss") +"'";
            udpatetext += " WHERE refundrnumber='" + ordernumber + "' AND id=" + orderitemid ;
            console.log(udpatetext);
            Orderchilditem.query(udpatetext,function(err,data){
                if(err){
                    console.log(err);
                    return;
                }

                console.log("自动售后确认结束，时间为 " + new Date().Format("yyyy-MM-dd hh:mm:ss"));
            });
            timingmsg.update({timingname:timingname,sku:ordernumber, is_expire:1},{is_expire: 2})
            .exec(function(err, result){
                if(err) {
                    console.log("timing err: " + err);
                }
            });
        });
},
    /**
    *自动确认收货
    * @param obj['ordernumber'] 订单号
    * @param obj['tablenameofitem'] 子表表名
    */
    autoReceipt: function(obj){
        console.log('autoReceipt ==> ',obj);
        var _this = this;
        var ordernumber = obj['ordernumber'];
        var tablenameofitem = obj['tablenameofitem'];
        var key = 'receipt:' + ordernumber;

        var myRedis = redis.client({db: 7});
        myRedis.get(key, function(err, value) {
            if(!err){
                var timeStr = '';
                var timingname = 'receipt-' + tablenameofitem;
                if(value){
                    console.log("value1 ==  "+ value);

                    timeStr = new Date(Number(value)).Format("yyyy-MM-dd hh:mm:ss");
                    // 更新定时器的结束时间
                    timingmsg.update({timingname:timingname,sku:ordernumber, is_expire:1},{endtime: timeStr})
                    .exec(function(err, result){
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log("update ok");
                    });
                }else{
                    //15天后
                    var nowDate = new Date();
                    var afterDate = nowDate.setDate(nowDate.getDate() + RECEIPT_CONFIRM_TIME + 1);
                    // var afterDate = nowDate.setMinutes(nowDate.getMinutes() + RECEIPT_CONFIRM_TIME + 1);
                    timeStr = new Date(afterDate).Format("yyyy-MM-dd hh:mm:ss");

                    myRedis.set(key, afterDate, redis.print);

                    // 插入数据到定时表
                    timingmsg.findOne({timingname:timingname,sku:ordernumber, is_expire:1})
                    .exec(function(err, one){
                        if(err) {
                            console.log(err);
                            return;
                        }
                        if(!one){
                            var insertStr = "INSERT INTO timingmsg (timingname,sku,storeid,endtime,";
                            insertStr += "is_expire, storecategoryid, goodsid, type)VALUES(";
                            insertStr += "'"+ timingname +"','" + ordernumber + "'," + 0 +",'"+ timeStr +"', 1,";
                            insertStr += 0 + "," + 0 + "," + 0 + ")";
                            console.log(insertStr);
                            timingmsg.query(insertStr, function(err, timingmsg){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                console.log("update ok");
                            });
                        }
                    });
                }

                console.log(timeStr);
                schedule.scheduleJob(timingname, timeStr, function(){
                    var data1 = {}, data2 = {};
                    var querytext = "SELECT ordernumber FROM ordermain WHERE ordernumber='"+ ordernumber + "' AND status=2 AND is_delivery=1";
                    console.log(querytext);
                    Ordermain.query(querytext, function(err, order){
                        // 删掉确认收货延时的redis值
                        myRedis.del(key);

                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log(order.length);
                        if (order.length > 0) {
                            data1['ordernumber'] = ordernumber;
                            data1['is_delivery'] = 2;
                            data1['status'] = 3;
                            utility2.updateOrderRecord(data1);
                            // 开启自动评价
                            data2['ordernumber'] = ordernumber;
                            data2['tablenameofitem'] = tablenameofitem;
                            data2['endtime'] = null;
                            _this.autoAssess(data2);

                            console.log("自动确认收货结束，时间为 " + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                        }

                        timingmsg.update({timingname:timingname,sku:ordernumber, is_expire:1},{is_expire: 2})
                        .exec(function(err, result){
                            if(err) {
                                console.log("timing err: " + err);
                            }
                        });
                    });
                });
            }
        });
    },
    /**
    *自动评价
    * @param obj 一个对象
    */
    autoAssess: function(obj){
        console.log('autoAssess ==> ', obj);
        var _this = this;
        var data = obj;

        // 7天后
        var afterDate = '';
        if (data.endtime != null){
            afterDate = data.endtime;
        } else{
            var nowDate = new Date();
            afterDate = nowDate.setDate(nowDate.getDate() + ASSESS_TIME + 1);
            // afterDate = nowDate.setMinutes(nowDate.getMinutes() + 0 + 1);
        }
        var timeStr = new Date(afterDate).Format("yyyy-MM-dd hh:mm:ss");
        var timingname = 'assess-' + data['tablenameofitem'];

        // 插入数据到定时表
        timingmsg.findOne({timingname:timingname,sku:data['ordernumber'], is_expire:1})
        .exec(function(err, one){
            if(err) {
                console.log(err);
                return;
            }
            if(!one){
                var insertStr = "INSERT INTO timingmsg (timingname,sku,storeid,endtime,";
                insertStr += "is_expire, storecategoryid, goodsid, type)VALUES(";
                insertStr += "'"+ timingname +"','" + data['ordernumber'] + "'," + 0 +",'"+ timeStr +"', 1,";
                insertStr += 0 + "," + 0 + "," + 0 + ")";
                console.log(insertStr);
                timingmsg.query(insertStr, function(err, timingmsg){
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log("update ok");
                });
            }
        });

        schedule.scheduleJob(timingname, timeStr, function(){
            var querytext = "SELECT id FROM "+ data['tablenameofitem'] +" WHERE ordernumber='"+ data['ordernumber'] + "' AND is_comment !=1";
            console.log(querytext);
            Ordermain.query(querytext, function(err, order){
                if (err) {
                    console.log(err);
                    return;
                }
                if (order.length > 0) {
                    order.forEach(function(item){
                        var data1 = data;
                        data1['orderitemid'] = item['id'];
                        data1['starnum'] = 5;
                        data1['ratetext'] = '好评';
                        data1['picurl'] = '';
                        _this.insertAssess(data1, null);
                    });
                    console.log("自动评价结束，时间为 " + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                }
                timingmsg.update({timingname:timingname,sku:data['ordernumber'],is_expire:1},{is_expire: 2})
                .exec(function(err, result){
                    if(err) {
                        console.log("timing err: " + err);
                    }
                });
            });
        });
    },
    /**
    * 生成一条评价函数
    * @param obj['ordernumber'] 订单号
    * @param obj['tablenameofitem'] 详细商品信息存放的表名:按月变化，表名
    * @param obj['orderitemid'] 子订详情表中的id
    * @param obj['starnum'] 评价等级
    * @param obj['ratetext'] 评价内容
    * @param obj['picurl'] 评价图片
    */
    insertAssess: function(obj, callback){
        console.log("insertAssess ==> ", obj);
        var ordernumber = obj['ordernumber'];
        var tablenameofitem = obj['tablenameofitem'];
        var orderitemid = obj['orderitemid'];
        var starnum = obj['starnum'];
        var ratetext = obj['ratetext'];
        var picurl = obj['picurl'];
        var vrxmlurl = obj['vrxmlurl'];
        console.log(typeof picurl,typeof vrxmlurl);

        var conuter = 0;
        var data = {};
        var returnData = {};
        var retData = {'code':200,'codeInfo':'ok'};

        var done = function(key, data2){
            returnData[key] = data2;
            conuter++;
            if(conuter == 2){
                utility.emitter.removeListener('createRate'+orderitemid, done);

                data['ordernumber']         = returnData['1']['ordernumber'];
                data['tablenameofitem']     = returnData['1']['tablenameofitem'];
                data['userid']              = returnData['1']['buyerid'];
                data['storeid']             = returnData['1']['storeid'];
                data['mobile']              = returnData['1']['usermobile'];
                data['buyername']           = returnData['1']['buyername'];

                data['starnum'] = starnum;
                data['ratetext'] = ratetext;
                data['isdelete'] = 0;
                data['createdAt'] = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

                data['picurl']  = '';
                if(typeof picurl != 'undefined'){
                    if(typeof picurl == 'array'){
                        data['picurl']  = picurl.join(',');
                    }else if(typeof picurl == 'string'){
                        data['picurl'] = picurl;
                    }else if(typeof picurl == 'object'){
                        var picurlstr = '';
                        for(var item in picurl) {
                           console.log(typeof picurl[item]);
                           console.log( picurl[item]);
                           if(typeof picurl[item] != 'function'){
                              picurlstr += picurl[item]+',';
                           }
                        }
                        data['picurl'] = picurlstr.substring(0,picurlstr.length-1);
                    }else{
                        data['picurl'] = returnData['2']['goodsimage'];
                    }
                }
                console.log(data['picurl']);
  
                data['vrxmlurl'] = '';
                if(typeof picurl == 'array'){
                    data['vrxmlurl']  = picurl.join(',');
                }else if(typeof picurl == 'string'){
                    data['vrxmlurl'] = picurl;
                }else if(typeof vrxmlurl == 'object'){
                    var vrxmlurlstr = '';
                    for(var item in vrxmlurl) {
                        console.log(typeof vrxmlurl[item]);
                        console.log( vrxmlurl[item]);
                        if(typeof vrxmlurl[item] != 'function'){
                            vrxmlurlstr += vrxmlurl[item]+',';
                        }
                    }
                    data['vrxmlurl'] = vrxmlurlstr.substring(0,vrxmlurlstr.length-1);
                }
              
                data['orderdetailid']       = returnData['2']['id'];
                data['goods_property']      = returnData['2']['goods_property'];
                var skuArr = returnData['2']['sku'].split('-');
                if(skuArr.length >= 3){
                    data['sku'] = skuArr[0] + '-' + skuArr[1] + '-' + skuArr[2];
                }else{
                    data['sku'] = returnData['2']['sku'];
                }
                data['goodsname'] = returnData['2']['goodsname'];
                // 插入评价信息
                var tablename = 'merrateorder' + data['storeid'];
                var querytext = utility.insertDataToTable(data, tablename);
                Rateorder.query(querytext, function(err, results2) {
                    if (err){
                         console.log(err);
                         return;
                    }
                    var data2 = {};
                    // 更新订单子表中评价状态
                    var updateStr = "UPDATE "+data['tablenameofitem']+" SET is_comment=1 WHERE id="+data['orderdetailid'];
                    Orderchilditem.query(updateStr,function(err,update){
                        if(err){
                            console.log(err);
                            return;
                        }
                        // 更新主订单表中status状态
                        var selectStr = "SELECT is_comment FROM "+data['tablenameofitem']+" WHERE ordernumber="+data['ordernumber'];
                        Orderchilditem.query(selectStr,function(err,orderitem){
                            if (err){
                                console.log(err);
                                return;
                            }
                            var sum = 0;
                            if(orderitem.length >0){
                                orderitem.forEach(function(item){
                                    if(item.is_comment == 1){
                                        sum++;
                                    }
                                });
                            }
                            if(sum==orderitem.length){
                                // console.log(sum);
                                data2['ordernumber'] = data['ordernumber'];
                                data2['status'] = 4;
                                utility2.updateOrderRecord(data2);
                            }
                        });
                    });

                    if(callback != null){
                        callback(retData);
                    }
                });
            }
        };
        utility.emitter.on('createRate'+orderitemid,done);

        var querytext = "SELECT ordernumber,tablenameofitem,buyerid,storeid,consignee_mobile,buyername ";
        querytext += "FROM ordermain WHERE ordernumber='"+ ordernumber +"'";
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
           if(err) {
               console.log(err);
               return;
           }
           Account.findOne({id:results[0].buyerid}).exec(function(err,acc){
              if (err){
                  console.log(err);
                  return;
              }
              results[0].usermobile = acc.usermobile;
              utility.emitter.emit('createRate'+orderitemid,'1', results[0]);
           });
        });

        var querytext2 = "SELECT id,goods_property,goodsimage,sku,goodsname FROM "+ tablenameofitem +" WHERE id="+ orderitemid;
        console.log(querytext2);
        Orderchilditem.query(querytext2, function(err, results) {
           if(err) {
              console.log(err);
              return;
           }
           utility.emitter.emit('createRate'+orderitemid,'2', results[0]);
        });
    }
};
