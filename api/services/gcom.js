
//const TAB_C_GOODS = "goodsList";
//const TAB_M_GOODS = "mergoodsList";

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);


var ownKeys = function(obj) {
    var keys = [];
    for (var key in obj) {
        if (objectHasOwnProperty(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var objectHasOwnProperty = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

const keys = ownKeys;

if (!Object.values) {
    Object.values = function values(O) {
        return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
    };
}

if (!Object.entries) {
    Object.entries = function entries(O) {
        return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
    };
}


Date.prototype.now = function() {
    return this.getTime();
};

/**
 * create goods components object
 *
 */
var gcom = module.exports = function() {
    console.log('create: function')
    return this;
};

/**
 * Initialize the internal goods components object
 *
 */
gcom.initialize = function() {
  console.log('initialize: function');
};


/**
 * Returns the value of all parameters sent in the request,
 * merged together into a single object. Includes parameters 
 * parsed from the url path.
 *
 * @param {object} allParams
 * @return {boolean} true or false  
 */
 gcom.isForbidden = function(allParams) {
    var o = Object.assign({},allParams);

    if (o.id) {
       var id = parseInt(o.id) || -1;
        if (_.isEqual(id,-1)) {
            return false;
        } 
    }

    for(var k in o ) {
        // if (o[k] === '') {
        //     return true;
        // }else
        if (o[k] === NaN) {
            return true;
        }else
        if (o[k] === null) {
            return true;
        }else
        if (o[k] === undefined) {
            return true;
        }
    }
    return false;
 };

 /**
 * 
 * Transfers control to a target instruction if 
 * value is '', a null reference, or NaN,undefined.
 * 
 *
 * @param {string} key
 * @return {map}  map  
 */
 gcom.isResetKey = function(k,map) {

   var forbidden = {'undefined':true, '':true, 'null':true, 'NaN':true};
    if ( forbidden[map.get(k)] ? true : false )  map.set(k,0);

    return map;
 };

/**
 * 
 * Synthesis of an array of strings
 * 
 *
 * @param {string} key
 * @return {map}  map  
 */
 gcom.hashToString = function(arr) {
    if (!Array.isArray(arr)) return false;

    var s = '',l = 0;
    while(l<arr.length) {
        s = l < arr.length -1 ? s += arr[l] + ':' : s += arr[l];
        l++;
    }

    return s;
 };


 /**
 * 
 * The client sent a list of items, analysis of how many 
 * child items
 *
 * @param {object} goods
 * @return {Array}  list  
 */
 gcom.analysisGoodsSeries = function(goods) {

    console.log('goods: check it out: ',goods);

    // goods list
    var goodsseries = [],self = this,type = goods.get('type');

    // this norms type,1 fist norms,2 sub norms
    const NORMS_TYPE = 1,SUB_NORMS_TYPE = 2; 

    //gets a set of specifications
    function getNorms(type,obj,subobj) {
        var arr = [];
        arr.push( obj.id );
        arr.push( obj.propertyid);

        
        if (type == 2) {
            arr.push( subobj.id );
            arr.push( subobj.propertyid );
        }
        //console.log('arr: check it out: ',arr.toString());
        return arr;
    }

    //create a list of goods,contains all the child goods
    var propertyrelated = (goods.get('propertyrelated'));
    //console.log('propertyrelated: check it out: ',propertyrelated);
    for( var i = 0;i<propertyrelated.length; i++ ) {

        var normsObj = propertyrelated[i];
        //normsObj.imgurl = '\'' + normsObj.imgurl +'\'';
        //var normsArr = (Object.entries(normsObj));
        var subObjMap = new Map(Object.entries(normsObj));
        //console.log('subObjMap: check it out: ',subObjMap);

        var children = subObjMap.get('children');
        //console.log('children: check it out: ',children);
        if ( children.length ) {

            for (var j = 0; j < children.length; j++) {

                 var childObj = children[j];
                 //console.log('childObj: check it out: ',childObj);
                 var subNormsMap = new Map(Object.entries(childObj));
                 //console.log('subNormsMap: check it out: ',subNormsMap);
                 var temp = getNorms(SUB_NORMS_TYPE,normsObj,childObj);

                 subNormsMap = self.isResetKey('stock',subNormsMap);
                 subNormsMap = self.isResetKey('price',subNormsMap);
                 //console.log('subNormsMap: check it out: ',subNormsMap);

                 var subgoods = new Map(goods);
                 //console.log('subgoods i: check it out: ', goods);
                 
                 subgoods.set('goodsseries',j === 0 ? 0 : 1);
                 subgoods.set('stock',subNormsMap.get('stock'));
                 subgoods.set('price',subNormsMap.get('price'));
                 subgoods.set('deposit',subNormsMap.get('deposit'));
                 subgoods.set('premoneey',subNormsMap.get('premoneey'));
                 subgoods.set('propertypic',subNormsMap.get('imgurl'));
                 subgoods.set('propertyrelated',self.hashToString(temp));
                 
                 subgoods.set('sku',goods.get('sku') + '-');
                 subgoods.set('sku',subgoods.get('sku') + normsObj.id);

                 subgoods.set('sku',subgoods.get('sku') + '-');
                 subgoods.set('sku',subgoods.get('sku') + childObj.id);

                 subgoods.set('pricepoint',subNormsMap.get('pricepoint'));

                 goods.set('stock',goods.get('stock') + parseInt(subgoods.get('stock')));
                 //console.log('stock: check it out: ', goods.get('stock'));
                 //console.log('sku: check it out: ', subgoods.get('sku'));

                 //特殊处理
                 var id = subNormsMap.get('goodsid') || -1;
                 if (id > -1) subgoods.set('id',id);

                 var storecategoryid  = subNormsMap.get('storecategoryid') || -1;
                 if (storecategoryid > -1) subgoods.set('storecategoryid',storecategoryid);

                 console.log('subgoods i: check it out: ',subgoods);
                 goodsseries.push(subgoods);
            }

        }else{

            var subgoods = new Map(goods);
            var temp = getNorms(NORMS_TYPE,normsObj,{});
            //console.log('subgoods e: check it out: ', subgoods);
            
            subObjMap = self.isResetKey('stock',subObjMap);
            subObjMap = self.isResetKey('price',subObjMap);

            subgoods.set('goodsseries',j === 0 ? 0 : 0);
            subgoods.set('stock',subObjMap.get('stock'));
            subgoods.set('price',subObjMap.get('price'));
            subgoods.set('deposit',subObjMap.get('deposit'));
            subgoods.set('premoneey',subObjMap.get('premoneey'));
            subgoods.set('propertypic',subObjMap.get('imgurl'));
            subgoods.set('pricepoint',subObjMap.get('pricepoint'));
            subgoods.set('propertyrelated',self.hashToString(temp));

            subgoods.set('sku',goods.get('sku') + '-');
            subgoods.set('sku',subgoods.get('sku') + normsObj.id);

            goods.set('stock',goods.get('stock') + parseInt(subgoods.get('stock')));
            //console.log('stock: check it out: ', goods.get('stock'));
            //console.log('sku: check it out: ', subgoods.get('sku'));

            //特殊处理
            var id = subObjMap.get('goodsid') || -1;
            if (id > -1 ) subgoods.set('id',id);

            var storecategoryid  = subObjMap.get('storecategoryid') || -1;
            if (storecategoryid >-1) subgoods.set('storecategoryid',storecategoryid);
            

            console.log('subgoods e: check it out: ',subgoods);
            goodsseries.push(subgoods);
        }
    }

    goods.set('propertyrelated',0);
    goodsseries.push(goods);

    return goodsseries;
 };
 
 /**
 * 
 * As you can see that method converted the map to string,
 * all of the elements of map and tbName combined into a mysql, 
 * it returns a string of mysql statement.  
 *
 * @param {map} map
 * @return {String}  tbName  
 */
 gcom.insertSql = function(map,tbName) {
    //console.log('key: check it out: ',map);
    if (!map.size || !map) {
        return '';
    }


    //special value
    var toString = function(iter) {
        return '"' + (iterVal.next().value).toString().replace(/"/g, '\\"') + '"';
    };
    var insertSql = '',i;
    var iterKey = map.keys();
    var iterVal = map.values();

    i = map.size;
    var k = '',v = '';

    insertSql += 'INSERT INTO ' + tbName + ' ' + '(';
    while(i--) k = i>0 ? k += iterKey.next().value + ',': k += iterKey.next().value ;

    insertSql += ' ' + k;

    i = map.size;
    while(i--) v = i>0 ? v +=  toString(iterVal) + ',' : v += toString(iterVal);
       
    insertSql += ') VALUES (' + v + ')';

    console.log('insertSql: check it out: ',insertSql);
    return insertSql;
};

 /**
 * 
 * As you can see that method converted the map to string,
 * all of the elements of map and tbName combined into a mysql, 
 * it returns a string of mysql statement.  
 *
 * @param {map} map
 * @return {String}  tbName  
 */
gcom.getMysqlTable = function(typeString,storeid) {

    try {

        if (!parseInt(storeid)) 
            throw new TypeError('getMysqlTable', "gcom.js", 265);
        else
            return typeString + storeid;

    }catch (e) {
        console.log('getMysqlTable err: ',e);
    }

 };


/**
 * 
 * SKU is a series of commodity code,it is composed of 
 * a random number, storeid, timestamp pieced together a string.
 *  
 * @param {string} sku
 * @return {Object} obj   
 */
gcom.revertSku = function(sku) {

    try {
        
        var skuarr = sku.split('-'), obj = {};
        for(var i = 0; i<skuarr.length; i++) {
            obj.randomNum = skuarr[0];
            obj.storeid = skuarr[1];
            obj.timestamp = skuarr[2];

            //第一规格
            if (i==3) obj.a_proid = parseInt(skuarr[3]);

            //第二规格
            if (i==4) obj.b_proid = parseInt(skuarr[4]);

            //SKU还原
            if (i == 0) {
                obj.sku = "";
                obj.sku += obj.randomNum
                obj.sku += "-";
                obj.sku += obj.storeid;
                obj.sku += "-";
                obj.sku += obj.timestamp;
            }
        }
        

        return obj;

    }catch (e) {
        console.log('revertSku err: ',e);
    }

 };

 /**
 * 
 * obj is an object that you want to filter, obj contains all 
 * of the key-map
 *  
 * @param {Object} obj
 * @return {Map}  map   
 */
gcom.filterMap = function(obj,map) {
    var o = Object.assign({},obj);
    for(var k in o) map.delete(k.toString());  
    return map;
 };

/**
 * 
 * All of the fields in the obj parameter is the details of the commodity.
 * it deletes all things details contained within obj,the Obj, you need to 
 * call the filterMap function before you can get the information you need.
 *  
 * @param {Object} obj
 * @return {Object}  obj   
 */
gcom.remainGoodsParam = function(obj) {
    var details = {
        "p1":true,"p2":true,"p3":true,"id":true,"sku":true,
        "name":true,"price":true,"video":true,"stock":true,
        "weight":true,"userid":true,"status":true,"storeid":true,
        "brandid":true,"keywords":true,"parentid":true,"reserve1":true,
        "reserve2":true,"reserve3":true,"reserve4":true,"reserve5":true,
        "reserve6":true,"reserve7":true,"reserve8":true,"reserve9":true,
        "reserve10":true,"useralias":true,"createdAt":true,"attachment":true,
        "detailbody":true,"pricepoint":true,"goodsseries":true,"propertypic":true,
        "recommend":true,"type":true,"deposit":true,"premoneey":true,"presaledescript":true,
        "imagedefault":true,"childcategory":true,"parentcategory":true,"pricepromotion":true,
        "presaleendtime":true,"presaleflow":true,"presaleflowdescript":true,"propertyrelated":true,
        "storecategoryid":true,"propertyvaluelist":true,'precustomerserivice':true,'presubtitle':true,
        "presalestarttime":true,
    };

    //特殊字段
    //details['presalestarttime'] = true;
    //details['servicetelephone'] = true;

    var o = Object.assign({},details);
    for(var k in obj) delete o[k];

    return o;
 };


 /**
 * 
 * A star time,end time B, T is boolean, it is a Boolean value, true that gets the time stamp for Today, 
 * false timestamp representing the Get a. this function is to caclulate the numbe of milliseconds
 * between them,finally,returns a timestamp.   
 * 
 * @param {Boolean} t
 * @param {Date} a
 * @param {Date} b
 * @return {Date}  p   
 */
gcom.calcPretime = function(t,a,b) {
    try {
        var p, tt, tb, st, et;
        b = b ? b : a;
        tb = t ? true : false;
        tt = new Date().getTime();
        st = b ? new Date(a).getTime() : tt;
        et = b ? new Date(b).getTime() : 0;
        return  (p = tb ? et - tt : et - st) > 0 ? p : 0;
    }catch (e) {
        console.log('calcPretime err: ',e);
    }
 };

/**
 *
 *  this is a function that refreshes the state of goods,hashkey contains   
 *  id,storeid,type,storecategoryid these parameters,they must in order to 
 *  obtain the array.
 *
 *  @param {String} hashkey 
 */
gcom.updatePreGoods = function(hashkey) {
     try {

        console.log('updatePreGoods: This is the function entry.');
       var _hashkey = hashkey.toString(),self = this;
       if (typeof(_hashkey) == 'string') {

            async.auto({
                setGoodsSeries: function (callback, result) {

                    try {

                        var arr = _hashkey.split(':');
                        var obj = obj || {};
                        obj.id = arr[0];
                        obj.sku = arr[4];
                        obj.type = arr[2];
                        obj.storeid = arr[1];
                        obj.storecategoryid = arr[3];
                        

                        var tb_M_Name = self.getMysqlTable(TAB_M_GOODS,obj.storeid);

                        var setMGoodsSql = '';
                        setMGoodsSql += 'update ' + tb_M_Name;
                        setMGoodsSql += ' set status = 2 where sku like \'' + sku + '%\'';
                        console.log('setMGoodsSql: check it out: ', setMGoodsSql);

                        Creator.query(setMGoodsSql, function (err, list) {
                            if (err) return;
                            console.log('setMGoodsSql: The result of this query is shown came out. check it out: ok');
                        });

                    } catch (e) {
                      console.log('setGoodsSeries err: ',e);
                    }
                },

                serchParent: function (callback) {

                    try {

                        var queryCGoodsSql = 'select id from goodscategory where parentid = 0';
                        console.log('queryCGoodsSql: check it out: ',queryCGoodsSql);

                        Goodscategory.query(queryCGoodsSql, function query(err, list) {
                            if (err) return;
                            var hidlist = [];
                            while(list.length>0){
                                var item = list.pop();
                                hidlist.push(item.id);
                            }
                            callback(err, hidlist);
                            console.log('queryCGoodsSql: The result of this query is shown came out. check it out: ok');
                        });


                    } catch (e) {
                        console.log('serchParent err: ', e);
                    }
                },

                setCGoods: ['serchParent', function (callback, result) {

                    try {

                        var counter = [],listgoods = [];
                        var listparent = result.serchParent || [];

                        var doneCounter = function (err,list) {
                            if (listparent.length == 0) {
                                callback(err,list);
                            }
                        };
                        console.log('len: ',listparent.length);
                        while(listparent.length>0) {

                            try {
                                var arr = _hashkey.split(':');
                                var obj = obj || {};
                                obj.id = arr[0];
                                obj.type = arr[2];
                                obj.storeid = arr[1];
                                obj.storecategoryid = arr[3];

                                var parentid = listparent.pop();
                                var tbName = self.getMysqlTable(TAB_C_GOODS,parentid);

                                var setCGoodsSql = '';
                                setCGoodsSql += 'update ' + tbName;
                                setCGoodsSql += ' set status = 2 where sku like \'' + sku + '%\'';
                                console.log('setCGoodsSql: check it out: ', setCGoodsSql);

                                Creator.query(setCGoodsSql, function (err, list) {
                                    if (err) return;
                                    doneCounter(err,list)
                                    console.log('setCGoodsSql: The result of this query is shown came out. check it out: ok');
                                });

                            } catch (e) {
                              console.log('err: setCGoods',e);
                            }
                        }
                    } catch (e) {
                        console.log('setCGoods err: ', e);
                    }
                }],
            }, function(err, results) {
                io.gotoQueryGoods(skuObj.sku);
                console.log('**********************************');
                console.log('updatePreGoods function terminates');
                console.log('**********************************')
            });
       } else {
            console.log('updatePreGoods key: ',typeof(key));
       }

    }catch (e) {
        console.log('updatePreGoods err: ',e);
    }
 };

/**
 *
 *  this is one of the original function of goods, mergoodslist   
 *  contains many object,each object is made up id,sku,type,storeid,
 *  presaleendtime,storecategoryid these parameters.
 *  
 *  @param {Array} mergoodslist 
 */
gcom.initShopsPresale = function(tb_m_name) {
     try {

        if (tb_m_name == 'mergoodsList0') {
            console.log('administrator action');
            return;
        }

        var queryMGoodsSql = 'select id,sku,type,storeid,presaleendtime,storecategoryid from ';
        queryMGoodsSql += tb_m_name + ' where goodsseries = 0 and type = 2 and status = 3';
        console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);

        Creator.query(queryMGoodsSql, function (err, list) {
            if (err) return;
            var prelist = [];
            while(list.length>0) {
                var e = list.pop();
                var temp = {};
                temp.id = e.id;
                temp.sku = e.sku;
                temp.type = e.type;
                temp.storeid = e.storeid;
                temp.presaleendtime = e.presaleendtime;
                temp.storecategoryid = e.storecategoryid;
                console.log('sku: check it out: ',e.sku);
                prelist.push(temp);
            }
            if (prelist.length) {
                console.log('\n-----initShopsPresale::schedule-------\n')
                utils2.startTiming(prelist);
                console.log('\n-----initShopsPresale::schedule--------\n')
            }
            console.log('initShopsPresale: The result of this query is shown came out. check it out: ok');
        });

    }catch (e) {
        console.log('initShopsPresale err: ',e);
    }
 };
 
 /**
 *
 *  这个函数是过滤用户传过来的所有参数，可以是空对象，
 *  如果参数中有undefined,null,NaN都返回true,返回false
 *  表示参数全部通过检测，可以继续访问。
 *  
 *  @param {session} session
 */
 gcom.isPass = function(allParams) {
    var allparams = Object.assign({},allParams);
    return this.isForbidden(allparams);
 };


 /**
 *
 *  这个函数检测对象是否为空，如果对象为空，返回false。
 *  这里面只是要有一个对象，否则都是为false,如果要过滤
 *  用户传过来的参数是否为空，可以调用此函数检查。
 *  
 *  @param {session} session
 */
 gcom.isValid = function(allParams) {
    var allparams = Object.assign({},allParams);
    var keycount = 0;
    for(var key in allparams) {
        keycount = keycount + 1;
    }
    return keycount===0 ? true : false;
 };
 
 /**
 *
 *  这个函数是检测session是否为空，如果为空返回true,否则false.
 *  这个函数用于检测用户登录，如果为空表示没有登录。
 *  
 *  @param {session} session
 */
 gcom.isMine = function(session) {
    if (!session) {
        return true;
    }
    return false;
 };


/**
 *
 *  这个函数是检测session里面存储的storeid是不是管理员，如果
 *  storeid为0返回true,反之为false. 如果要检查是否是管理员可
 *  以调用这个函数
 *  
 *  @param {session} session
 */
gcom.isAdmin = function(session) {
    var mesession = Object.assign({},session);
    if (!mesession) {
        return true;
    }
    return mesession.storeid ===0?true:false;
};

/**
 *
 *  这是一个检查是否可以继续访问的函数，他可以检查是否登录，
 *  参数错误，参数为空，管理员操作，权限不足，如果你需要检查
 *  用户是否登录，请在map里面set把他的key值设置为mine_check,
 *  value除了-1以为可以是任何数值，如果你要检测参数是否为空
 *  请把valid_check在map里设置即可，admin_check ！==-1,如果
 *  你要检查是否是管理员操作，admin_check同上，如果你要检查
 *  当前用户是否有权限，把adminid_check设置即可。是的，他们都
 *  不能为-1,并且你还要把商品的SKU传过来，在map里面设置,参考
 *  eg：mpa.set('sku','U5OP-4-1478747472954')。
 *  
 *  @param {req} req
 *  @param {res} res
 *  @param {Map} map
 */
gcom.isAccess = function(req,res,map) {
    
    console.log('isAccess. check it out. ',req.path);
    
    if (!map || !map.size) {
        throw new TypeError('isAccess', "gcom.js", 648);
        return;
    }

    var self = this;
    const _MINE_CHECK = map.get('MINE_CHECK') || -1;
    const _PASS_CHECK = map.get('PASS_CHECK') || -1;
    const _VALID_CHECK = map.get('VALID_CHECK') || -1;
    const _ADMIND_CHECK = map.get('ADMIND_CHECK') || -1;
    const _OPTION_CHECK = map.get('OPTION_CHECK') || -1;
    const _FORBID_ADMIN = map.get('_FORBID_ADMIN') || -1;
    const _ADMINDID_CHECK = map.get('ADMINDID_CHECK') || -1;
    const _SERCURITY_CHECK = map.get('SERCURITY_CHECK') || -1;
    

    if (_MINE_CHECK !== -1) {
        console.log('登录验证开启: √');
    }

    if (_PASS_CHECK !== -1) {
        console.log('参数过滤开启: √');
    }

    if (_VALID_CHECK !== -1) {
        console.log('空对象过滤开启: √');
    }

    if (_ADMIND_CHECK !== -1) {
        console.log('管理员身份验证开启: √');
    }

    if (_OPTION_CHECK !== -1) {
        console.log('控制器检查开启: √');
    }

    if (_ADMINDID_CHECK !== -1) {
        console.log('管理员ID验证开启: √');
    }

    if (_SERCURITY_CHECK !== -1) {
        console.log('安全检查开启: √');
    }

    if (_FORBID_ADMIN !== -1) {
        console.log('限制管理员开启: √');
    }

    // console.log('_MINE_CHECK: ', _MINE_CHECK);
    // console.log('_PASS_CHECK: ', _PASS_CHECK);
    // console.log('_VALID_CHECK: ', _VALID_CHECK);
    // console.log('_ADMIND_CHECK: ', _ADMIND_CHECK);
    // console.log('_OPTION_CHECK: ', _OPTION_CHECK);
    // console.log('_ADMINDID_CHECK: ', _ADMINDID_CHECK);
    // console.log('_SERCURITY_CHECK: ', _SERCURITY_CHECK);


    var option = req.options;
    var mine = req.session.mine;
    var allParams = req.allParams();


    var skuObj = skuObj || -1;
    if (typeof(allParams.sku) === 'string') {
        skuObj = self.revertSku(allParams.sku);
    }

    if (_MINE_CHECK !== -1&&self.isMine(mine)) {

        /**
        * isMine 检测session是否存在当前用户，如果session
        * 为空，表示当前用户没有登录，返回一个Msg:'用户未登录'
        * 
        */

        return self.resJson(res,{
            msg:'用户未登录'
        })
    }

    if (_PASS_CHECK !== -1&&self.isPass(allParams)) {

        /**
        * isPass 检测客户端传过来的所有参数，默认是可以{},
        * {}没有参数默认是通过，若要检测{},请调用isValid方法.
        * 若是undefined,NaN,返回一个Msg: '参数错误'
        */

        return self.resJson(res,{
            msg:'参数错误'
        }) 
    }

    if (_VALID_CHECK !== -1&&self.isValid(allParams)) {

        /**
        * isValid 检测客户端传过来的所有参数并且不能是{},
        * 如果是{}，返回一个Msg: '参数为空'，isValid检测
        * 比较严格，{}必须要有内容。
        */

        return self.resJson(res,{
            msg:'参数为空'
        })  
    }

    if (_ADMIND_CHECK !== -1&&self.isAdmin(mine)) {

        /**
        * isAdmin 检测session是否是管理员，如果要限制管理员
        * 操作或检测管理员越界操作。返回一个Msg:'管理员您好'
        * 
        */

        return self.resJson(res,{
            msg:'管理员您好'
        }) 
    }

    if (_OPTION_CHECK !== -1) {

        /**
        * option_check 默认非-1值，如果为 -1，表示不检查。
        * 如果req.options方法为null,表示请求无效，会返回一个
        * Msg:'未知请求'.
        * 
        */

        //console.log('option. check it out. ',option,'\n skuObj. check it out. ',skuObj);
        if (!option) {
           return self.resJson(res,{
                msg:'未知请求'
            })  
        }
    }

    if (_ADMINDID_CHECK !== -1) {

        /**
        * adminid_check 默认非-1值，如果为 -1，表示不检查。
        * 要执行这个检查，请在map里面设置sku，这个检查非管
        * 理员人员越界操作，如果不是管理员操作，会返回一个
        * Msg:'权限不足'.
        * 
        */

        console.log('mine. check it out. ',mine,'\n skuObj. check it out. ',skuObj);
        var mine_id = parseInt(mine.storeid); 
        var storeid = parseInt(skuObj.storeid);

        if (mine_id>0&&mine_id!=storeid) {
           return self.resJson(res,{
                msg:'权限不足'
            })  
        }
    }

    if (_SERCURITY_CHECK !== -1) {

        /**
        * sercurity_check 默认非-1值，如果为 -1，表示不检查。
        * 要执行这个检查，请在map里面设置 sercurity_check，这
        * 这个输入不能包含非法字符，如果有非法字符输入，则提示
        * Msg:'非法字符'.
        * 
        */

        //console.log('mine. check it out. ',mine,'\n skuObj. check it out. ',skuObj);
        // var valArray = Object.values(allParams);
        // for(var i = 0; i<valArray.length; i++) {
        //     var val = valArray[i];
        //     if (self.againstInjecting(val)) {
        //         return self.resJson(res,{
        //             msg:'非法字符'
        //         })  
        //     }
        // }
    }

    if (_FORBID_ADMIN !== -1) {

        /**
        * _FORBID_ADMIN 默认非-1值，如果为 -1，表示不检查。
        * 要执行这个检查，请在map里面设置 FORBID_ADMIN，这
        * 个限制管理员身份操作商户后台数据，如果是管理员则提示
        * Msg: '禁止操作'。
        * 
        */

        var mine_id = parseInt(mine.storeid); 
        if (mine_id === 0) {
           return self.resJson(res,{
                msg:'禁止操作'
            })  
        }
    }

    const code = 200;
    console.log('code: 200');
    /**
    * code：200检测通过，可以继续访问
    */
    
    return code;
};

/**
 *
 *  这个集中处理访问接口（isAccess）返回的信息，
 *  如果有检查条件不通过，会返回一个json,它包含
 *  code:400,data:[],msg:ojb.msg信息。
 *  
 *  @param {req} req
 *  @param {res} res
 *  @param {Map} map
 */
gcom.resJson = function(res,obj) {
    return res.json({
        code: 400,
        data: [],
        msg:obj.msg
    });
};


/**
 *
 *  this is one of the original function of goods, mergoodslist   
 *  contains many object,each object is made up id,sku,type,storeid,
 *  presaleendtime,storecategoryid these parameters.
 *  
 *  @param {Array} listsku 
 */
gcom.delGoodsNorms = function(listsku) {

    console.log('delGoodsNorms: This is the function entry. check it out: ', listsku);

    if (!listsku) {
        return true;
    }

    try {   
            var self = this;
            if (listsku instanceof Array) {   

                async.auto({  
                    querySeller: function (callback, result) {

                        try {

                            //查询所有商户id
                            var querySellerSql = 'select id from accountseller';
                            console.log('querySellerSql: check it  out.',querySellerSql);
                            Accountseller.query(querySellerSql,function(err, list) {
                                if (err) return;
                                callback(err,list);
                                console.log("cb_tag1: The result of this \' query \' is shown came out. check it out. ",list.length);
                            });

                        } catch (e) {
                          console.log('err: querySeller',e);
                        }
                    },

                    queryMGoods:['querySeller', function (callback, result) {

                        try {

                            console.log('querySeller: check it out. ',result.querySeller.length);
                            var sellerlist = result.querySeller || [];

                            var doneCounter = function (err,list) {
                                
                                if (!sellerlist.length) {
                                    callback(err,list);
                                }
                            };

                            while(sellerlist.length > 0) {

                                var seller = sellerlist.pop();
                                var storeid = seller.id;
                                

                                for(var i = 0; i<listsku.length; i++) {

                                    var sku = listsku[i];
                                    var tb_M_Name = self.getMysqlTable(TAB_M_GOODS,storeid);
                                    var setMGoodsSql = 'update ' + tb_M_Name + ' set status = 2 where sku like "' + sku + '%"' ;

                                    //查询所有商户同规格的商品
                                    console.log('setMGoodsSql: check it out. ',setMGoodsSql);
                                    Creator.query(setMGoodsSql, function (err, recond) {
                                        if (err) return;
                                        doneCounter(err,recond);
                                        console.log("cb_tag2: The result of this \' query \' is shown came out. check it out. ok");
                                    });
                                }
                            }

                        } catch (e) {
                          console.log('err: queryMGoods',e);
                        }
                    }],

                    queryCategory:function (callback, result) {

                        try {

                            //查询所有最高级父类ID
                            var queryCategorySql = 'select id from goodscategory where parentid = 0';
                            console.log('queryCategorySql: check it out: ',queryCategorySql);

                            Goodscategory.query(queryCategorySql,function (err, list) {
                                if (err) return;
                                console.log('cb_tag3: The result of this \' find \' is shown came out. check it out:  ', list.length);
                                callback(err,list);
                            });

                        } catch (e) {
                          console.log('err: queryCategory',e);
                        }
                    },

                    queryCGoods:['queryCategory', function (callback, result) {

                        try {

                            //console.log('queryCategory: check it out. ',result.queryCategory.length);
                            var listcategory = result.queryCategory || [];

                            var doneCounter = function (err,list) {
                                
                                if (!listcategory.length) {
                                    listsku = undefined;
                                    callback(err,list);
                                }
                            };

                            while(listcategory.length > 0) {

                                var item = listcategory.pop();
                                var parentid = item.id;

                                for(var i = 0; i<listsku.length; i++) {

                                    var sku = listsku[i];
                                    var tb_C_Name = self.getMysqlTable(TAB_C_GOODS,parentid);
                                    var setCGoodsSql = 'update ' + tb_C_Name + ' set status = 2 where sku like "' + sku + '%"' ;

                                    //查询所有商户同规格的商品
                                    console.log('setCGoodsSql: check it out. ',setCGoodsSql);
                                    Creator.query(setCGoodsSql, function (err, recond) {
                                        if (err) return;
                                        console.log("cb_tag4: The result of this \' query \' is shown came out. check it out. ok");
                                        doneCounter(err,recond);
                                    });
                                }
                            }

                        } catch (e) {
                          console.log('err: queryCGoods',e);
                        }
                    }],

                }, function(err, results) {
                    console.log('**********************************');
                    console.log('delGoodsNorms function terminates');
                    console.log('**********************************')
                });
            }

    }catch (e) {
        console.log('delGoodsNorms err: ',e);
    }

    return true;
 };

 /**
 *
 *  this is one of the original function of goods, mergoodslist   
 *  contains many object,each object is made up id,sku,type,storeid,
 *  presaleendtime,storecategoryid these parameters.
 *  
 *  @param {Array} listproval 
 */
gcom.delNormsVal = function(listsku) {

    console.log('delNormsVal: This is the function entry. check it out: ', listsku);
    if (!listsku) {
        return true;
    }
    
    try {

        var self = this;
        if (listsku instanceof Array) {   

            async.auto({

                querySeller: function (callback, result) {

                    try {

                        //查询所有商户id
                        var querySellerSql = 'select id from accountseller';
                        console.log('querySellerSql: check it  out.',querySellerSql);
                        Accountseller.query(querySellerSql,function(err, list) {
                            if (err) return;
                            callback(err,list);
                            console.log("cb_tag1: The result of this \' query \' is shown came out. check it out. ",list.length);
                        });

                    } catch (e) {
                      console.log('err: querySeller',e);
                    }
                },

                queryMGoods:['querySeller', function (callback, result) {

                    try {

                        console.log('querySeller: check it out. ',result.querySeller.length);
                        var sellerlist = result.querySeller || [];

                        var doneCounter = function (err,list) {
                            
                            if (!sellerlist.length) {
                                callback(err,list);
                            }
                        };

                        while(sellerlist.length > 0) {

                            var seller = sellerlist.pop();
                            var storeid = seller.id;
                            

                            for(var i = 0; i<listsku.length; i++) {

                                var sku = listsku[i];
                                var tb_M_Name = self.getMysqlTable(TAB_M_GOODS,storeid);
                                var setMGoodsSql = 'update ' + tb_M_Name + ' set status = 2 where sku like "' + sku + '%"' ;

                                //查询所有商户同规格的商品
                                console.log('setMGoodsSql: check it out. ',setMGoodsSql);
                                Creator.query(setMGoodsSql, function (err, recond) {
                                    if (err) return;
                                    doneCounter(err,recond);
                                    console.log("cb_tag2: The result of this \' query \' is shown came out. check it out. ok");
                                });
                            }
                        }

                    } catch (e) {
                      console.log('err: queryMGoods',e);
                    }
                }],

                queryCategory:function (callback, result) {

                    try {

                        //查询所有最高级父类ID
                        var queryCategorySql = 'select id from goodscategory where parentid = 0';
                        console.log('queryCategorySql: check it out: ',queryCategorySql);

                        Goodscategory.query(queryCategorySql,function (err, list) {
                            if (err) return;
                            console.log('cb_tag3: The result of this \' find \' is shown came out. check it out:  ', list.length);
                            callback(err,list);
                        });

                    } catch (e) {
                      console.log('err: queryCategory',e);
                    }
                },

                queryCGoods:['queryCategory', function (callback, result) {

                    try {

                        //console.log('queryCategory: check it out. ',result.queryCategory.length);
                        var listcategory = result.queryCategory || [];

                        var doneCounter = function (err,list) {
                            
                            if (!listcategory.length) {
                                listsku = undefined;
                                callback(err,list);
                            }
                        };

                        while(listcategory.length > 0) {

                            var item = listcategory.pop();
                            var parentid = item.id;

                            for(var i = 0; i<listsku.length; i++) {

                                var sku = listsku[i];
                                var tb_C_Name = self.getMysqlTable(TAB_C_GOODS,parentid);
                                var setCGoodsSql = 'update ' + tb_C_Name + ' set status = 2 where sku like "' + sku + '%"' ;

                                //查询所有商户同规格的商品
                                console.log('setCGoodsSql: check it out. ',setCGoodsSql);
                                Creator.query(setCGoodsSql, function (err, recond) {
                                    if (err) return;
                                    console.log("cb_tag4: The result of this \' query \' is shown came out. check it out. ok");
                                    doneCounter(err,recond);
                                });
                            }
                        }

                    } catch (e) {
                      console.log('err: queryCGoods',e);
                    }
                }],

            }, function(err, results) {
                console.log('**********************************');
                console.log('delNormsVal function terminates');
                console.log('**********************************')
            });
        }

    }catch (e) {
        console.log('delNormsVal err: ',e);
    }

    return true;
 };

 /**
 *
 *  这个函数用来合成商城管理配置的数据，把商户选择好的SKU按顺序存储 
 *  classify这个数组存储了很多个对象，每个对象里面包含了两个元素，sku
 *  和sortorder，把合成的结果返回回去。
 *  
 *  @param {String} string 
 */
gcom.hashSku = function(classify){
    var str = '';
    for(var i = 0;i<classify.length;i++){
        var obj = classify[i];

        str += obj.sku+'[.]';
        str += obj.sortorder;
        if (i < classify.length -1) {
            str+='|';
        }
    }
    return str;
};

/**
 *
 *  这个函数用来删除预售商品通知，删除预售商品后调用这个接口会存储
 *  一条信息到数据库，登陆后会去获取这个表的信息，就可以在前端页面
 *  看到该消息的内容。
 *  
 *  @param {String} string 
 */
gcom.delPreGoods = function(sku) {
    presellgoodsmsg.destroy({ sku:sku }).exec(function (err,recond) {
        if(err) return;
        console.log('cb_tag1: The result of this query is shown came out. check it out: ok');
    });
};


 gcom.setCache = function(temp) {
    this.meCache = temp;
 };

 gcom.getCache = function() {
    return this.meCache;
 };

 gcom.cTime = function(k) {
    k = k || new Date();
    return (new Date(k)).Format("yyyy-MM-dd hh:mm:ss.S")
 };

 gcom.setGoodsArray = function(classify,data) {
    this.mGoodsArray = {};
    this.mGoodsArray[classify] = data;
 };

 gcom.getGoodsPage = function(classify,page) {
    this.mGoodsArray = this.mGoodsArray || {};
    var ADD_GOODS = 6,pageArray = [],counter = 0;
    var goodsArray = this.mGoodsArray[classify] || [];
    
    var prevPage = (parseInt(page) + 0) * ADD_GOODS;
    var nextPage = (parseInt(page) + 1) * ADD_GOODS; 
    
    for(var i=prevPage; i<nextPage; i++) {
        var goods = goodsArray[i];
        if (!gcom.isForbidden({goods})) {
            pageArray[counter++] = goodsArray[i];
        }
    }

    console.log('nextPage. check it out. ',pageArray.length);
    return pageArray;
 };

 gcom.getNowPage = function(classify,page) {

    if (parseInt(page)!==0) {
        console.log('now isn\'t the first page');
        return [];
    }

    var ADD_GOODS = 6,pageArray = [];
    this.mGoodsArray = this.mGoodsArray || {};
    var goodsArray = this.mGoodsArray[classify] || [];

    for(var i=0; i<ADD_GOODS; i++) {
        var goods = goodsArray[i];
        if (!gcom.isForbidden({goods})) {
            pageArray[i] = goodsArray[i];
        }
    }

    console.log('firstPage. check it out. ',pageArray.length);
    return pageArray;
 };

 gcom.calcPageCount = function(classify) {
    this.mGoodsArray = this.mGoodsArray || {};
    var goodsArray = this.mGoodsArray[classify] || [];
    var ADD_GOODS = 6, allPage = 0;

    if (goodsArray.length%ADD_GOODS>0&&goodsArray.length>0) {
        allPage = parseInt(goodsArray.length/ADD_GOODS) + 1;
    }

    if (goodsArray.length%ADD_GOODS === 0&&goodsArray.length>0) {
        allPage = parseInt(goodsArray.length/ADD_GOODS);
    }

    console.log('allPage. check it out. ',allPage);
    return allPage;
 };

 gcom.queryTestSku = function(list) {
    
    var querySkuSql = '';
    if (list instanceof Array) {
        for(var i = 0; i<list.length; i++) {
            querySkuSql += "sku like '" + list[i] +"%'"; 
            querySkuSql += " and goodsseries = 0"; 
            querySkuSql +=  i === list.length - 1 ? "" : " or "; 
        }  
    }
    return querySkuSql;
};

gcom.querySku = function(list) {
    
    var querySkuSql = '';
    if (list instanceof Array) {
        for(var i = 0; i<list.length; i++) {
            querySkuSql += "sku like '" + list[i].sku +"%'"; 
            querySkuSql += " and goodsseries = 0"; 
            querySkuSql +=  i === list.length - 1 ? "" : " or "; 
        }  
    }
    return querySkuSql;
};

gcom.againstInjecting = function(serch) {
    
    if (!_.isString(serch)) {
        return false;
    }else{
         //过滤URL非法SQL字符
        var sUrl = serch;
        var sQuery = sUrl.substring(sUrl.indexOf("=")+1);
        re=/select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
        if(re.test(sQuery)){
            return true;
        }
        return false;
    }
};