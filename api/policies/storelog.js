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

	var options = req.options;
	var mine = req.session.mine;
	var allParams = req.allParams();

    getformattime = function() {
        return (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
    }

    //构造消息
	var log = {};
	log.userid = mine.id;
	log.username = mine.userAlias;
	log.shop_name = mine.shop_name;
	log.storename = mine.shop_name;
	log.createdAt = getformattime();
	log.permissiontype = "staff_permission";
	log.action = options.action.toLowerCase();
	log.controller = options.controller.toLowerCase();
	log.ipaddress = req.ip.substring("::ffff:".length);
	log.params = JSON.stringify(allParams).replace(/('|")/g,"\\$1");

	Logmerchant.createLog(log,function (err, l){
	});

	utils.policiesLayer("商户后台",req);
	return next();
};
