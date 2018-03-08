/**
* Adminuser.js
* 管理员（后台登录人员）
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    parentid: {type:'integer',defaultsTo:0},//父id 添加者id
    hid: {type: 'string',size: 100,defaultsTo: ''},//权限层级关系字符串
    username: {type: 'string',size: 100,defaultsTo: ''},//名字描述
    password: {type: 'string',size: 100,defaultsTo: ''},//名字描述
    mobile: {type: 'string',size: 30,defaultsTo: ''},//电话

    storeid: {type:'integer',defaultsTo:0},//运营商id
    groupid: {type:'integer',defaultsTo:0},//所在组id 默认0
    isdelete: {type:'boolean',size:'1'},//是否删除
    isAdmin: {type:'boolean',size:'1'},//是否是管理员，运营商入驻的同时产生的管理员
    avatar:{type: 'string',size: 100,defaultsTo: ''}
  },
  autoPK: true,//user id
  autoCreatedAt:true,
  autoUpdatedAt:true,
  toJSON: function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.updatedAt;
    delete obj.updatedAt;
    delete obj.hid;
    return obj;
  },
  beforeFind:function(values,next){
    
    next(values);
  }
};
/*
   
*/