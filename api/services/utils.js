
function policiesLayer(desc,req) {

    //默认处理
    if (_.isUndefined(req)) {
        req = -1;
    }

    //默认处理
    if (_.isUndefined(req)) {
        desc = "正在执行"
    }


    //入口索引
    gIndex++;

    //访问标注
    if (req === -1) {
        sails.log.info("\n .....<" + desc + ">.....PoliciesIndex...." + gIndex + "........ \n");
    }else{
        sails.log.info("\n .....<" + desc + req.path + ">.....PoliciesIndex...." + gIndex + "........ \n");
    }
    
}

function policiesReset(desc,req) {

    //默认处理
    if (_.isUndefined(req)) {
        req = -1;
    }

    //默认处理
    if (_.isUndefined(req)) {
        desc = "正在执行"
    }

    //入口索引
    gIndex = 0;

    //访问标注
    if (req === -1) {
        sails.log.info("\n .....<" + desc + ">.....PoliciesIndex...." + gIndex + "........ \n");
    }else{
        sails.log.info("\n .....<" + desc + req.path + ">.....PoliciesIndex...." + gIndex + "........ \n");
    }
    
}

function policiesTheEnd(desc,req) {

    //默认处理
    if (_.isUndefined(req)) {
        req = -1;
    }

    //默认处理
    if (_.isUndefined(req)) {
        desc = "正在执行"
    }

    //入口索引
    gIndex = 0;

    //访问标注
    if (req === -1) {
        sails.log.info("\n .....<" + desc + req.path + ">.....Policies校验成功.......... \n");
    }else{
        sails.log.info("\n .....<" + desc + req.path + ">.....Policies校验成功.......... \n");
    }
    
}


'use strict';
function print (err, reply) {
    if (err) {
        // A error always begins with Error:
        console.log(err.toString());
    } else {
        console.log('Reply: ' + reply);
    }
}

var camelCase;
var msg_obj;
// Deep clone arbitrary objects with arrays. Can't handle cyclic structures (results in a range error)
// Any attribute with a non primitive value besides object and array will be passed by reference (e.g. Buffers, Maps, Functions)
// All capital letters are going to be replaced with a lower case letter and a underscore infront of it
function clone (obj) {
    var copy;
    if (Array.isArray(obj)) {
        copy = new Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        copy = {};
        var elems = Object.keys(obj);
        var elem;
        while (elem = elems.pop()) {
            // Accept camelCase options and convert them to snake_case
            var snake_case = elem.replace(/[A-Z][^A-Z]/g, '_$&').toLowerCase();
            // If camelCase is detected, pass it to the client, so all variables are going to be camelCased
            // There are no deep nested options objects yet, but let's handle this future proof
            if (snake_case !== elem.toLowerCase()) {
                camelCase = true;
            }
            copy[snake_case] = clone(obj[elem]);
        }
        return copy;
    }
    return obj;
}

function convenienceClone (obj) {
    camelCase = false;
    obj = clone(obj) || {};
    if (camelCase) {
        obj.camel_case = true;
    }
    return obj;
}

function gotolog(tag,obj) {

    var log = log || "";
    var tag = tag || "";

    var keys = keys || "";
    var vals = vals || "";

    keys = Object.keys(obj);
    vals = Object.values(obj);

    if(_.isArray(obj)){
        var arr = obj;
        keys = vals = "";
        for(var i = 0; i<arr.length; i++) {
            keys += Object.keys(arr[i]);
            vals += Object.values(arr[i]);
        }
    }

    console.log(tag,"\n",keys,"\n",vals);
};

function checkUserMobile(mobile) {
    return !/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(String(mobile))
};

function checkPicUrlIsNull(picurl) {
    return (/^\S+$/gi.test(picurl))
}
  
function sendGoodsDelNotice(param) {
    
    async
        .auto({
            queryMMsg: function (callback) {

                try {
                   
                    var skuObj = gcom.revertSku(param.sku);
                    var tbName = TAB_M_GOODS + skuObj.storeid;
                    var queryMMsg="select a.userid,a.storeid,b.username from " + tbName;
                    queryMMsg += " a left join adminuser b on a.userid=b.id where a.sku='";
                    queryMMsg += skuObj.sku + "'";

                    console.log('queryMMsg: check it out: ',queryMMsg);
                    MerchantMsg.query(queryMMsg,function (err,recond) {
                        if (err) {
                            console.log('err: sendGoodsDelNotice',err);
                            return;
                        }
                        if (recond instanceof Array) {
                            var _recond = recond.pop();
                            param.userid = _recond.userid;
                            param.rname = _recond.username;
                            param.storeid = _recond.storeid;
                        }
                        callback(err,recond);
                        console.log('cb_tag1: The result of this insert is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('queryMMsg err: ', e);
                }
            },

            createMMsg:['queryMMsg',  function (callback, result) {

                try {

                    //构造消息
                    var msg = msg || {};
                    msg.sendavatar = "";
                    msg.sid = param.id;
                    msg.type = param.type;
                    msg.rid = param.userid;
                    msg.title = param.title;
                    msg.rname = param.rname;
                    msg.rstore = param.storeid;
                    msg.sendname = param.sendname;
                    msg.detailbody = param.detailbody;
                    console.log('msg: check it out: ',msg);

                    MerchantMsg.create(msg).exec(function (err, recond) {
                        if (err) {
                            console.log('err: sendGoodsDelNotice',err);
                            return;
                        }
                        callback(err,recond);
                        console.log('cb_tag2: The result of this insert is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('createMMsg err: ', e);
                }
            }],
        }, function (err, results) {
            //console.log('rst: is ok ',results);
            if (results) {
                console.log('sendGoodsDelNotice ok ');
            }
        });
}

//HorizontalAlliances(异业联盟): HA
function sendHorizontalAlliancesNotice(param) {

    if (!_.isObject(param)) {
        console.log('err: sendHorizontalAlliancesNotice ', param);
        return;
    }

    async
        .auto({
            createMMsg: function (callback, result) {

                try {

                     //构造消息
                    var msg = msg || {};
                    msg.sendavatar = "";
                    msg.sid = param.id;
                    msg.rid = param.rid;
                    msg.type = param.type;
                    msg.title = param.title;
                    msg.rname = param.rname;
                    msg.rstore = param.storeid;
                    msg.sendname = param.sendname;
                    msg.detailbody = param.detailbody;
                    console.log('msg: check it out: ',msg);

                    MerchantMsg.create(msg).exec(function (err, recond) {
                        if (err) {
                            console.log('err: sendHorizontalAlliancesNotice ',err);
                            return;
                        }
                        callback(err,recond);
                        console.log('cb_tag2: The result of this insert is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('createMMsg err: ', e);
                }
            },
        }, function (err, results) {
            //console.log('rst: is ok ',results);
            if (results) {
                console.log('sendHorizontalAlliancesNotice ok ');
            }
        });
}


var SINGLE_QUOTE = /'|\\/g;
function escapeQuotes(str) {
  return str.replace(SINGLE_QUOTE, '\\$&')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\f/g, '\\f')
            .replace(/\t/g, '\\t');
}

function toQuotedString(str) {
  return '\'' + escapeQuotes(str) + '\'';
}

function test() {
    console.log('TAB_M_GOODS: ',TAB_M_GOODS); 
    console.log('TAB_C_GOODS: ',TAB_C_GOODS); 
}


function setDetailBody(param) {
    msg_obj = param;
}


function getDetailBody() {
    return JSON.stringify(msg_obj);
}

// function getType(type) {
//     var msg = {};
//     switch(type) {
//         case 0:
//             msg.title = ""
//             return ''
//     }
// }

module.exports = {
    escapeQuotes:escapeQuotes,
    print: print,
    clone: convenienceClone,
    sendNotice:sendGoodsDelNotice,
    sendHANotice:sendHorizontalAlliancesNotice,
    fn:test,
    log:gotolog,
    isMobile:checkUserMobile,
    setObj: setDetailBody,
    getObj: getDetailBody,
    isSpace: checkPicUrlIsNull,
    policiesReset:policiesReset,
    policiesLayer:policiesLayer,
    policiesTheEnd:policiesTheEnd,
};
