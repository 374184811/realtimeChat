/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions (`true` allows public     *
     * access)                                                                  *
     *                                                                          *
     ***************************************************************************/

    '*': false,

    /***************************************************************************
     *                                                                          *
     * Here's an example of mapping some policies to run before a controller    *
     * and its actions                                                          *
     *                                                                          *
     ***************************************************************************/
    // RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    // '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy
    // (this overrides `false` above)
    // nurture	: 'isRabbitMother',

    // Apply the `isNicey users feed our rabbits
    // feed : ['isNiceToAnimals', 'hasRabbitFood']
    // }

    /********************************************************************************************************************************/
    /***************************************************************测试接口*********************************************************/
    /********************************************************************************************************************************/

    "simpleController": {
        "*":false,
        "onfocus":true,
        "createPermission":false,
        "updateDepartment":false,
        "updateController":false,
        "updateSystemSetting":false,
    },

    "KunTestController": {
        "*":true,
        //"redFighter": true,
        // "userMsg": true,
        // "userMsg2222": true,
    },

    /********************************************************************************************************************************/
    /***************************************************************独立接口*********************************************************/
    /********************************************************************************************************************************/



    //登陆模块
    "loginController": {

        //默认设置
        "*":false,

        //前端接口


        //商户接口
        "updateMerPassword": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "horizontalAlliancesList": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "sendHorizontalAlliances": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "updateHorizontalAlliances": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "cancleHorizontalAlliances": ["storeEntry","isValid","isStore","storelog","storeFinish"],

        //管理接口
        "delSellerId": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminUpdateSure": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminSellerReset": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminSellerStatus": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminAccountDetails": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminUpdateSellerDetails": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //登录模块
    "MemberController": {

        //默认设置
        "*":false,

        //开放接口
        "regUser":true,
        "isLogin": true,
        "userLogin": true,
        "guestlogin": true,

        //前端接口
        "sendSms": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "validSms": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        "validUser": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "userLogout": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "editPayPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        "getUserInfo": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "validPayPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "IsSetPayPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "setConsignee": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        "getConsignee": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "validUserPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "resetUserPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "getLoginUser": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        "hasCollection": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "getCollection": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "setCollection": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "addCollection": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "hasCollection": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "updateUserPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        "updateUserInfo": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "getCollectionCnt": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "deleteCollection": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "updateUserPayPwd": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        //管理接口


    },

    //未知模块
    "MerchantMsgController": {

        //默认设置
        "*":false,

        //开放接口

        //前端接口


        //商户接口
        "merchant": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        

        //管理接口
    },

    //未知模块
    "MerchantInfoController": {

        //默认设置
        "*":false,

        //开放接口


        //前端接口


        //商户接口
        "send": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "index": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "delete": ["storeEntry","isValid","isStore","storelog","storeFinish"],


        //管理接口
    },


    //服务器数据模块
    "servMsgController": {

        //默认设置
        "*":false,

        //开放接口


        //前端接口

        //商户接口


        //管理接口
        "curTime": true,
    },

    "UserMsgController": {

        //默认设置
        "*":false,

        //开放接口


        //前端接口
        "view": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "index": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "deleteMsg": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "deleteMsgs": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "getMsgCount": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
    },

    /********************************************************************************************************************************/
    /***************************************************************前端接口*********************************************************/
    /********************************************************************************************************************************/

    //消息推送模块
    "NotificationClientController": {

        //默认设置
        "*":false,

        //开放接口


        //前端接口
        //"create": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "createClient": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "sendAck": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "loadMsg": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "identifyDevice": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],

    },

    //聊天模块
    "SocketClientController": {

        //默认设置
        "*":false,

        //开放接口


        //前端接口
        "create": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "createClient": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "sendMsg": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "loadMsg": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],

        "uploadImage": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "getRedflag": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "getRedflags": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
        "clearRedflag": ["clientEntry","isValid","isVIP","socketChat","clientFinish"],
    },

    //其他设置
    "SettingClientController": {

        //默认设置
        "*":false,

        //开放接口


        //前端接口
        "get": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
        "multiGet": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],
    },

    //数据统计模块
    "statisticsController": {

        //默认设置
        "*":false,

        //开放接口
        "activate":true,
        "AnalyzeDataByDay":true,
        "AnalyzeDataByWeek":true,
        "AnalyzeInvoleData":true,
        "AnalyzeDataByHour":true,
        "AnalyzeDataByMonth":true,
        
        //前端接口
        "PreIncrStartUp": ["clientEntry","isValid","isVIP","clientlog","clientFinish"],

        //管理接口
        "IncrStartUp": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },


    /********************************************************************************************************************************/
    /***********************************************************商户后台接口*********************************************************/
    /********************************************************************************************************************************/

    //日志模块
    "LogStoreController": {

        //默认设置
        "*":false,

        //开放接口



        //商户接口
        "userstatus":["storeEntry","isValid","isStore","storelog","storeFinish"],
    },

    //信息模块
    "merchantStoreController": {

        //默认设置
        "*":false,

        //开放接口
        "login": true,

        //商户接口
        "getTopic": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "setTopic": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "searchGet": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "defaultPwd": ["storeEntry","isValid","isStore","storelog","storeFinish"],

        "getConfirmTime": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "getExchangeRule": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "setInvLimitInfo": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "setExchangeRule": ["storeEntry","isValid","isStore","storelog","storeFinish"],

        "getInvoiceNotice": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "checkPasswordFlag": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "setDefPasswordFlag": ["storeEntry","isValid","isStore","storelog","storeFinish"],
    },


    //运营模块
    "MerchantNotifyStoreController": {

        //默认设置
        "*":false,

        //开放接口


        //商户接口
        "merchant": ["storeEntry","isValid","isStore","storelog","storeFinish"],
    },

    "NotificationStoreController": {

        //默认设置
        "*":false,

        //开放接口
        "resendMsg": true,


        //商户接口
        // "create": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
        "sendMsg": ["storeEntry","isValid", "socketChat","storeFinish"],
        // "storeMsg": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],


    },

    //台订单模块
    "OrderStoreController": {

        //默认设置
        "*":false,

        //开放接口



        //商户接口
        "merTakeDelivery": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "merConfromRefund": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "merJudgeIsRefund": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "merGetRefundOrder": ["storeEntry","isValid","isStore","storelog","storeFinish"],
        "merTimeExpand3Days": ["storeEntry","isValid","isStore","storelog","storeFinish"],
    },

    //商户后台权限模块
    "PermissionStoreController": {

        //默认设置
        "*":false,

        //开放接口



        //商户接口
        "resetPwd": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "groupList": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "deleteUser": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "addAdminUser": ["storeEntry","isValid","isStore", "permission", "storelog","storeFinish"],

        "editAdminUser": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "adminUserList": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "addDepartment": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "addPermission": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],

        "departmentList": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "groupPermissionList": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "defaultPermissionList": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "deleteDepartmentGroup": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],

        "updateDepartmentPermission": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],

    },

    //评价模块
    "RateStoreController": {

        //默认设置
        "*":false,

        //开放接口



        //商户接口
        "getMerchatRateList": ["storeEntry","isValid","isStore","storelog","storeFinish"],
    },

    //聊天模块
    "SocketStoreController": {

        //默认设置
        "*":false,

        //开放接口


        //商户接口
        "create": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
        "sendMsg": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
        "loadMsg": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
        //"destory": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],

        "uploadImage": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
        "loadTemplate": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
        "storeTemplate": ["storeEntry","isValid", "isStore", "socketChat","storeFinish"],
    },

    //搜索模块
    "SerchStoreController": {

        //默认设置
        "*":false,

        //商户接口
        "frozenUser":["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "disableUser":["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchUser": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchGoods": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],

        "serchNormsGoods": ["storeEntry","isValid","isStore", "permission", "storelog","storeFinish"],
        "serchUserDetal": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchStoreGoods": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],

        "serchGoodsDetails": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchGoodsClassify": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchStoreidCategory": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],//临时权限

        "serchMeShopsCategory": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchMeShopsClassify": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchNormsWithClassify": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
        "serchCategoryWithProval": ["storeEntry","isValid", "isStore", "permission", "storelog","storeFinish"],
    },

    //台其他设置
    "SettingStoreController": {

        //默认设置
        "*":false,

        //开放接口


        //商户接口


    },


    /********************************************************************************************************************************/
    /***********************************************************管理后台接口*********************************************************/
    /********************************************************************************************************************************/


    //横幅模块
    "BannerAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "view": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "delete": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "getInline": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "bannerlist": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],

        "modularlist": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "updateBanner": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "addRecommend": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],

        "setBannerSort": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "getBannerSort": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "editRecommend": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],

        "getMyRecommend": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "editBannerTitle": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "bannerParameter": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "deleteRecommend": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],

        "getMyRecommendGoodsByChanel": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],

    },

    //优惠券模块
    "CouponAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "detail": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "modifyCoupon": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "deleteCoupon": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "selectCoupon": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "getCouponRecord": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //物流模块
    "DeliverAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "serviceGetDeliverInfo": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //未知模块
    "DashboardAdminController": {
        //默认设置
        "*":false,

        //管理接口
        "index": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //推荐模块
    "GoodSpecialAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "add": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "view": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "index": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "delete": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "uploadImageAdmin": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //商品模块
    "GoodsAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "update": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "editgoods": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "updateGoodsList": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminMerClassify": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "destoryGoodslist": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminAddClassify": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminDelClassify": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "getIndexRecommend": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "addIndexRecommend": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "adminDelMerClassify": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],

    },

    //日志模块
    "LogAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "system": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "userLogin": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
        "merchant": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "userstatus": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "useroperate": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //信息模块
    "merchantAdminController": {

        //默认设置
        "*":false,

        //开放接口
        "login": true,

        //管理接口
        "examine": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //管理后台运营模块
    "MerchantNotifyAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "add": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "index": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "update": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "delete": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "publish": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //订单模块
    "OrderAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "adminRefund": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "merDeleteOrder": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "merGetRefundOrder": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //权限模块
    "PermissionAdminController": {

        //管理接口
        "view": ["adminEntry","isValid","isAdmin","adminlog","adminFinish"],
    },

    //权限模块
    "PermissionAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "resetPwd": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "groupList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "groupList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "deleteUser": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],

        "addAdminUser": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "adminUserList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "editAdminUser": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "addDepartment": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],

        "departmentList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "permissionList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "adminAddClassify": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],

        "groupPermissionList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "groupPermissionList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "defaultPermissionList": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
        "deleteDepartmentGroup": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],

        "updateDepartmentPermission": ["adminEntry","isValid", "isAdmin","adminlog", "permission", "adminFinish"],
    },

    //问题反馈
    "QaAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "view": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "reply": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "index": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],

    },

    //评价模块
    "RateAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "deleteRate": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "getMerchatRateList": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //搜索模块
    "SerchAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "serchMer": ["adminEntry","isValid","isAdmin", "permission", "adminlog", "adminFinish"],
        "serchUser": ["storeEntry","isValid", "isAdmin", "permission", "adminlog","storeFinish"],
        "serchGoods": ["adminEntry","isValid","isAdmin", "permission","adminlog", "adminFinish"],//临时权限
        "frozenUser": ["adminEntry","isValid","isAdmin", "permission", "adminlog","adminFinish"],
        "disableUser": ["adminEntry","isValid","isAdmin", "permission",  "adminFinish"],
        "serchAllMer": ["adminEntry","isValid","isAdmin","adminlog", "permission", "adminFinish"],

        "serchMerDetal": ["adminEntry","isValid","isAdmin", "permission","adminlog", "adminFinish"],
        "serchUserDetal": ["adminEntry","isValid","isAdmin","permission", "adminlog", "adminFinish"],
        "serchGoodsDetails": ["adminEntry","isValid","isAdmin", "permission", "adminlog", "adminFinish"],//临时权限
        "serchCategoryGoods": ["adminEntry","isValid","isAdmin", "permission", "adminlog", "adminFinish"],
        "serchCategoryGoods": ["adminEntry","isValid","isAdmin", "permission", "adminlog", "adminFinish"],

        "serchStoreidCategory": ["adminEntry","isValid","isAdmin","adminlog", "permission", "adminFinish"],
        "serchMeShopsCategory": ["adminEntry","isValid","isAdmin","adminlog", "permission", "adminFinish"],
        "serchMeShopsClassify": ["adminEntry","isValid","isAdmin","adminlog", "permission", "adminFinish"],
        "serchNormsWithClassify": ["adminEntry","isValid","isAdmin","adminlog", "permission", "adminFinish"],
        "serchCategoryWithProval": ["adminEntry","isValid","isAdmin","adminlog", "permission", "adminFinish"],
    },

    //其他设置
    "SettingAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "update": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "multiSet": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
        "multiGet": ["adminEntry","isValid", "isAdmin","adminlog","adminFinish"],
    },

    //聊天模块
    "SocketAdminController": {

        //默认设置
        "*":false,

        //管理接口
        "create": ["adminEntry","isValid", "isAdmin","socketChat","adminFinish"],
        "sendMsg": ["adminEntry","isValid", "isAdmin","socketChat","adminFinish"],
        "uploadImage": ["adminEntry","isValid", "isAdmin","socketChat","adminFinish"],

        "loadTemplate": ["adminEntry","isValid", "isAdmin","socketChat","adminFinish"],
        "storeTemplate": ["adminEntry","isValid", "isAdmin","socketChat","adminFinish"],
    },


    //vr广场模块
    "VrSquareAdminController": {

        //默认设置
        "*":false,

        //开放接口
        "medifyXmlFile":true,

        //管理接口

    },

    /********************************************************************************************************************************/
    /*********************************************************---END---**************************************************************/
    /********************************************************************************************************************************/

};
