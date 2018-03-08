// policies/isVIP.js
module.exports = function entry (req, res, next) {
  utils.policiesReset("管理后台",req);
  //sails.log.info("\n .....<管理后台>.....正在写入访问日志.......... \n");
  return next();
};