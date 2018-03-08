/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    // dt.initialize();

    // utility.initEmitter();
    // utility2.initEmitter();
    //utility.getOrderMainTableId();


    // waitStatistics = function(list) {
    //     var index = 0;
    //     while(list.length>0) {
    //         var obj = list.pop();
    //         var tb_M_Name = 'mergoodsList' + obj.id;
    //         var queryMGoodsSql = 'select * from ' + tb_M_Name + ' where ' +'goodsseries = 0';
    //         console.log('queryMGoodsSql. check it out. ',queryMGoodsSql);
    //         Creator.query(queryMGoodsSql, function query(err, list) {
    //             index = index + 1;
    //             console.log('cb_tag4: The result of this query is shown came out. index: ', index);
    //         });
    //     }
    // }

    // var gd = ["id","hid","storeid","parentid","categoryname","isdelete"];
    // var queryCategorySql = "select " + gd.join(",") + " from goodscategory"
    // Goodscategory.query(queryCategorySql,function (err, list) {
    //     if (err) {
    //         console.log("err_tag1: When this error is returned, the query fails.");
    //         return res.negotiate(err);
    //     }
    //     seller.setCCategory(list);
    //     console.log('cb_tag1: The result of this \' find \' is shown came out. check it out:  ',list.length);
    // });

    // var gd = ["id","nickname","shopsconcert","shopsconfig"];
    // var queryAccountSellerSql = "select " + gd.join(",") + " from accountseller";
    // console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
    // Accountseller.query(queryAccountSellerSql,function (err, list) {
    //     if (err) {
    //         console.log("err_tag2: When this error is returned, the query fails.");
    //         return res.negotiate(err);
    //     } 
    //     console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);
    //     seller.setStore(list);
    // });

    // var queryAccountSellerSql = "select id,nickname,shopsconcert from accountseller";
    // console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
    // Accountseller.query(queryAccountSellerSql,function (err, list) {
    //     if (err) {
    //         console.log("err_tag4: When this error is returned, the query fails.");
    //         return res.negotiate(err);
    //     } 
    //     console.log('cb_tag4: The result of this \' query \' is shown came out. check it out: ',list.length);
    //     seller.setShopsCenter(list);
    // });
    
    // var index = 1,skulist = [];
    // for(var i = 1;i<10000;i++) {
    //     var queryMGoodsSql = 'select sku from mergoodsList' + i + ' where ' +'goodsseries = 0';
    //     Creator.query(queryMGoodsSql, function query(err, list) {
    //         if (err || !list.length) return index+=1;
    //         console.log('cb_tag3: The result of this query is shown came out. check it out: ', index+=1);
    //         for(var i = 0; i<list.length; i++) {

    //             var prevIndex = dt.getSkuIndex();
    //             var lastIndex = dt.getCurSkuIndex(list[i].sku);

    //             //console.log("prevIndex: ",prevIndex," lastIndex: ",lastIndex);
    //             if (_.max([lastIndex,prevIndex])>prevIndex) {
    //                 console.log('setSkuIndex. ',prevIndex);
    //                 dt.setSkuIndex(prevIndex);
    //             }
    //         }
    //     });
    // }      

    // var queryAccountSellerIDSql = "select id from accountseller";
    // console.log('queryAccountSellerIDSql. check it out. ',queryAccountSellerIDSql);
    // Accountseller.query(queryAccountSellerIDSql,function (err, list) {
    //     if (err) {
    //         console.log("err_tag3: When this error is returned, the query fails.");
    //     }
    //     console.log('cb_tag3: The result of this \' query \' is shown came out. check it out: ',list.length);
    //     waitStatistics(list);
    // });



    // async.mapseries({
    //   checkIsResiger: function(callback){
    //       Account.find().exec(function f1(err, accoutlist) {

    //           var userlist =  userlist || [];
    //           for(var i = 0; i<accoutlist.length; i++){
    //               if(accoutlist[i].usermobile){
    //                   userlist.push(accoutlist[i].usermobile);
    //               }
    //           }

    //           callback(err, userlist);
    //       });
    //   },
    //   goodsCategory: function(callback){
    //       Goodscategory.find().exec(function f2(err, goodscategorylist) {

    //           var goodslist =  goodslist || [];
    //           for(var i = 0; i<goodscategorylist.length; i++){
    //               if(goodscategorylist[i].parentid==0){
    //                   goodslist.push(goodscategorylist[i])
    //               }
    //           }

    //           callback(err,goodslist);
    //       });
    //   }
    // },function(err,rst) {
    //    console.log('err: check it out: ',err);
    //    console.log('log_checkIsResiger: check it out: ',rst.checkIsResiger);
    //    console.log('log_goodsCategory: check it out: ',rst.goodsCategory);
    // });

  	//var queryList = Goodscategory.find();
  	//console.log('bootstrap: This is the function entry.  check it out: ',queryList)

	// queryList.exec(function afterFind(err, goodscategorylist) {

 //        if (err) {
 //            console.log("err: When this error is returned, the query fails.");
 //            return cb()
 //        }

 //        var goodslist =  goodslist || [];
 //        for(var i = 0; i<goodscategorylist.length; i++){
 //            if(goodscategorylist[i].parentid==0){
 //                goodslist.push(goodscategorylist[i])
 //            }
 //        }

 //        console.log("log: The result of this \' find \' is shown came out. check it out: ",goodslist)
	// });

    // var lastIdx = 0;
    // var prevIdx = 1;
    // //初始化数据
    // dt.initialize();
    // //建立排列库存
    // dt.initArrange();
    // //初始化SKU数组
    // dt.initSkuArray(lastIdx,prevIdx);
    SocketService.destroyChat();
    SocketService.destroyNotification();
  	cb();
};
