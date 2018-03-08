var tasks = require('../lib/tasks');
/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {

    //console.log('权限策略: This is the function entry. ',req.allParams());

    var controller
    var options = req.options;
    var mine = req.session.mine;

    var groupid = mine.groupid;
    var storeid = mine.storeid;
    var action = options.action.toLowerCase();

    controller = options.controller.toLowerCase();
    controller = collection[controller] || controller;

    var where = { or:[] };

    where.or.push({controller:controller,action:"*"});
    where.or.push({controller: controller, action: action});
    console.log("permission. check it out. ", {groupid,storeid,action,controller});

    fn0 = function(cb) {
        cb(null,null);
    };

    fn1 = function(cb, result) {
        Departmentgroup.findOne({ id: groupid, storeid: storeid }).exec(function (err, record) {
            console.log('fn0: The result of this findOne is shown came out. ',record);
            cb(err,record);
        });
    };

    fn2 = function(cb, result) {
        Permission.find(where).exec(function (err, list) {
            console.log('fn1: The result of this find is shown came out. ok',list.length);
            cb(err,list);
        });
    };

    fn3 = function(cb, result) {

        //console.log('result.b ',result.b);
        //console.log('result.a.permission. ',result.a.permission);

        var b, err = null;
        result = result || {};
        result.a = result.a || {};
        result.a.permission = result.a.permission || "";
        result.a.permissionarray = result.a.permission.split(":");

        
        result.a.permissionarray.remove("");
        if (!result.a.permissionarray.length) {
            err = -1;
        }

        //console.log('result.a.permissionarray. ',result.a.permissionarray.length);
        b = result.a.permissionarray.includes("*");
        permissionarray = result.a.permissionarray;
        
        for(var i = 0; i<result.b.length; i++) {
            if (permissionarray.includes(result.b[i].id.toString())) {
                b = permissionarray.includes(result.b[i].id.toString())
                break;
            }
        }

        if (!b) err = 1;
        //console.log('b is. ',b,'==> err. ',err);

        cb(err,result);
    };

    callback = function(err, reuslts){
        if(err) {
            return res.json({
                data:[],
                code:4013,
                msg:"权限不足"
            });
        }else{
            utils.policiesLayer("权限校验",req);
            return next() 
        }
    };

    tasks.series({
        z:fn0,
        a:fn1,
        b:fn2,
        c:fn3
    }, callback);




    // Departmentgroup.findOne({ id: groupid, storeid: storeid }).exec(function (err, record) {

    //     if (err) {
    //         return res.json({
    //             data:[],
    //             code:4013,
    //             msg:"权限不足"
    //         });
    //     }
    //     console.log('cb_tag1: The result of this findOne is shown came out.');

    //     record = record || {};
    //     record.permission = record.permission || "";
    //     record.permission = record.permission.split(":");

    //     permissionArr = record.permission || [];
    //     permissionArr.remove("");

    //     //console.log('permissionArr: ',permissionArr.length);
    //     if (record.permission === "*") {
    //         return next();
    //     }else
    //     if (!permissionArr.length) {
    //          return res.json({
    //             data:[],
    //             code:4023,
    //             msg:"权限不足"
    //         });
    //     }

    //     var where = {};
    //     where.or = [];
    //     where.or.push({controller:controller,action:"*"});
    //     where.or.push({controller: controller, action: action});
    //     //{or:[{controller: controller, action: action},{controller:controller,action:"*"}]}
    //     Permission.find(where).exec(function (err, list) {

    //         console.log("Permission. ",err,list);

    //         if (err){
    //             return res.json({
    //                 data:[],
    //                 code:4033,
    //                 msg:"权限不足"
    //             });
    //         }

    //         console.log('cb_tag2: The result of this find is shown came out. ');

    //         var b = false;
    //         while(list.length) {
    //             var e = list.pop();
    //             if (b = permissionArr.includes((e.id).toString())) {
    //                 break;
    //             }
    //         }

    //         //console.log('permission is ', b);
    //         if (b) {
    //             return next()
    //         }else{
    //             return res.json({
    //                 data:[],
    //                 code:4043,
    //                 msg:"权限不足"
    //             });
    //         }
    //     })
    // });

    


    // var path = req.options;
    // var loginfo = {};
    // if (!req.session || !req.session.mine) {
    //     return res.json({
    //         "msgCode":"需要登录",
    //         "code":"0",
    //     });
    // }
    // var user = req.session.mine;
    // if (user.storeid==0) {//达令后台管理用户
    //     return next();
    // }
    
    // var strA=[];
    // strA[3] = path.action.toLowerCase();//action
    // strA[2] = path.controller.toLowerCase();//controller
    // strA[0] = user.groupid;
    // strA[1] = user.storeid;
    // var data = strA;

    // //判断商户下面的管理者是否有权限
    // //console.log(data);
    // Departmentgroup.findOne({id: data[0], storeid: data[1]}).exec(function (err, record) {

    //     if (err||!record || !record.permission) {
    //         return res.json({
    //             code:4013,
    //             msg:"你没有权限"
    //         });
    //     }
    //     if(record.permission=="*"){
    //         return next();
    //     }
    //     var permissions = record.permission.split(":");
    //     Permission.find({or:[{controller: data[2], action: data[3]},{controller:data[2],action:"*"}]}).exec(function (err, records) {

    //         if (err){
    //             return res.json({
    //                 code:4023,
    //                 msg:"你没有权限"
    //             });
    //         }
    //         // console.log(records);
    //         // console.log(permissions);
    //         var hasPermission=false;
    //        for(var i=0;i<records.length;i++){
    //            var record=records[i];
    //            if (permissions.indexOf((record.id).toString()) >= 0) {
    //                hasPermission = true;
    //                break;
    //            } else {
    //                hasPermission=false;
    //            }
    //        }
    //         console.log("是否有权限:"+hasPermission);
    //         if (hasPermission) {
    //             return next();
    //         }else{
    //             return res.json({
    //                 code:4033,
    //                 msg:"你没有权限"
    //             });
    //         }
    //     });
    // });

};
