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

    //构造消息
    var log = {};
    log.userid = mine.id;
    log.gname = mine.gname;
    log.username = mine.userAlias;
    log.params = JSON.stringify(allParams);
    log.action = options.action.toLowerCase();
    log.controller = options.controller.toLowerCase();
    log.ipaddress = req.ip.substring("::ffff:".length);
    log.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
    
    Logsystem.createLog(log,function (err, l){
    });

	return next();
};
