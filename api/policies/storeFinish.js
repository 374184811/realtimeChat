// policies/isVIP.js
module.exports = function finsh (req, res, next) {
	utils.policiesTheEnd("商户后台",req);
  //sails.log.info("\n .....<商户后台>.....访问记录写入成功.......... \n");
  return next();
};