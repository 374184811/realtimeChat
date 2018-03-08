/**
 * Accountseller.js
 * 运营商表
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        //id 应用记录id
        userbqlid: {//保千里ID
            type: 'integer',
            size: 20
        },
        usermobile: {//手机
            type: 'string',
            size: 12,
            defaultsTo: '111-222-3333'
        },
        useralias: {//用户名
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        useremail: {//用户邮箱
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        password1: {//运营商用户密码
            type: 'string',
        },
        password2: {//管理账户默认密码
            type: 'string',
        },
        nickname: {//用户昵称
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        realname: {//用户真名
            type: 'string',
            size: 32,
            defaultsTo: ''
        },
        userpic: {//用户头像
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        license_pic: {//营业执照
            type: 'string', size: 200, defaultsTo: ''
        },
        store_banner_pic: {//店铺主页banner图片
            type: 'string', size: 200, defaultsTo: ''
        },
        store_banner_pic_phone: {//店铺主页banner图片
            type: 'string', size: 200, defaultsTo: ''
        },
        store_show_pic: {//商城展示图片
            type: 'string', size: 200, defaultsTo: ''
        },
        sex: {//性别 0男 1女 2保密
            type: 'integer',
            defaultsTo: 0
        },
        birthday: {//生日
            type: 'date',
            defaultsTo: new Date()
        },

        categorylist: {//其他
            type: 'string',
            size: 250,
            defaultsTo: '0'
        },
        me_category: {//其他
            type: 'string',
            size: 250,
            defaultsTo: '0'
        },
        departmentid: {//部门id和组id 1:2
            type: 'string',
            size: 20,
            defaultsTo: ''
        },

        province: {//省
            type: 'string',
            size: 20,
            defaultsTo: ''
        },


        city: {//城市
            type: 'string',
            size: 50,
            defaultsTo: ''
        },


        area: {//地区
            type: 'string',
            size: 100,
            defaultsTo: ''
        },


        straddress: {//地址备注
            type: 'string',
            size: 200,
            defaultsTo: ''
        },


        address: {//用户地址
            type: 'string',
            size: 200,
            defaultsTo: ''
        },

        unfreeztime: {//解冻日期
            type: 'date',
            defaultsTo: new Date()
        },

        operatorno: {//营业执照号码
            type: 'string',
            size: 100,
            defaultsTo: ''
        },


        isopenship: {//是否开启异业联盟
            type: 'boolean', size: '1'
        },
        alipayaccount: {//支付宝结算账号
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        weichataccount: {//微信结算账号
            type: 'string',
            size: 100,
            defaultsTo: ''
        },

        companyname: {//公司名称
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        telephone: {//公司电话
            type: 'string',
            size: 20,
            defaultsTo: ''
        },
        servicetelephone: {//客服电话
            type: 'string',
            size: 20,
            defaultsTo: ''
        },
        telephonefax: {//公司传真
            type: 'string',
            size: 20,
            defaultsTo: ''
        },
        mainbusiness: {//主营业务
            type: 'string',
            size: 600,//由原来的100改为600
            defaultsTo: ''
        },
        contacts: {//联系人名称
            type: 'string',
            size: 50,
            defaultsTo: ''
        },
        legalperson: {//法人
            type: 'string',
            size: 50,
            defaultsTo: ''
        },
        shiplist: {//异业联盟109:217
            type: 'text', defaultsTo: '0'
        },

        statuscode: {//状态 1 正常， 2 待审核 ，3 审核失败，4 停用
            type: 'integer',
            defaultsTo: 0
        },
        id_card: {//身份证号码
            type: 'string',
            size: 19
        },
        industry: {//所属行业
            type: 'string',
            size: 50
        },

        shipstatus: {//异业联盟状态 0未申请   1已申请    2正常
            type: 'string',
            size: 255
        },
        shiprequest: {//异业联盟请求
            type: 'string',
            size: 255,
            defaultsTo: '0'
        },
        shipupdate: {//异业联盟时间
            type: 'date',
            defaultsTo: new Date()
        },
        remark: {
            type: "string"
        },
        topics:{ //提示语组成的json字符串
            type:"string",
            defaultsTo: ''
        },
        horizontalalliances: {//异业联盟数据缓存；reserve3
            type: 'string',
            size: 255,
            defaultsTo: ''
        },
        shopsconcert: {//商铺专场；reserve6
            type: 'string',
            size: 255,
            defaultsTo: ''
        },
        shopsconfig: {//商铺主页配置；reserve7
            type: 'string',
            size: 255,
            defaultsTo: ''
        },
        invoicenotice:{//发票须知
            type:"text",
            defaultsTo: ''
        },
        exchangerule:{//优惠卷兑换码规则内容
            type:"text",
            defaultsTo: ''
        },
        is_set_def_password: {//入驻商户是否已设置默认密码，0-未设置，1-设置
          type: 'integer',
          defaultsTo: 0
        },
        invoicelimit: {//发票须知获取，限制额度
          type: 'integer',
          defaultsTo: 0
        },
        invoiceinfo: {//不满足发票须知限制额度，所提示的信息
          type: 'string',
          size: 200,
          defaultsTo: ''
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
};
/*

 */
