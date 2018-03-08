
/**
 * create seller components object
 *
 */
var seller = module.exports = function() {
    console.log('create: function')
    return this;
};

/**
 * sets the items in the array
 *
 */
seller.setStore = function(array) {
    this.mStoreArray = array;
    console.log('\n**********************************\n');
    console.log('setStore: ',this.mStoreArray.length);
    console.log('\n**********************************\n');

};

/**
 * gets the items in the array
 *
 */
seller.getStore = function() {
    return this.mStoreArray;
};

/**
 * gets the items in the array
 *
 */
seller.getStoreArray = function() {
    
    var storeArray;
    for(var i = 0; i<this.mStoreArray.length; i++) {
    	var s = this.mStoreArray[i];
    	storeArray = storeArray || {};
    	storeArray[s.id] = s.nickname;
    }

    return storeArray || {};
};

/**
 * sets the items in the array
 *
 */
seller.setCCategory = function(array) {
    this.mCCategoryArray = array;
    console.log('\n******************************************\n');
    console.log('setCCategory: ',this.mCCategoryArray.length);
    console.log('\n******************************************\n');
};

/**
 * push the items in the array
 *
 */
seller.pushCCategory = function(item) {
    this.mCCategoryArray.push(item);
    console.log('\n******************************************\n');
    console.log('pushCCategory: ',this.mCCategoryArray.length);
    console.log('\n******************************************\n');
};


/**
 * gets the items in the array
 *
 */
seller.getCCategory = function() {
    var ccategoryArray;
    for(var i = 0; i<this.mCCategoryArray.length; i++) {
        var c = this.mCCategoryArray[i];
        if (c.isdelete>0){
            continue;
        }else{
            ccategoryArray = ccategoryArray || [];
            ccategoryArray[ccategoryArray.length] = c; 
        }
    }
    return ccategoryArray || [];
};


/**
 * gets the items in the array
 *
 */
seller.getCCategoryArray = function() {

    var ccategoryArray;
    for(var i = 0; i<this.mCCategoryArray.length; i++) {
    	var c = this.mCCategoryArray[i];
    	ccategoryArray = ccategoryArray || {};
    	ccategoryArray[c.id] = c.categoryname;
    }
    return ccategoryArray || {};
};

/**
 * gets the items in the array
 *
 */
seller.getAdminCCParentArray = function() {
    var ccparentArray;
    for(var i = 0; i<this.mCCategoryArray.length; i++) {
        var c = this.mCCategoryArray[i];
        if (c.parentid > 0){
            continue;
        }else{
            ccparentArray = ccparentArray || {};
            ccparentArray[c.id] = c.categoryname;
        }
    }
    return  ccparentArray || {};
};

/**
 * gets the items in the array
 *
 */
seller.getSellerCCParentArray = function() {
    var ccparentArray;
    for(var i = 0; i<this.mCCategoryArray.length; i++) {
        var c = this.mCCategoryArray[i];
        if (c.parentid > 0 || c.isdelete>0){
            continue;
        }else{
            ccparentArray = ccparentArray || {};
            ccparentArray[c.id] = c.categoryname;
        }
    }
    return  ccparentArray || {};
};

/**
 * gets the items in the array
 *
 */
seller.findCCategoryName = function(id) {
    var ccategoryArray = this.getCCategoryArray();
    return ccategoryArray[id] ? ccategoryArray[id] : "";
};

/**
 * gets the items in the array
 *
 */
seller.isCCategoryName = function(categoryname) {
    var ccategoryObject = ccategoryObject || {};
    var ccategoryArray = this.getSellerCCParentArray();
    _.forEach(ccategoryArray, function(n, key) {
       ccategoryObject[n] = true;
    });
    return ccategoryObject[categoryname] ? true : false;
};

/**
 * sets the items in the array
 *
 */
seller.setMCategory = function(array) {
    this.mMCategoryArray = array;
};


/**
 * gets the items in the array
 *
 */
seller.getMCategory = function() {
    return this.mMCategoryArray;
};


/**
 * gets the items in the array
 *
 */
seller.getMCategoryArray = function() {

    var mcategoryArray;
    for(var i = 0; i<this.mMCategoryArray.length; i++) {
    	var c = this.mMCategoryArray[i];
    	mcategoryArray = mcategoryArray || {};
    	mcategoryArray[c.id] = c.categoryname;
    }
    return mcategoryArray || {};
};

/**
 * gets the items in the array
 *
 */
seller.queryCCategory = function () {

    try {
        var self = this;
        var gd = ["id","hid","storeid","parentid","categoryname","isdelete"];
        var queryCCategorySql = "select " + gd.join(",") + " from goodscategory where isdelete = 0";

        console.log('queryCCategorySql: check it out: ', queryCCategorySql);
        Goodscategory.query(queryCCategorySql, function (err, list) {
            if (err) return;   
            console.log('cb_tag1: The result of this \' query \' is shown came out. check it out: ',list.length);
            self.setCCategory(list);
        });
        
    } catch (e) {
        console.log('seller: queryCCategory ', e);
    }
};

seller.queryAccountSeller = function () {

    try {

        var gd = ["id","nickname","shopsconcert","shopsconfig"];
        var queryAccountSellerSql = "select " + gd.join(",") + " from accountseller";
        console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
        Accountseller.query(queryAccountSellerSql,function (err, list) {
            if (err) {
                console.log("err_tag2: When this error is returned, the query fails.");
                return res.negotiate(err);
            } 
            console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);
            seller.setStore(list);
        });
        
    } catch (e) {
        console.log('seller: queryAccountSeller ', e);
    }
};

seller.getCategory = function() {
    var self = this;
    var ccategoryArray = self.getCCategory();

    var LEN2 = 2;
    var LEN3 = 3;
    var LEN4 = 4;
    var onelvMap = {};
    var twolvMap = {};
    var thrlvMap = {};
    var onelvArray = [];
    var twolvArray = [];
    var thrlvArray = [];

    for(var i = 0; i<ccategoryArray.length; i++) {
        var ccategoryObj = ccategoryArray[i];
        var hidArray = ccategoryObj.hid.split(":");
        switch(hidArray.length) {
            case LEN2:
                onelvArray.push(ccategoryObj);
                break;
            case LEN3:
                twolvArray.push(ccategoryObj);
                break;
            case LEN4:
                thrlvArray.push(ccategoryObj);
                break;
            default:
                console.log('err: ',hidArray.length);
        }
    }

    for(var i = 0; i<onelvArray.length; i++) {
        var onelvObj = onelvArray[i];
        onelvMap[onelvArray[i].id] = onelvObj.categoryname;
    }
    console.log('onelvMap ==> ',onelvMap);

    for(var key in onelvMap) {
        for(var i = 0; i<twolvArray.length; i++) {
            var towlvObj = twolvArray[i];
            var hidArray = towlvObj.hid.split(":");
            if (hidArray.includes(key)) {
                var id = hidArray[2];
                var name = seller.findCCategoryName(id);
                twolvMap[key] = twolvMap[key] || {};
                twolvMap[key][id] = name;
            }
        }
    }
    console.log('twolvMap ==> ',twolvMap);

    for(var k in twolvMap) {
        var towlvObj = twolvMap[k];
        for(var kk in towlvObj) {
            for(var i = 0; i<thrlvArray.length; i++) {
                var thrlvObj = thrlvArray[i];
                var hidArray = thrlvObj.hid.split(":");
                if (hidArray.includes(kk)) {
                    var id = hidArray[3];
                    var name = seller.findCCategoryName(id);
                    if (name !== "") {
                        thrlvMap[kk] = thrlvMap[kk] || {};
                        thrlvMap[kk][id] = name;
                    }
                }
            }
        }
    }
    console.log('thrlvMap ==> ',thrlvMap);

    var category = {};
    category.onelvObj = onelvMap;
    category.twolvObj = twolvMap;
    category.thrlvObj = thrlvMap;
    return category;
};

seller.isRepeat = function() {
    var ccategoryArray = seller.getCCategory();

    var LEN2 = 2;
    var LEN3 = 3;
    var LEN4 = 4;
    var onelvMap = {};
    var twolvMap = {};
    var thrlvMap = {};
    var onelvArray = [];
    var twolvArray = [];
    var thrlvArray = [];

    for(var i = 0; i<ccategoryArray.length; i++) {
        var ccategoryObj = ccategoryArray[i];
        var hidArray = ccategoryObj.hid.split(":");
        switch(hidArray.length) {
            case LEN2:
                onelvArray.push(ccategoryObj);
                break;
            case LEN3:
                twolvArray.push(ccategoryObj);
                break;
            case LEN4:
                thrlvArray.push(ccategoryObj);
                break;
            default:
                console.log('err: ',hidArray.length);
        }
    }

    for(var i = 0; i<onelvArray.length; i++) {
        var onelvObj = onelvArray[i];
        onelvMap[onelvArray[i].id] = onelvObj.categoryname;
    }
    console.log('onelvMap ==> ',onelvMap);

    for(var key in onelvMap) {
        for(var i = 0; i<twolvArray.length; i++) {
            var towlvObj = twolvArray[i];
            var hidArray = towlvObj.hid.split(":");
            if (hidArray.includes(key)) {
                var id = hidArray[2];
                var name = seller.findCCategoryName(id);
                if (name !== "") {
                    twolvMap[key] = twolvMap[key] || {};
                    twolvMap[key][id] = name;
                }
            }
        }
    }
    console.log('twolvMap ==> ',twolvMap);

    for(var k in twolvMap) {
        var towlvObj = twolvMap[k];
        for(var kk in towlvObj) {
            console.log('kk,',kk);
            for(var i = 0; i<thrlvArray.length; i++) {
                var thrlvObj = thrlvArray[i];
                var hidArray = thrlvObj.hid.split(":");
                console.log('hidArray,',hidArray);
                if (hidArray.includes(kk)) {
                    var id = hidArray[3];
                    var name = seller.findCCategoryName(id);
                    // if (name !== "") {
                    //     thrlvMap[kk] = thrlvMap[kk] || {};
                    //     thrlvMap[kk][id] = name;
                    // }
                }
            }
        }
    }
    console.log('thrlvMap ==> ',thrlvMap);


    var category = {};
    category.onelvObj = onelvMap;
    category.twolvObj = twolvMap;
    category.thrlvObj = thrlvMap;
    return category;
};

seller.hashUseralias = function(useralias) {
    return useralias + "@" + useralias;
}

seller.setPermission = function(list) {
    this.mPermission = list;
};

seller.getPermission = function(list) {
    return this.mPermission;
};