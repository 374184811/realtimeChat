// policies/isVIP.js
module.exports = function finsh (req, res, next) {
	utils.policiesTheEnd("前端用户",req);
  //sails.log.info("\n .....<前端用户>.....访问记录写入成功.......... \n");
  return next();
};