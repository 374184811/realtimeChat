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

	console.log('systemlog: This is the function entry. check it out: ', req.allParams());

	var options = req.options;
    var mine = req.session.mine;
    var allParams = req.allParams();

    var map = new Map();

    //登录检查
    map.set('MINE_CHECK',MINE_CHECK);
    //方法检查
    map.set('OPTION_CHECK',OPTION_CHECK);
    //安全检查
    map.set('SERCURITY_CHECK',SERCURITY_CHECK);

    //访问检查
    var acces = gcom.isAccess(req,res,map)
    if (acces !== 200) return acces;

    var id = mine.id;
    var gname = mine.gname;
    var username = mine.userAlias;
    //console.log('mine. check it out. ',mine);

    //构造消息
    var log = {};
    log.userid = id;
    log.gname = gname;
    log.username = username;
    log.action = options.action.toLowerCase();
    log.ipaddress = req.ip.substring("::ffff:".length);
    log.controller = options.controller.toLowerCase();
    log.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
    log.params = JSON.stringify(allParams).replace(/('|")/g,"\\$1");

    Logsystem.createLog(log,function (err, l){
    	console.log('cb_tag1: The result of this createLog is shown came out. check it out:  ok');
    });

	// console.log("hello wrold");
	// if(req.session.mine&&req.session.mine.storeid==0){//达令系统用户
	// 	console.log("系统用户");
	// 	var path = req.options;
	// 	var loginfo={};
	// 	var user=req.session.mine;
	// 	loginfo['controller']=path.controller.toLowerCase();
	// 	loginfo['action']=path.action.toLowerCase();
	// 	loginfo['userid']=user.id;
	// 	loginfo['username']=user.username;
	// 	loginfo['ipaddress']=req.ip.substring("::ffff:".length);
	// 	console.log("---------------------------------------");
	// 	console.log(req.session.mine);
	// 	console.log("---------------------------------------");
	// 	loginfo['gname']=user.gname;
	// 	loginfo['createdAt']=(new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
	// 	loginfo['createdAt']=(new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
	// 	var params=JSON.stringify(req.allParams());
	// 	params=params.replace(/('|")/g,"\\$1");

	// 	loginfo['params']=params;
	// 	Logsystem.createLog(loginfo,function (err, newUser){});
	// }
	return next();
};
