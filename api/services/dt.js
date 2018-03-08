/**
 * create data components object
 *
 */
var dt = module.exports = function() {
    console.log('create: function');
    return this;
};

/**
 * Initialize Variables
 *
 */
dt.initialize = function() {

    //排列变量
    this._last = 0;
    this._arrange = [];

    //SKU缓存变量
    this._skuIndex = 0;
    this._lastIndex = 0;
    this._skuArray = [];

    //商户缓存变量
    this._sellerArray = [];
};

/**
 * 
 * sets an array 
 * 
 * @param {Array} 
 */
dt.skuArray = function(array) {
    this._skuArray = array;
};

/**
 * 
 * Gets a sku from the array, if the `sku` is a true, else false.  
 * 
 * @param {String} sku 
 * @returns {Boolean} The boolean from the array.
 */
dt.isSku = function(sku) {
    return this._skuArray.hasOwnProperty(sku);
};

 /**
 * 
 * Gets a sku from the array, if the `sku` is a true, else false.  
 * 
 * @param {String} 
 */
dt.addSku = function(sku) {
    this._skuArray.push(sku);
};


/**
 * sets an array
 *
 */
dt.setSellerArray = function(array) {
    this._sellerArray = array;
};

/**
 * 
 * Gets an id from the array, if the `id` is a true, else false.  
 * 
 * @param {String} 
 */
dt.isSeller = function(seller) {
    return this._sellerArray.hasOwnProperty(seller);
};

/**
 * 
 * This is a model of the arrangement, 
 * each model can generate a range of SKU. 
 * 
 * @param {String} 
 */
dt.initArrange = function() {
    var keys = ['0','1','2','3','4','5','6','7','8','9',
        'A','B','C','D','E','F','G','H','I','J','K','L','M',
        'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var len = keys.length;
    var arrange = new Array();
    for(var i=0;i<len-4;i++){
        for(var j=i+1;j<len-3;j++){
            for(var k=j+1;k<len-2;k++){
                for(var l=k+1;l<len - 1;l++){
                    for(var m=l+1;m<len;m++){
                        arrange.push([keys[i]+keys[j]+keys[k]+keys[l]+keys[m]]);
                    }
                }
            }
        }
    }

    this._arrange = arrange;
    console.log('initArrange: ',this._arrange.length);
};

dt.updateSku = function(arr) {
    
    var sku = arr.join(""),isuse = 0;
    var insertSKUSql = 'insert into stockkeepingunit(sku, isuse)';
        insertSKUSql += 'select \''+ sku +'\', \'' + isuse+ '\' from dual where ';
        insertSKUSql += '\''+ sku +'\' not in(select sku from stockkeepingunit);'

    console.log('insertSKUSql. check it out. ',insertSKUSql); 
    StockKeepingUnit.query(insertSKUSql,function (err, list) {
        if (err) return;
        console.log("cb_tag1: The result of this \' create \' is shown came out. check it out: ok");
    });
};

dt.perm = function(arr) {  
    var result = new Array(arr.length);  
    var fac = 1;  
    for (var i = 2; i <= arr.length; i++)  
        fac *= i;  
    for (index = 0; index < fac; index++) {  
        var t = index;  
        for (i = 1; i <= arr.length; i++) {  
            var w = t % i;  
            for (j = i - 1; j > w; j--)  
                result[j] = result[j - 1];  
            result[w] = arr[i - 1];  
            t = Math.floor(t / i);  
        }  
        dt.updateSku(result);  
    }  
};

/**
 * 
 * this is a bulk SKU funciton,arranged according 
 * to the model SKU. starting from srcIndex,destIndex
 * end.
 * 
 * @param {int} 
 * @param {int} 
 */
 dt.initSkuArray = function(srcIndex,destIndex) {

    if (srcIndex <0 || srcIndex>this._arrange.length){
        srcIndex = 0;
    }

    if (destIndex>this._arrange.length) {
        destIndex = this._arrange.length;
    }

    while(srcIndex < destIndex) {
        this.perm(this._arrange[srcIndex++]);
    }

    console.log('initSkuArray is finish. ',this._skuArray.length);
};

/**
 * 
 * Gets the index of a SKU is not used.
 * 
 * @param {int} 
 */
dt.getSkuIndex = function() {
    return this._skuIndex;
};

/**
 * 
 * Sets the index of a SKU is not used.
 * 
 * @param {int} 
 */
dt.setSkuIndex = function(idx) {
    this._skuIndex = idx;
};

dt.setMax = function(index) {
    this._lastIndex = index;
};

dt.getMax = function(index) {
    return this._lastIndex;
}




/**
 * 
 * Gets the index of the current SKU, if exist Returns
 * a value greater than zero, otherwise returns -1. 
 * 
 * @param {int} 
 */
dt.getCurSkuIndex = function(sku) {
    return this._skuArray.indexOf(sku);
}

dt.isUpdateSku = function() {
    // if (this._skuIndex + 1%50 == 0) {
    //     console.log('create sku');
    // }
};