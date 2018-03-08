/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

	console.log('merchantlog: This is the function entry. check it out: ', req.allParams());

	var options = req.options;
	var mine = req.session.mine;
    var allParams = req.allParams();

    var map = new Map();

    //登录检查
    map.set('MINE_CHECK',MINE_CHECK);
    //安全检查
    map.set('SERCURITY_CHECK',SERCURITY_CHECK);
    //参数检查
    //map.set('PASS_CHECK',PASS_CHECK);
    //空对象检查
    //map.set('VALID_CHECK',VALID_CHECK);
    //方法检查
    //map.set('OPTION_CHECK',OPTION_CHECK);
    //管理员ID检查
    //map.set('ADMINDID_CHECK',ADMINDID_CHECK);

    //访问检查
    var acces = gcom.isAccess(req,res,map)
    if (acces !== 200) return acces;

    var id = mine.id;
    var storeid = mine.storeid;
    var userAlias = mine.userAlias;
    var shop_name = mine.shop_name;
    var permissiontype = mine.isAdmin ? "admin" : "staff";
    var createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

    if (!storeid) return next(); 
    Adminuser.findOne({id:id}).exec(function (err,r) {

    	console.log('cb_tag1: The result of this findOne is shown came out. check it out:  ok');
    	if (r) {

    		//构造消息
	    	var log = {};
	    	log.userid = id;
	    	log.username = userAlias;
	    	log.shop_name = shop_name;
	    	log.storename = shop_name;
	    	log.createdAt = createdAt;
	    	log.permissiontype = permissiontype;
	    	log.action = options.action.toLowerCase();
	    	log.controller = options.controller.toLowerCase();
	    	log.ipaddress = req.ip.substring("::ffff:".length);
	    	log.params = JSON.stringify(allParams).replace(/('|")/g,"\\$1");

	    	Logmerchant.createLog(log,function (err, l){
	    		console.log('cb_tag2: The result of this createLog is shown came out. check it out:  ok');
	    	});
    	}
    })

	// var options = req.options;

	// if(req.session.mine&&req.session.mine.storeid!=0){  //只有运营商才记录操作日志
	// 	var merchant=req.session.mine;
	// 	Adminuser.findOne({id:merchant.id}).exec(function (err,record) {
	// 		//console.log(record);
	// 		if(record){
	// 			var loginfo={};
	// 			loginfo['controller']=options.controller.toLowerCase();
	// 			loginfo['action']=options.action.toLowerCase();
	// 			loginfo['userid']=merchant.id;
	// 			loginfo['username']=merchant.userAlias;
	// 			loginfo['ipaddress']=req.ip.substring("::ffff:".length);
	// 			loginfo["storename"]=merchant.shop_name;
	// 			loginfo["permissiontype"]=merchant.isAdmin?"admin":"staff";
	// 			loginfo['createdAt']=(new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
	// 			var params=JSON.stringify(req.allParams());
	// 			params=params.replace(/('|")/g,"\\$1");

	// 			loginfo['params']=params;

	// 			Logmerchant.createLog(loginfo,function userRegister(err, newUser){});
	// 		}
	// 	});


	// }
	return next();
};
