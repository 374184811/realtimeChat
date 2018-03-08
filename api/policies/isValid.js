// policies/isVIP.js
module.exports = function isNull (req, res, next) {

  console.log('参数策略. This is the function entry. ',req.allParams());

  var allParams = req.allParams();

  var keys = _.keys(allParams);
  var vals = _.values(allParams);

  isEmpty = function(e) {
    var forbidden = {};
    forbidden["NaN"] = true;
    forbidden["null"] = true;
    forbidden["defined"] = true;
    forbidden["undefined"] = true;
    return forbidden[e];
  }

  isValid = function(e) {

      var isValid;
      if (!isValid) {
        isValid = isEmpty(e);
      }
      if(!isValid) {
        isValid = _.isNaN(e);
      }
      if(!isValid) {
        isValid = _.isNull(e)
      }
      if(!isValid) {
        isValid = _.isUndefined(e)
      }
      return isValid;
  };

  analysis = function(obj) {

    var kk = _.keys(obj);
    var vv = _.values(obj);

    var k = kk.pop();
    var v = vv.pop();

    var isEmpty = -1;
    if (_.isObject(v)) {
        analysis(v);
    }

    if(_.isArray(v)) {
      while(v.length) {
        if (isValid(v.pop())) {
            isEmpty = true;
        }
      }
    }

    if (isEmpty === -1) {
      isEmpty = isValid(v)
    }

    //console.log("isEmpty. ",isEmpty);
    return isEmpty;
  };

  var zIndex = 0;
  while (keys.length) {

    var key = keys.pop();
    var val = vals.pop();

    if (analysis({key,val})) {
        zIndex++;
    }
  }

  if (zIndex>0) {
    return res.json({
        code: 400,
        data: zIndex,
        para: allParams,
        meth: req.path,
        msg:"参数错误"
    });
  }

  utils.policiesLayer("参数检查",req);
  return next();
};