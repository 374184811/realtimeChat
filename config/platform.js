
global.TYPE_PLATFORM_ADMIN = 0;           //管理员获取详情数据
global.TYPE_PLATFORM_SELLER = 1;          //商户获取详情数据
global.TYPE_PLATFORM_ANDROID = 2;         //Android用户获取数据
global.TYPE_PLATFORM_IPHONE = 3;          //iPhone用户获取数据
global.TYPE_PLATFORM_WINDOWS = 4;         //电脑用户获取数据
global.TYPE_PLATFORM_WEBCHAT = 5;         //微商城用户获取数据

//策略执行层计数
global.gIndex = 0;

/**
* 这些设置防止修改属性和误删除,
* TAB_C_GOODS: 商品类别表拼接字符串;
* 商品类别存储表的设计由 "goodsList" + storid
* 组成的，所以每次查询商品类别需要用这个
* TAB_C_GOODS + storeid拼接表名去查询，
* 每次添加一个类别的商品，我们会把该类别的商品
* 复制一份到商户的商品表里面。
*/
Object.defineProperty(global, 'TAB_C_GOODS', {
  value: "goodsList"
}); 

/**
* 这些设置防止修改属性和误删除,
* TAB_M_GOODS: 商户商品表拼接字符串;
* 商户商品存储表的设计由 "mergoodsList" + storid
* 组成的，所以每次查询商户的商品需要用这个
* TAB_M_GOODS + storeid拼接表名去查询
*/
Object.defineProperty(global, 'TAB_M_GOODS', {
  value: "mergoodsList"
}); 

/**
* 这些设置防止修改属性和误删除,
* OS_ADMIN: 总后台|管理后台
*/
Object.defineProperty(global, 'OS_ADMIN', {
  value: 0
});

/**
* 这些设置防止修改属性和误删除,
* OS_SELLER: 商户后台|运营商后台
*/
Object.defineProperty(global, 'OS_SELLER', {
  value: 1
});

/**
* 这些设置防止修改属性和误删除,
* OS_MOBILE: 手机系统|手机浏览器
*/
Object.defineProperty(global, 'OS_MOBILE', {
  value: 2
});

/**
* 这些设置防止修改属性和误删除,
* OS_DESKTOP: PC浏览器|桌面浏览器
*/
Object.defineProperty(global, 'OS_DESKTOP', {
  value: 4
});


/**
*	这些设置防止修改属性和误删除,
*	MINE_CHECK: 登录检测
*/
Object.defineProperty(global, 'MINE_CHECK', {
  value: 1
});

/**
*	这些设置防止修改属性和误删除,
*	PASS_CHECK: 参数检测
*/
Object.defineProperty(global, 'PASS_CHECK', {
  value: 2
});

/**
*	这些设置防止修改属性和误删除,
*	VALID_CHECK: 空对象检测
*/
Object.defineProperty(global, 'VALID_CHECK', {
  value: 3
});

/**
*	这些设置防止修改属性和误删除,
*	ADMIND_CHECK: 管理员操作检测
*/
Object.defineProperty(global, 'ADMIND_CHECK', {
  value: 4
});

/**
*	这些设置防止修改属性和误删除,
*	ADMINDID_CHECK: 管理员ID检测
*/
Object.defineProperty(global, 'ADMINDID_CHECK', {
  value: 5
});

/**
* 这些设置防止修改属性和误删除,
* OPTION_CHECK: 控制方法检查
*/
Object.defineProperty(global, 'OPTION_CHECK', {
  value: 6
});

/**
* 这些设置防止修改属性和误删除,
* SERCURITY_CHECK: 防注入检查
*/
Object.defineProperty(global, 'SERCURITY_CHECK', {
  value: 7
});

/**
* 这些设置防止修改属性和误删除,
* FORBID_ADMIN: 禁止管理员
*/
Object.defineProperty(global, 'FORBID_ADMIN', {
  value: 8
});

/**
* 这些设置用于订单确认有效时间,
* CONFIRM_TIME: 订单自动确认收货
*/
Object.defineProperty(global, 'RECEIPT_CONFIRM_TIME', {
  value: 15
});

/**
* 这些设置用于售后确认有效时间,
* CONFIRM_TIME: 售后自动确认完成
*/
Object.defineProperty(global, 'AFTER_CONFIRM_TIME', {
  value: 14
});

/**
* 这些设置用于订单评价有效时间,
* ASSESS_TIME: 自动评价
*/
Object.defineProperty(global, 'ASSESS_TIME', {
  value: 7
});

/**
* 这些设置用于订单详情或售后添加延时,
* ADD_TIME: 添加延时
*/
Object.defineProperty(global, 'ADD_TIME', {
  value: 7
});

/**
* 这些设置用于判断优惠券领取接口IP判断有效时间,
* IP_VALID_TIME: 添加延时
*/
Object.defineProperty(global, 'IP_VALID_TIME', {
  value: 50
});

/**
*	这些设置防止修改属性和误删除,
*	DIR_UPLOAD_PATH: 上传路径设置
*/
Object.defineProperty(global, 'DIR_UPLOAD_PATH', {
  set:function(path){
  	sails.config.globals.uploadPath = path;
  },
  get:function(){
  	return sails.config.globals.uploadPath;
  }
});


//const TAB_C_GOODS = TAB_C_GOODS;
//const TAB_M_GOODS = TAB_M_GOODS;

/**
* Object.preventExtensions() 方法让一个对象变的不可扩展，
* 也就是永远不能再添加新的属性。
*	
* 
* 如果一个对象可以添加新的属性，则这个对象是可扩展的。
*	preventExtensions 可以让这个对象变的不可扩展，
* 	也就是不能再有新的属性。需要注意的是不可扩展的
*	对象的属性通常仍然可以被删除。尝试给一个不可扩
*	展对象添加新属性的操作将会失败，不过可能是静默失败，
*	也可能会抛出 TypeError 异常（严格模式）。
*/
//Object.preventExtensions(global)

/**
*	Object.freeze() 方法可以冻结一个对象，
*	冻结指的是不能向这个对象添加新的属性，
* 	不能修改其已有属性的值，不能删除已有属性，
*	以及不能修改该对象已有属性的可枚举性、可配置性、
*	可写性。也就是说，这个对象永远是不可变的。
* 该方法返回被冻结的对象。
* 
* 
* 冻结对象的所有自身属性都不可能以任何方式被修改。
* 任何尝试修改该对象的操作都会失败，可能是静默失败，
* 也可能会抛出异常（严格模式中）。
*/
// Object.freeze(global);