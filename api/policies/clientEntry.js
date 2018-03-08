// policies/isVIP.js
module.exports = function entry (req, res, next) {
	utils.policiesReset("前端用户",req);
  	//sails.log.info("\n .....<前端用户>.....正在写入访问日志.......... \n");
  	return next();
};