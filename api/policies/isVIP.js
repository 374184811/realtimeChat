// policies/isVIP.js
module.exports = function isVIP (req, res, next) {

  //sails.log.info( '用户策略. This is the function entry. ',req.allParams());

  var allParams = req.allParams();
  var client = redis.client({db: 2});

  var mId = allParams.mId || 0;
  var tokenId = allParams.tokenId || "aaaabbbb";
  var hashIdentity = mId + ":" + tokenId;
  client.get(hashIdentity, function (err, value) {

      // Handle unknown errors
      if (err) { res.serverError(err); }

      var userData = utility.decodeToken(value);
      sails.log.info(' 用户身份解密',userData?"成功":"失败");
      // If the user couldn't be found, forbid access.
      // (this handles the rare case of a logged-in user being deleted)
      if (!userData) { return res.identifications({code:403}); }

      utils.policiesLayer("前端用户",req);
      redis.setUserInfo(userData);
      return next();
  });
};