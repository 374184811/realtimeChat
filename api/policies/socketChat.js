// policies/isVIP.js
module.exports = function finsh (req, res, next) {
  utils.policiesLayer("建立聊天",req);
  //sails.log.info("\n .....<建立聊天>.....正在记录用户聊天.......... \n");
  return next();
};