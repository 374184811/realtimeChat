// policies/isVIP.js
module.exports = function entry (req, res, next) {
  utils.policiesReset("商户后台",req);
  //sails.log.info("\n .....<商户后台>.....正在写入访问日志.......... \n");
  return next();
};