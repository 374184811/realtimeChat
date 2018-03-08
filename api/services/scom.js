
/**
 * create serch components object
 *
 */
var scom = module.exports = function() {
    console.log('create: function')
    return this;
};

/**
 * Initialize the internal serch components object
 *
 */
scom.initialize = function() {
  console.log('initialize: function');
};


/**
 * 
 * Analysis of the user's search criteria  
 * 
 * @return {Map}  map   
 */
scom.analysisSerch = function(map) {

    if (!map.size || !map) {
        return map;
    }

    var iterKey = map.keys();
    var iterVal = map.values();
    var i = map.size,self = this;

    //filtering serch
    while(i--&&i>-1) {
        var key = iterKey.next().value;
        if (map.get(key) == -1) {
            //console.log(key,map.get(key))
            map.delete(key);
            //console.log(key,map.get(key))
        }
        if (scom.isEmpty(key,map)) {
            map.delete(key); 
        }
    };

    return map;
};

 /**
 * 
 * Check whether the map contains the object k,
 * if there is '', a null reference, or NaN, undefined.
 * if there are any return true,othrewise false 
 *
 * @param {string} key
 * @param {Map} map
 * @return {Boolean}  true/false  
 */
 scom.isEmpty = function(k,map) {
   var obj = {key:k, val: map.get(k)};
   return gcom.isForbidden(obj) ? true : false;
 };


/**
 * 
 * Check whether the map contains the object k,
 * if there is '', a null reference, or NaN, undefined.
 * if there are any return true,othrewise false 
 *
 * @param {string} key
 * @param {Map} map
 * @return {Boolean}  true/false  
 */
 scom.selectionSort = function(arr) {
    var len = arr.length;
    var minIndex, temp;
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            var a = parseInt(arr[j].sortorder);
            var b = parseInt(arr[minIndex].sortorder);
            if (a < b) {     //寻找最小的数
                minIndex = j;                 //将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
 };

 /**
 * 
 * 该函数用于规格排序, 
 *
 * @param {Arrau} arr
 * @return {Boolean}  array 
 */
  scom.sortPropertyrelated = function(arr) {
    var len = arr.length;
    var minIndex, temp;

    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            var a = parseInt(arr[j].id);
            var b = parseInt(arr[minIndex].id);
            if (a < b) {     
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
 };