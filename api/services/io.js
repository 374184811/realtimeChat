/**
 * Created by Administrator on 2017/6/5.
 */

var http = require('http');
//var unit_date = require('../tools/unit-date');
var gm = require('gm').subClass({imageMagick: true});

module.exports = {
  
  connect:function(host,path,allParams,callback) {

      console.log('connect. This is the function entry.');

      //临时变量
      var self = this,options,urlPathStr,i;
      var allParams = Object.assign({},allParams);

      urlPathStr = "";
      urlPathStr += path || ""; 

      for(var keys in allParams) {
          urlPathStr += i ? '&' : '?';
          urlPathStr += keys + "=";
          urlPathStr += _.isObject(allParams[keys]) ? JSON.stringify(allParams[keys]) : allParams[keys];
          i = 1;
      }

      options = {};
      options.port = null;
      options.method = "POST";
      options.hostname = host;
      options.path = urlPathStr;

      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(allParams.toString()),
      }

      console.log('urlPathStr. check it out. ',host + urlPathStr);
      var request = http.request(options, function(response){
          var body = "";
          response.setEncoding('utf8');
          response.on('data', function(chunk) {
              body += chunk;
          });
          response.on('error', function (err) {
              callback(err,[]);
          });
          response.on('end', function(){
              try{
                  var json = JSON.parse(body);
                  callback(null,json);
              }catch(e){
                  console.log('end: err. ',e);
                  callback(null,[]);
              }
          });
      });

      request.write(urlPathStr);
      request.end();
      
  },

  reportToService: function(goods,status) {

    console.log('reportToService. This is the function entry.');

    var self = this;

    var opt = 0;
    // 商品状态 0 未审核   1 审核失败 2 未上架  3 正常
    switch(goods.status) {
      case 0:   //0 未审核==>1下架商品
        opt = 1;
        break;
      case 1:   //1 审核失败==>1下架商品
        opt = 1;
        break;
      case 2:   //2 未上架==>1下架商品 
        opt = 1;
        break;
      case 3:   //3 正常==>0更新字段
        opt = 0;
    }

    var sendToHealth = {}
    sendToHealth.opt = opt;                                   //opt int 0更新字段，1下架商品，2上架商品，3删除商品
    sendToHealth.goodsSourceId = goods.sku;                   //商品唯一标识
    sendToHealth.platformCode = self.getGoodsSource();        //健康软件系统分配给第三方 
    sendToHealth.data = {}                                    //opt=0时，需要更新的字段写在这里，3不用传data

    sendToHealth.data.webUrl = "";                            //点击推荐商品后，要跳转到APP路径(可选)(格式：包名|类名?参数&参数(参数可选)
    sendToHealth.data.goodsDesc = "";                         //商品描述(可选) //item.detailbody
    sendToHealth.data.goodsSign = "";                         //商品标签(可选 比如:填写包邮/特价/新品等)
    sendToHealth.data.goodsCode = "";                         //商品编码(可选)
    sendToHealth.data.unit = self.getUnit();                  //销售单位(可选)
    sendToHealth.data.goodsName = goods.name;                 //商品名称(必填)
    sendToHealth.data.salePrice = goods.price;                //销售价格(必填)
    sendToHealth.data.marketPrice = goods.price;              //市场价格(必填)
    sendToHealth.data.goodsFullName = goods.name;             //商品全名(必填，没有就用goodsName填充)
    sendToHealth.data.goodsPic = self.getDomain() + goods.imagedefault;   //商品图片 多张用|隔开最大5张(必填，至少一张图片，完整路径)
    sendToHealth.data.goodsSource = self.getGoodsSource();   //商品来自平台(可选)
    sendToHealth.data.appUrl = self.getAppUrl() + goods.sku;  //商品来自平台(可选)

    var host = "http://robottest.bqlcloud.com";
    var path = "/pub/pubController/syncHeathGoods";

    console.log('sendToHealth. ',JSON.stringify(sendToHealth));
    self.connect(host,path,sendToHealth, function(err,list) {
        console.log('rp_tag2: The result of this findOne is shown came out. check it out: ',list.length);
    });
  },

  gotoQueryGoods: function(sku) {

    console.log('gotoQueryGoods. This is the function entry. ');

    var self = this;
    var skuObj = gcom.revertSku(sku); 
    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,skuObj.storeid);

    var gd = ['name','stock','price','reserve1',
    'pricepoint','detailbody','attachment','type',
    'propertyvaluelist','imagedefault','sku','storeid',
    'status','reserve10','limited',"deposit","price","pricepoint"];

    var queryMGoodsSql = "";
    queryMGoodsSql += 'select ' + gd.toString() + ' from ' + tb_M_Name + ' where ';
    queryMGoodsSql += ' goodsseries = 0 and type = 1 and sku like \'' + skuObj.sku + '%\'';

    //查询所商品
    console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);
    Creator.query(queryMGoodsSql, function query(err, list) {
      if (err) return;
      console.log('rp_tag1: The result of this findOne is shown came out. check it out: ',list.length);
      while(list.length) self.reportToService(list.pop(),-1);
    });

  },

  getUnit:function() {
    return ""
  },

  getAppUrl:function() {
    return "com.darling.dljyshpad|com.darling.dljyshpad.MainActivity?sku=";
  },

  getGoodsSource:function() {
    return "darling";
  },

  getDomain:function() {
    return "http://dev.darlinglive.com";
  },

  getHealth: function() {

    var healthObj = {};
    healthObj.goodsSource = "darling";
    healthObj.domain = "http://dev.darlinglive.com";
    healthObj.unit = "com.darling.dljyshpad|com.darling.dljyshpad.MainActivity";
    healthObj.AppUrl = "com.darling.dljyshpad|com.darling.dljyshpad.MainActivity?sku=";

    return healthObj;
  },

}

