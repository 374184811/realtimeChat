/**
 * policy mappings
 * (sails.config.policies)
 *
 * policies are simple functions which run **before** your s.
 * you can apply one or more policies to a given , or protect
 * its actions individually.
 *
 * any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * for more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/policies
 *
 * for more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.operatename = {

    "appinfo": {
        "upload": "",
        "index": "",
        "add": "",
        "delete": "",
        "download": "",
        "checkversion": "检测app版本"
    },
    "banner": {
        "accountactivation": "",
        "listbanner": "",
        "getindexbanner": "",
        "gettopbanner": '首页',
        "bannerlist": "",
        "modularlist": "模块列表",
        "bannerclassify": "",
        "addbanner":"添加banner",
        "bannerparameter":"添加bannner",
        "uploadbannerimage":"上传banner图片",
        "updatebanner": "上传banner图片",
        "view":"查看banner",
        "delete": "删除banner"
    },
    "bootpage": {
        "get": "获取启动页面",
        "set":"设置启动页面",
        "uploadimg": "上传启动图片"
    },
    "cart": {
        "updatecartitemnum":"",
        "addnewitem": "",
        "clientcartlist": "",
        "clientdeletestoreitemsformcart": "",
        "clientdeleteitemformcart": "",
        "mershowlist": "",
        "updateitemformcart": "",
        "merupdateiteminfo": "",
        "mergetdataparaandser": ""
    },
    "dashboard": {
        "index":"显示首页数据"
    },
    "deliver": {
        "getdeliverinfo": "客户端获取物流数据",
        "servicegetdeliverinfo": "后台获取物流数据",
        "delivertrack": "物流订阅",
        "deliversubscript": "",
        "deliversubscripttest": "",
        "setcluster": "",
        "waterfalltest2": "",
        "waterfalltest": "",
        "pingppretrieve": ""
    },
    "detect": {
        "getdetectinfo": "",
        "triggerdetectinfo": ""
    },
    "elasticsearch": {
        "showtest": ""
    },
    "find": {
        "getmerorderlist": "",
        "getuserorderlist": "",
        "clientuserorderno": "",
        "clientuserordernonew": "",
        "getdetailorderinfo": "",
        "updateorderdeliver": "",
        "deliverlist": "",
        "pingppidentification": ""
    },
    "goodscategory": {
        "add": "",
        "edit": "",
        "saveall": ""
    },
    "goods": {
        "goodsparameter": "ti",
        "updategoodsdetails": "",
        "goodsnormsparameter": "",
        "delnormsgroup": "",
        "delnormsvalue": "",
        "updatenormsgrop": "",
        "uploadnormsimage": "",
        "addgoodscateory": "",
        "adminaddclassify": "",
        "adminmerclassify": "",
        "adminscreenclassify": "",
        "admindelclassify": "",
        "updategoodslist": "",
        "updatemergoodslist": "",
        "destorygoodslist": "",
        "addmerseries": "",
        "delmerseries": "",
        "updatemerseries": "",
        "updategoodshorizontalalliances": "",
        "mergoodslist": "",
        "showgoods": "",
        "addindexrecommend": "添加首页推荐",
        "getindexrecommend": "删除首页推荐",
        "editgoods": "编辑商品",
        "uploadvideo": "上传商品视频",
        "uploadgoods": "上传商品图片",
        "merchantgoods": "",
        "editgoodstatus": "",
        "gotoshoppingcenter": "",
        "gotoshopslist": "",
        "shopshomepageconfig": "",
        "shopshomepagesave": "",
        "gotoshopshomepage": "",
        "gotoshopsclassify": "",
        "updateshopshomepage": ""
    },
    "goodspecial": {
        "index": "显示自定义或者专场列表",
        "add": "添加专场或者自定义",
        "view": "查看专场或者自定义详情",
        "delete": "删除专场或者自定义",
        "edit": "编辑专场或者自定义",
        "uploadimage": "上传专场或者自定义图片"
    },
    "log": {
        "userlogin": "",
        "useroperate": "",
        "merchant": "",
        "system": ""
    },
    "login": {
        "generatemethod": "",
        "generatemixed": "",
        "accountregistered": "",
        "accountlogin": "",
        "checkpassword": "",
        "checkuser": "",
        "updateuserinfo": "",
        "updatephonenum": "",
        "updateuserpassword": "",
        "addmerchants": "",
        "merchantsregistered": "",
        "updatemerchants": "",
        "updateisopenship": "",
        "merchantslogin": "",
        "horizontalallianceslist": "",
        "sendhorizontalalliances": "",
        "updatehorizontalalliances": "",
        "canclehorizontalalliances": "",
        "addgeneralmanagement": "",
        "generalmanagement": "",
        "adminlogin": "",
        "adminupdatestatus": "",
        "adminsellerstatus": "",
        "adminupdatesure": "",
        "adminaccountdetails": "",
        "adminsellerreset": "",
        "adminupdatesellerdetails": "",
        "updatemerpassword": "",
        "autocreateuser": ""
    },
    "member": {

        "sendsms": "发送短信",
        "validsms": "验证短信",
        "validuser": "验证用户是否已经注册",
        "reguser": "注册用户",
        "adduser": "添加用户",
        "userlogin": "用户注册",
        "userlogout": "用户退出",
        "getuserinfo": "获取用户信息",
        "updateuserinfo": "修改用户信息",
        "updateuserpwd": "修改用户密码",
        "validuserpwd": "验证用户密码",
        "resetuserpwd": "重置用户密码",
        "getconsignee": "获取收货地址列表",
        "setconsignee": "设置收货地址列表",
        "updateuserpaypwd": "修改用户支付密码",
        "editpaypwd": "编辑支付密码",
        "issetpaypwd": "是否设置支付密码",
        "setcollection": "添加收藏列表",
        "getcollection": "获取收藏列表",
        "addcollection": "添加收藏",
        "deletecollection": "删除收藏",
        "hascollection": "是否收藏",
        "getcollectioncnt": "获取收藏总数"
    },
    "merchant": {
        "goodslistview": "",
        "login": "",
        "registeronesetup": "",
        "registertwosetup": "",
        "registerthreesetup": "",
        "uploadimage": "商户上传图片",
        "sendsms": "商户注册时发送短信",
        "validsmscode": "商户注册时验证短信",
        "checkispost": "",
        "detail": "商户详情",
        "modifypwd": "修改商户密码",
        "defaultpwd": "重置默认密码",
        "examine": "审核运营商",
        "searchset": "设置运营商搜索提示",
        "searchget": "获取运营商搜索提示",
        "setinvoicenotice": "运营商后台存储发票须知",
        "getinvoicenotice": "运营商后台或者客户端获取发票须知",
        "addreceipttime": "增加7天延时",
    },
    "merchantinfo": {
        "index": "推送消息列表",
        "view": "查看推送消息详情",
        "delete": "删除推送消息",
        "send": "推送消息"
    },
    "merchantnotify": {
        "index": "运营商公告列表",
        "merchant": "运营商查看自己公告",
        "add": "添加运营商公告",
        "update": "更新运营商公告",
        "delete": "删除运营商公告",
        "publish": "发布运营商公告",
        "view": "查看运营商公告"
    },
    "order": {
        "getweichatinfo": "",
        "getweichatopenid": "",
        "qrpolling": "",
        "createorder": "",
        "getmerrefundorderlist": "",
        "exportmerrefundorderlist": "",
        "changetablenameofitem": "",
        "updatelogisticsinfo": "",
        "usershowlist": "",
        "getorderdetail": "",
        "getmerorderlist": "",
        "updateorderstatus": "",
        "getbuyerorderlist": "",
        "getemitterorderlist": "",
        "getemitterorderemitter": "",
        "adminrefund": "",
        "mergetrefundorder": "",
        "clienttakedelivery": "",
        "mertakedelivery": "",
        "clientdeleteorder": "",
        "clientsetrefundstatus": "",
        "clientapplyrefund": "",
        "clienttakedelivery": "客户端确认收货",
        "mertakedelivery": "运营商发货"
    },
    "permission": {
        "addadminuser": "添加用户",
        "login": "用户登录",
        "logout": "用户登出",
        "departmentlist": "部门列表",
        "grouplist": "用户组列表",
        "resetpwd": "重置用户密码",
        "adminuserlist": "显示后台用户列表",
        "addpermission": "添加权限",
        "adddepartment": "添加部门",
        "deleteuser": "删除用户",
        "updatedepartmentpermission": "修改部门权限",
        "permissionlist": "权限列表",
        "departmentgroup":"显示部门或者用户组",
        "menulist":"获取菜单列表",
        "updatedepartmentmenu": "更新部门菜单",
        "deletedepartmentgroup": "删除部门或者用户组"
    },
    "postage": {
        "getesmmoney": "",
        "clientgetesmmoney": "",
        "updateesmmoney": ""
    },
    "rate": {
        "updaterate": "",
        "showgoodsratelist": "",
        "showuseronerate": "",
        "deleterate": "",
        "getmerchatratelist": "",
        "clientgetgoodsrate": "",
        "createrate": ""
    },
    "recharge": {
        "moneyindex": "合约金列表",
        "addmoney": "添加合约金",
        "moneylist": "合约金重置记录",
    },
    "region": {
        "addregin": "",
        "regionparam": "",
        "updateregion": "",
        "deleteregin": ""
    },
    "serch": {
        "serchuser": "显示用户列表",
        "serchmer": "显示运营商",
        "serchvagueuser": "",
        "serchallmer": "",
        "serchstoreidcategory": "",
        "serchmerdetal": "",
        "serchuserdetal": "",
        "adduser": "添加用户",
        "serchvaguemer": "",
        "serchgoodsdetails": "",
        "serchstoregoods": "",
        "serchnormswithclassify": "",
        "serchgoodsproperty": "",
        "serchpropertygroup": "",
        "serchgoodsseries": "",
        "showmerchstruct": "",
        "classifygoods": "",
        "serchshiplist": "",
        "serchregin": "",
        "serchprovice": "",
        "serchislogin": "",
        "serchnewuser": "",
        "serchactivityuser": "",
        "serchsilentuser": "",
        "serchprovicetotal": "",
        "serchcitytotal": "",
        "serchsextotal": "",
        "statusoperate": "",
        "resetpwd": "重置密码",
        "disableuser":"停用用户",
        "frozenuser":"冻结用户",
        "serchgoods": "",
        "exportexcel": "",
        "serchmerseries": "",
        "serchgoodsclassify": "",
        "serchmernavigat": "",
        "serchmeshops": "",
        "serchshopsclassify": ""
    },
    "setting": {
        "update": "修改设置",
        "get": "获取设置",
        "uploadimg": "上传图片",
        "multiset": "设置多项值",
        "multiget": "获取多个值",
        "uploadagreement": ""
    },
    "servmsg": {
        "curtime": "获取服务器时间",
        "redirect": "应用下载地址重定向跳转"
    },
    "statistics": {
        "index": "首页统计数据",
        "userinfo": "用户",
        "indexhead":"获取统计数据头部数据",
        "indexchannel":"获取统计数据渠道数据",
        "userreg": "",
        "user": "获取用户分析数据",
        "startup": "",
        "share": "",
        "involved": "获取用户参入度",
        "incrstartup": "启动页面"
    },
    "presale": {
        "sethomedisplay": "设置首页显示预售的序号",
        "add": "添加首页预售",
        "edit": "编辑首页预售",
        "delete": "删除预售",
        "goods":"显示预售商品",
        "home":"显示首页预售",
        "index":"显示更多预售信息"
    }
};
