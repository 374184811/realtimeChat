// policies/isVIP.js
module.exports = function finsh (req, res, next) {
	utils.policiesTheEnd("管理后台",req);
  // sails.log.info("\n .....<管理后台>.....访问记录写入成功.......... \n");
  return next();
};