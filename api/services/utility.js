
var jwt=require("jwt-simple");
var crypto=require("crypto");


module.exports = {
	arr: ['danhuang', 'jimi', 'teley'],
	isServerStart:false,
	mportalcategorydata:[],
	musergroupMin:[],

    createOrderInfo:{},
    mSellerlist:{},
	mcepgeneralusergroup:[],
    ordermainTableId:100,
    clusterTest:200,
    orderchildTableId:100,
    redis:null,
    emitter:null,
    mPingpp:null,
    mCrypto:null,
    mHorizontalAlliancesList:[],
    
    orderItemTableName:"orderchilditem201607",
	permissionData:{1:{1:{'goods':{'goodsCategoryView':true,'addGoodsView':false}}}},
	getOrderMainTableId: function(cb) {
        var myRedis = redis.client({db:5});

        myRedis.get('ordermainTableId', function (err, value) {
                if (err) return res.negotiate(err);
                if (value) {
                    var newValue = parseInt(value) +1;
                    myRedis.set('ordermainTableId',newValue,
                        function (err, red) {
                            if(err){
                                console.log('show ordernumber redis 4');
                                console.log(err);
                            }
                            var querytext = 'UPDATE platcounter set counterno='+newValue +' where id=1'
                            Platcounter.query(querytext, function(err, results) {
                                console.log(querytext);
                            });
                            cb(null,newValue);
                        });
                }else{
                    Platcounter.query('select * from platcounter', function(err, results) {
                        if (err) { console.log(err);return ;}
                        myRedis.set('ordermainTableId',parseInt(results[0]['counterno'])+5,
                        function (err, red) {
                            console.log(red);
                            cb(null,parseInt(results[0]['counterno'])+5)});
                    });
                }
            });
	},
    getOrderChildTableId: function() {
        this.orderchildTableId+=1;
        return this.orderchildTableId;
    },

    initEmitter: function() {
        this.clusterTest++;
        console.log('clusterTest = ',this.clusterTest);
        DIR_UPLOAD_PATH = sails.config.appPath.substr(0,sails.config.appPath.indexOf("darlingmanagementplatform"))+'apppic'
        var uncaughtHandler = function(e) {
           console.log('darling_uncaughtHandler_error',e);
        //    console.log(e.stack);
        };
        process.on('uncaughtException', uncaughtHandler);
        
        var  events = require('events');
        this.emitter = new events.EventEmitter();

        this.mCrypto = require('crypto');
        this.mPingpp = require('pingpp')(sails.config.connections.pingppKey);
        //this.mPingpp = require('pingpp')('sk_test_P0uDGK1SqfPGzzzfHKLWnb5G');
        
        var self = this;
        Platcounter.query('select * from platcounter', function(err, results) {
            console.log("ok: set ordermainTableId.=",self.ordermainTableId);
            if (err) { console.log(err);return ;}
            var myRedis = redis.client({db:5});
            myRedis.set('ordermainTableId',parseInt(results[0]['counterno'])+5);

            self.orderItemTableName = results[1]['detail'];
            console.log(results);
            console.log("ok: set ordermainTableId.=",self.ordermainTableId);
        });

    },
    updateCreateOrderInfo: function(ordernumber,step,res) {
                                                
        if(this.createOrderInfo[ordernumber] == undefined){
            this.createOrderInfo[ordernumber]={};
            this.createOrderInfo[ordernumber][step]=1;
        }else{
            this.createOrderInfo[ordernumber][step]=1;
        }

        console.log(ordernumber+':'+step);

    },
    getClientIp:function(req){//获取客户端请求ip
        if(req.ips.length){
            return req.ips[0];
        }
        return req.ip.substring("::ffff:".length);
        //return req.headers['x-forwarded-for']||req.connectin.remoteAddress||req.socket.remoteAddress||req.connection.socket.remoteAddress;
    },
    showCreateOrderInfo: function(ordernumber) {
        //console.log(this.createOrderInfo[ordernumber]);
        console.log(this.createOrderInfo);
    },
	getAssetsServerDownloadPath: function() {
		return "http://58.67.202.140:1402/user/download";
	},

    exportExcelList: function(req, res,data){
        var colsInfo=[];
        var colsInfo2=[];
        var colsInfo3=[];
        var typename='string';
        var conf ={};conf.stylesXmlFile = "styles.xml";
        var nodeExcel = require('excel-export');
        for (var i = 0; i < data.length; i++) {
            colsInfo2=[];
            for (var key in data[i]) { 
                if(i == 0){
                    typename='string';
                    if( typeof data[i][key] == 'number'){typename='number';}
                    if( typeof data[i][key] == 'date'){typename='date';}
                    if( typeof data[i][key] == 'bool'){typename='bool';}
                    colsInfo.push({caption:key,type:typename,width:180});
                }
                //colsInfo2.push('\''+data[i][key]+'\'');
                colsInfo2.push(data[i][key]);
            }
            colsInfo3.push(colsInfo2);
        };
        conf.cols = colsInfo;
        conf.rows = colsInfo3;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        return res.end(result, 'binary');
    },
    /**
    *读取.xlsx数据
    *@param path 文件路径
    */
    readExcelList: function(path){
        var pathStr = path.toString();
        var nodeExcel = require('node-xlsx').default;
        var excelArr = nodeExcel.parse(pathStr);
        var sheetName = excelArr[0].name;
        var data = excelArr[0].data;

        // while(data.length>0){
        //     var item = data.pop();
        //     var insertStr = 'INSERT INTO kuaidicom (name,ename) VALUES(\''+ item[0] +'\',\''+ item[1]+'\')';
        //     console.log("readExcelList einsertStrrr: ", insertStr);
        //     Kuaidicom.query(insertStr, function(err, result){
        //         if (err) {
        //             console.log("readExcelList err: ", err);
        //             return;
        //         }
        //     }); 
        // }

        return data;
    },

	triggersCreateMerchantTable: function(merchantid) {
		var querytext = 'create table mergoodsList'+merchantid+' like mergoodsprototype';
		Creator.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });
        
        //注册用户时为用户创建购物车表
        // var querytext2 = 'create table mercart'+merchantid+' like cart';
        // Cart.query(querytext2, function(err, results) {
        //   if (err) return res.serverError(err);
        //   console.log(querytext2);
        // });
        //注册商户时为商户创建订单表
        // var querytext3 = 'create table merorderchild'+merchantid+' like orderchild';
        // Buyermaporder.query(querytext3, function(err, results) {
        //   if (err) return res.serverError(err);
        //   console.log(querytext);
        // });
        //注册商户时为商户创建商品评论表
        var querytext4 = 'create table merrateorder'+merchantid+' like rateorder';
        Rateorder.query(querytext4, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(querytext);
        });
	},
    // 注册用户时 为该用户创建 一系列的表
    triggersByCreateBuyerTable: function(userid) {
        //注册用户时为用户创建订单表
        // var querytext = 'create table buyermaporder'+userid+' like buyermaporder';
        // Buyermaporder.query(querytext, function(err, results) {
        //   if (err) return res.serverError(err);
        //   console.log(querytext);
        // });
        //注册用户时为用户创建购物车表
        // var querytext2 = 'create table cart'+userid+' like cart';
        // Cart.query(querytext2, function(err, results) {
        //   if (err) return res.serverError(err);
        //   console.log(querytext2);
        // });
    },
    // 注册商户时为商户创建购物车表
    

    // 注册用户时 为用户创建购物车表
	triggersCreateGoodsTable: function(goodsparentcategoryid) {
		var querytext = 'create table goodsList'+goodsparentcategoryid+' like goodscontent';
		Creator.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });
	},
    isPermission: function(data) {
        var hasPermission = true;
        if(this.permissionData.hasOwnProperty(data[0])){
            if(this.permissionData[data[0]].hasOwnProperty(data[1])){
                
                if(this.permissionData[data[0]][data[1]].hasOwnProperty(data[2])){
                    
                    if(this.permissionData[data[0]][data[1]][data[2]].hasOwnProperty(data[3])){
                        hasPermission = this.permissionData[data[0]][data[1]][data[2]][data[3]];
                    }
                }
            }
        }
        return hasPermission;
    },

	triggersCreateDetecTable: function(userid) {
		var querytext = 'create table userdetectinfo'+userid+' like detectprototype';
		Creator.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });
	},

	checkOrderchilditemTable: function(date) {
        var month = date.getMonth() + 1;
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        var currentdate ="orderchilditem" + date.getFullYear() + month;
        if(this.orderItemTableName != currentdate){
            this.orderItemTableName=currentdate;
            var querytext = 'UPDATE platcounter set detail=\''+this.orderItemTableName +'\' where id=2'
            Platcounter.query(querytext, function(err, results) {
                //console.log(querytext);
               // console.log(results);
            });
        }
	},
    getOrderMainPre: function(date) {
        var month = date.getMonth() + 1;
        if (month >= 1 && month <= 9) {month = "0" + month;}
        var day = date.getDate();
        if (day >= 1 && day <= 9) {day = "0" + day;}
        var hours = date.getHours(); 
        var min = date.getMinutes(); 
        if (hours >= 1 && hours <= 9) {hours = "0" + hours;}
        if (min >= 1 && min <= 9) {min = "0" + min;}
        var currentdate = date.getFullYear() + month+day+hours+min;
        return currentdate;
    },
	hashHidValue: function(arr){
        return arr.join(":")
    },

    hashCategoryName: function(arr){
        var name = ''
        for(var i = 0; i<arr.length; i++){

            name+=arr[i]
            if(arr.length - 1 != i){
                 name+='、'
            } 
        }
        return name
    },

    revertHideValue:function(hid_string){
        return hid_string.split(':')
    },

    hashSku:function(v1,v2){
        return (v1.toString() + v2.toString());
    },

    revertSku:function(sku){
        return (sku/100000000);
    },

    insertIntoGoodsTable: function(obj,isMerchant){

    	var strInsertInto = ''
    	strInsertInto += 'INSERT'
    	strInsertInto += ' '
    	strInsertInto += 'INTO'
    	strInsertInto += ' '
    	strInsertInto += obj['tbName']
    	//strInsertInto += obj['userid']

    	strInsertInto += ' '
    	strInsertInto += '('
        if(isMerchant){
            strInsertInto += 'id'
            strInsertInto += ','
        }

    	strInsertInto += 'storecategoryid'
    		strInsertInto += ',' 
    	strInsertInto += 'brandid'
    		strInsertInto += ',' 
    	strInsertInto += 'userid'
            strInsertInto += ',' 
        strInsertInto += 'parentid'
    		strInsertInto += ',' 
    	strInsertInto += 'storeid'
    		strInsertInto += ',' 
    	strInsertInto += 'name'
    		strInsertInto += ',' 
    	strInsertInto += 'sku'
    		strInsertInto += ',' 
    	strInsertInto += 'imagedefault'
    		strInsertInto += ',' 
    	strInsertInto += 'propertyrelated'
    		strInsertInto += ','  
    	strInsertInto += 'attachment'
    		strInsertInto += ',' 
    	strInsertInto += 'stock'
    		strInsertInto += ',' 
    	strInsertInto += 'price'
    		strInsertInto += ',' 
    	strInsertInto += 'pricepoint'
    		strInsertInto += ',' 
    	strInsertInto += 'pricepromotion'
    		strInsertInto += ',' 
    	strInsertInto += 'weight'
    		strInsertInto += ',' 
    	strInsertInto += 'createdAt'
            strInsertInto += ',' 
        strInsertInto += 'detailbody'
    	strInsertInto += ')'
		
		strInsertInto += ' ' 
		strInsertInto += 'VALUES'
		strInsertInto += ' ' 

		strInsertInto += '('
        if(isMerchant){
            strInsertInto += obj['id']
            strInsertInto += ','
        }

    	strInsertInto += obj['storecategoryid']
    		strInsertInto += ',' 
    	strInsertInto += obj['brandid']
    		strInsertInto += ',' 
    	strInsertInto += obj['userid']
            strInsertInto += ',' 
        strInsertInto += obj['parentid']
    		strInsertInto += ',' 
    	strInsertInto += obj['storeid']
    		strInsertInto += ',' 
    	strInsertInto += '\'' 
    	strInsertInto += obj['name']
    	strInsertInto += '\'' 
    		strInsertInto += ',' 
    	strInsertInto += obj['sku']
    		strInsertInto += ','
    	strInsertInto += '\'' 
    	strInsertInto += obj['imagedefault']
    	strInsertInto += '\''
    		strInsertInto += ','
    	strInsertInto += '\'' 
    	strInsertInto += obj['propertyrelated']
    	strInsertInto += '\''
    		strInsertInto += ','
    	strInsertInto += '\''  
    	strInsertInto += obj['attachment']
    	strInsertInto += '\'' 
    		strInsertInto += ',' 
    	strInsertInto += obj['stock']
    		strInsertInto += ',' 
    	strInsertInto += obj['price']
    		strInsertInto += ',' 
    	strInsertInto += obj['pricepoint']
    		strInsertInto += ',' 
    	strInsertInto += obj['pricepromotion']
    		strInsertInto += ',' 
    	strInsertInto += obj['weight']
    		strInsertInto += ','
    	strInsertInto += '\'' 
    	strInsertInto += (new Date()).Format("yyyy-MM-dd hh:mm:ss.S")
    	strInsertInto += '\''
            strInsertInto += ',' 
            strInsertInto += '\''
        strInsertInto += obj['detailbody']
            strInsertInto += '\''
    	strInsertInto += ')'


		console.log('\n\n\n querytext: check it out: \n',strInsertInto)
		return strInsertInto
    },

    updateGoodsListTable:function(obj,isMerchant){
        var strUpdateInfo = ''
        strUpdateInfo += 'UPDATE'
        strUpdateInfo += ' '
        strUpdateInfo += obj['tbName']
        
        if(isMerchant){
            strUpdateInfo += obj['userid']
        }else{

            console.log('parentid: ',obj['parentid']);
            if(obj['parentid']){
                strUpdateInfo += obj['parentid']
            }else{
                strUpdateInfo += obj['id']
            }
        }
        

        strUpdateInfo += ' ' 
        strUpdateInfo += 'SET'
        strUpdateInfo += ' ' 

        // strUpdateInfo += 'storecategoryid'
        // strUpdateInfo += '=' 
        // strUpdateInfo += obj['storecategoryid']
        // strUpdateInfo += ',' 

        strUpdateInfo += 'brandid'
        strUpdateInfo += '=' 
        strUpdateInfo += obj['brandid']
        strUpdateInfo += ',' 

        strUpdateInfo += 'userid'
        strUpdateInfo += '=' 
        strUpdateInfo += obj['userid']
        strUpdateInfo += ','

        strUpdateInfo += 'storeid'
        strUpdateInfo += '=' 
        strUpdateInfo += obj['storeid']
        strUpdateInfo += ','

        strUpdateInfo += 'name'
        strUpdateInfo += '='
        strUpdateInfo += '\''  
        strUpdateInfo += obj['name']
        strUpdateInfo += '\'' 
        strUpdateInfo += ','

        strUpdateInfo += 'sku'
        strUpdateInfo += '=' 
        strUpdateInfo += obj['sku']
        strUpdateInfo += ','

        // strUpdateInfo += 'imagedefault'
        // strUpdateInfo += '='
        // strUpdateInfo += '\''  
        // strUpdateInfo += obj['imagedefault']
        // strUpdateInfo += '\'' 
        // strUpdateInfo += ','

        strUpdateInfo += 'propertyrelated'
        strUpdateInfo += '='
        strUpdateInfo += '\''  
        strUpdateInfo += obj['propertyrelated']
        strUpdateInfo += '\'' 
        strUpdateInfo += ','

        // strUpdateInfo += 'attachment'
        // strUpdateInfo += '='
        // strUpdateInfo += '\''  
        // strUpdateInfo += obj['attachment']
        // strUpdateInfo += '\'' 
        // strUpdateInfo += ','

        strUpdateInfo += 'stock'
        strUpdateInfo += '='
        strUpdateInfo += obj['stock']
        strUpdateInfo += ','

        strUpdateInfo += 'price'
        strUpdateInfo += '='
        strUpdateInfo += obj['price']
        strUpdateInfo += ','

        strUpdateInfo += 'pricepoint'
        strUpdateInfo += '='
        strUpdateInfo += obj['pricepoint']
        strUpdateInfo += ',' 

        strUpdateInfo += 'pricepromotion'
        strUpdateInfo += '='
        strUpdateInfo += obj['pricepromotion']

        strUpdateInfo += ' ' 
        strUpdateInfo += 'WHERE'
        strUpdateInfo += ' ' 

        strUpdateInfo += 'id'
        strUpdateInfo += '='
        strUpdateInfo += obj['id']

        strUpdateInfo += ' '
        strUpdateInfo += 'and'
        strUpdateInfo += ' '

        strUpdateInfo += 'storecategoryid'
        strUpdateInfo += '='
        strUpdateInfo += obj['storecategoryid']

        console.log('\n\n\n updatetext: check it out: \n',strUpdateInfo)
        return strUpdateInfo
    },

    destoryGoodsList: function(tbName,obj,isMerchant){
        var strDestoryInfo = ''
        strDestoryInfo += 'delete from'
        strDestoryInfo += ' '
        strDestoryInfo += tbName

        if(isMerchant){
            strDestoryInfo += obj['userid']
        }else{
            strDestoryInfo += obj['parentid']
        }
        

        strDestoryInfo += ' '
        strDestoryInfo += 'WHERE'

        strDestoryInfo += ' '
        strDestoryInfo += 'id'
        strDestoryInfo += '='
        strDestoryInfo += obj['id']

        strDestoryInfo += ' '
        strDestoryInfo += 'and'
        
        strDestoryInfo += ' '
        strDestoryInfo += 'storecategoryid'
        strDestoryInfo += '='
        strDestoryInfo += obj['storecategoryid']

        console.log('\n\n\n destorytext: check it out: \n',strDestoryInfo)
        return strDestoryInfo
    },

    selectGoodsList: function(tbName,obj,isMerchant){
        var strDestoryInfo = ''
        strDestoryInfo += 'select * from'
        strDestoryInfo += ' '
        strDestoryInfo += tbName

        if(isMerchant){
            strDestoryInfo += obj['userid']
        }else{
            strDestoryInfo += obj['parentid']
        }
        

        strDestoryInfo += ' '
        strDestoryInfo += 'WHERE'

        strDestoryInfo += ' '
        strDestoryInfo += 'id'
        strDestoryInfo += '='
        strDestoryInfo += obj['id']

        strDestoryInfo += ' '
        strDestoryInfo += 'and'
        
        strDestoryInfo += ' '
        strDestoryInfo += 'storecategoryid'
        strDestoryInfo += '='
        strDestoryInfo += obj['storecategoryid']

        console.log('\n\n\n selecttext: check it out: \n',strDestoryInfo)
        return strDestoryInfo
    },

    insertDataToTable: function(obj, tablename){
        var strInsertInto = ' ';
        var arraryKey = [];
        var arraryValue = [];
        for(var p in obj){ 
            arraryKey.push(p);
            arraryValue.push('\''+obj[p]+'\'');
        }
        strInsertInto += 'INSERT INTO ';
        strInsertInto += tablename;
        strInsertInto += ' ';
        strInsertInto += ' ( ';
        strInsertInto += arraryKey.toString();
        strInsertInto += ') VALUES (';
        strInsertInto += arraryValue.toString();
        strInsertInto += ')';

        console.log('\n\n\n querytext: check it out: \n',strInsertInto)
        return strInsertInto;
    },
    updateToTable: function(obj, tablename,wheredata){
        var strInsertInto = ' ';
        var arraryKey = [];
        var arraryValue = [];
        for(var p in obj){ 
            arraryKey.push(p+' = '+'\''+obj[p]+'\'');
        }
        
        strInsertInto += 'update ';
        strInsertInto += tablename;
        strInsertInto += ' set';
        strInsertInto += arraryKey.toString();
        strInsertInto += ' where ( ';
        strInsertInto += wheredata.toString();
        strInsertInto += ')';
        return querystr;
    },
    selectToTable: function(obj, tablename,wheredata){
        var strInsertInto = ' ';
        var arraryKey = [];
        var arraryValue = [];
        
        for(var p in wheredata){ 
            arrarywhere.push(p+' = '+'\''+obj[p]+'\'');
        }
        strInsertInto += 'select ';
        strInsertInto += obj.toString();
        strInsertInto += tablename;
        strInsertInto += ' set';
        strInsertInto += ' where ( ';
        strInsertInto += arrarywhere.toString();
        strInsertInto += ')';
        return strInsertInto;
    },

    // selectGoodsCategory: function(obj){
    //     var querytext = ''

    //     querytext += 'select * from'
    //     querytext += ' '
    //     querytext += 'goodscategory'

    //     querytext += ' '
    //     querytext += 'WHERE'

    //     querytext += ' '
    //     querytext += 'id'
    //     querytext += '='
    //     querytext += obj['id']

    //     console.log('\n\n\n querytext: check it out: \n', querytext);

    //     return querytext;
    // },

    GetRandomNum: function(Min,Max){   
        var Range = Max - Min;   
        var Rand = Math.random();   
        return(Min + Math.round(Rand * Range));

        //var num = GetRandomNum(1,10);   
    },   
   
    generateMixed: function(n,isChars) {

        var chars = ['0','1','2','3','4','5','6','7','8','9'];

        if (!isChars) {
            chars = ['0','1','2','3','4','5','6','7','8','9',
            'A','B','C','D','E','F','G','H','I','J','K','L','M',
            'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        }

        //用Math.ceil(Math.random()*10);时，
        //主要获取1到10的随机整数，取0的几率极小。
        var length = chars.length - 1,res = "";
        for(var i = 0; i < n ; i ++) {
            res += chars[Math.ceil(Math.random()*length)];
        }
        return res;
    },

    insertIntoGoodsTable: function(obj,isMerchant){
        
        var strInsertInto = ''
        strInsertInto += 'INSERT'
        strInsertInto += ' '
        strInsertInto += 'INTO'
        strInsertInto += ' '
        strInsertInto += obj['tbName']
        //strInsertInto += obj['userid']

        strInsertInto += ' '
        strInsertInto += '('
        if(isMerchant){
            strInsertInto += 'id'
            strInsertInto += ','
        }

        strInsertInto += 'storecategoryid'
            strInsertInto += ',' 
        strInsertInto += 'brandid'
            strInsertInto += ',' 
        strInsertInto += 'userid'
            strInsertInto += ',' 
        strInsertInto += 'parentid'
            strInsertInto += ',' 
        strInsertInto += 'storeid'
            strInsertInto += ',' 
        strInsertInto += 'name'
            strInsertInto += ',' 
        strInsertInto += 'sku'
            strInsertInto += ',' 
        strInsertInto += 'imagedefault'
            strInsertInto += ',' 
        strInsertInto += 'propertyrelated'
            strInsertInto += ','  
        strInsertInto += 'attachment'
            strInsertInto += ',' 
        strInsertInto += 'stock'
            strInsertInto += ',' 
        strInsertInto += 'price'
            strInsertInto += ',' 
        strInsertInto += 'pricepoint'
            strInsertInto += ',' 
        strInsertInto += 'pricepromotion'
            strInsertInto += ',' 
        strInsertInto += 'weight'
            strInsertInto += ',' 
        strInsertInto += 'createdAt'
            strInsertInto += ',' 
        strInsertInto += 'detailbody'
            strInsertInto += ',' 
        strInsertInto += 'goodsseries'
            strInsertInto += ',' 
        strInsertInto += 'keywords'
            strInsertInto += ',' 
        strInsertInto += 'propertyvaluelist'
            strInsertInto += ',' 
        strInsertInto += 'reserve1'
            strInsertInto += ',' 
        strInsertInto += 'reserve2'
            strInsertInto += ',' 
        strInsertInto += 'reserve3'
            strInsertInto += ',' 
        strInsertInto += 'reserve4'
            strInsertInto += ',' 
        strInsertInto += 'reserve5'
            strInsertInto += ',' 
        strInsertInto += 'reserve6'
            strInsertInto += ',' 
        strInsertInto += 'reserve7'
            strInsertInto += ',' 
        strInsertInto += 'reserve8'
            strInsertInto += ',' 
        strInsertInto += 'reserve9'
            strInsertInto += ',' 
        strInsertInto += 'reserve10'
        strInsertInto += ')'
        
        strInsertInto += ' ' 
        strInsertInto += 'VALUES'
        strInsertInto += ' ' 

        strInsertInto += '('
        if(isMerchant){
            strInsertInto += obj['id']
            strInsertInto += ','
        }

        strInsertInto += obj['storecategoryid']
            strInsertInto += ',' 
        strInsertInto += obj['brandid']
            strInsertInto += ',' 
        strInsertInto += obj['userid']
            strInsertInto += ',' 
        strInsertInto += obj['parentid']
            strInsertInto += ',' 
        strInsertInto += obj['storeid']
            strInsertInto += ',' 
        strInsertInto += '\'' 
        strInsertInto += obj['name']
        strInsertInto += '\'' 
            strInsertInto += ',' 
        strInsertInto += obj['sku']
            strInsertInto += ','
        strInsertInto += '\'' 
        strInsertInto += obj['imagedefault']
        strInsertInto += '\''
            strInsertInto += ','
        strInsertInto += '\'' 
        strInsertInto += obj['propertyrelated']
        strInsertInto += '\''
            strInsertInto += ','
        strInsertInto += '\''  
        strInsertInto += obj['attachment']
        strInsertInto += '\'' 
            strInsertInto += ',' 
        strInsertInto += obj['stock']
            strInsertInto += ',' 
        strInsertInto += obj['price']
            strInsertInto += ',' 
        strInsertInto += obj['pricepoint']
            strInsertInto += ',' 
        strInsertInto += obj['pricepromotion']
            strInsertInto += ',' 
        strInsertInto += obj['weight']
            strInsertInto += ','
        strInsertInto += '\'' 
        strInsertInto += (new Date()).Format("yyyy-MM-dd hh:mm:ss.S")
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['detailbody']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['goodsseries']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['keywords']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['propertyvaluelist']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve1']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve2']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve3']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve4']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve5']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve6']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve7']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve8']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve9']
        strInsertInto += '\''
            strInsertInto += ',' 
        strInsertInto += '\''
        strInsertInto += obj['reserve10']
        strInsertInto += '\''
        strInsertInto += ')'

        console.log('\n\n\n querytext: check it out: \n',strInsertInto)
        return strInsertInto
    },

    insertIntoMeMail:function(obj,isFirst){

        var strInsertInto = ''
        strInsertInto += 'INSERT'
        strInsertInto += ' '
        strInsertInto += 'INTO'
        strInsertInto += ' '
        strInsertInto += obj['tbName']

        strInsertInto += ' '
        strInsertInto += '('
        strInsertInto += 'type'
            strInsertInto += ',' 
        strInsertInto += 'content'
            strInsertInto += ',' 
        strInsertInto += 'storeid'
            strInsertInto += ',' 
        strInsertInto += 'senderid'
            strInsertInto += ',' 
        strInsertInto += 'sendername'
            strInsertInto += ',' 
        strInsertInto += 'reserve1'
            strInsertInto += ',' 
        strInsertInto += 'reserve2'
            strInsertInto += ',' 
        strInsertInto += 'isdelete'
            strInsertInto += ',' 
        strInsertInto += 'createdAt'
            strInsertInto += ','  
        strInsertInto += 'updatedAt'
        strInsertInto += ')'
        
        strInsertInto += ' ' 
        strInsertInto += 'SELECT'
        strInsertInto += ' ' 

        strInsertInto += obj['type']
            strInsertInto += ',' 
        strInsertInto += obj['content']
            strInsertInto += ',' 
        strInsertInto += obj['storeid']
            strInsertInto += ',' 
        strInsertInto += obj['senderid']
            strInsertInto += ',' 
        strInsertInto += obj['sendername']
            strInsertInto += ',' 
        strInsertInto += obj['reserve1']
            strInsertInto += ',' 
        strInsertInto += obj['reserve2']
            strInsertInto += ','
        strInsertInto += obj['isdelete']
            strInsertInto += ','
        strInsertInto += obj['createdAt']
            strInsertInto += ','
        strInsertInto += obj['updatedAt']

        if (isFirst) {

            strInsertInto += ' ' 
            strInsertInto += 'from mailprototype WHERE storeid = 52 or storeid = 100';
        }else{

            strInsertInto += ' from mailprototype WHERE (storeid = 52 AND createdAt> \'';
            strInsertInto += (new Date(obj['maxCreatedAt'])).Format("yyyy-MM-dd hh:mm:ss.S") + '\')' 
            strInsertInto += ' or '
            strInsertInto += ' (storeid = 100 AND createdAt> \'' 
            strInsertInto += (new Date(obj['maxCreatedAt'])).Format("yyyy-MM-dd hh:mm:ss.S") + '\')';
        }
        

        console.log('\n\n\n querytext: check it out: \n',strInsertInto)
        return strInsertInto
    },

    selectTable:function(tab_name){
        return 'SELECT * from' + tab_name + ' ';
    },

    inserIntoTable:function(tab_name) {
        return 'Insert into' + tab_name+ ' ';
    },

    insertToKey:function(obj) {
        var insert_key = '('

        for(var key in obj){
            if(key != 'tbName'){
                insert_key += obj[key];
                insert_key += ',';
            }
        }

        insert_key += ')';
        insert_key += ' ';
        return insert_key;
    },

    insertToValues: function(obj) {
        var insert_values = '('

        for(var key in obj){
            if(key != 'tbName') {
                insert_values += obj[key];
                insert_values += ',';
            }
        }

        insert_values += ')'
        insert_key += ' ';
        return insert_values;
    },

    selecToKey:function(obj) {
        for(var key in obj){
            if(key != 'tbName') {
                select_values += obj[key];
                select_values += ',';
            }
        }
        insert_key += ' ';
        return select_values;
    },

    fromTable:function(tab_name){
        return 'from ' + tab_name + ' ';
    },

    queryInfo:function(obj) {
        var query = 'WHERE'

        for(var key in obj){
            query += ' '
            query += key
            query += '='
            query += obj[key];
        }
        query += ' ';
        return query;
    },

    //生成随机手机号
    getMoble:function() {
        var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
        var i = parseInt(10 * Math.random());
        var prefix = prefixArray[i];
        for (var j = 0; j < 8; j++) {
            prefix = prefix + Math.floor(Math.random() * 10);
        }
        return prefix;
    },

    // 生成随机姓名
    getName:function() {

        var familyNames = new Array(
        "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", 
        "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
        "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", 
        "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", 
        "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
        "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺", 
        "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", 
        "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
        );

        var givenNames = new Array(
        "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛", 
        "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊", 
        "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政", 
        "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建", 
        "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋", 
        "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅", 
        "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡", 
        "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕", 
        "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵", 
        "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
        );

        var i = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
        var familyName = familyNames[i];
        var givenName = givenNames[i];
        var name = familyName + givenName;
        return name;
    },

    // 生成随机商户
    getUseralias:function() {

        var familyNames = new Array(
        "百佳超市金田花园店", "百佳超市恒宝广场店", "百佳超市新东山店", "百佳超市珠江俊园店", "百佳超市天河娱乐广场店", "百佳超市中华广场店","百佳超市汇景新城店", "百佳超市岭南新世界店", "百佳超市富景花园店", "百佳超市如意中心店", 
        "百佳超市晓港湾店", "百佳超市保利丰店", "百佳超市吉利购物广场店", "卜蜂莲花顺德店", "卜蜂莲花黄石店", "新一佳宏宇店", "新一佳番禺景秀江南店", "新一佳同和店", "信和德兴店", "万宁茶山路店",
        "百佳超市保利丰店", "百佳超市南海广场店", "百佳超市花地分店", "卜蜂莲花黄岐店", "卜蜂莲花金沙洲店", "万宁康王店", "万宁花都金城店", "万宁星河湾店", "万宁雅居乐店", "万宁东区商业城店", 
        "百佳超市金碧花园店", "百佳超市金沙湾店", "百佳超市中旅商业城店", "信和万丰店", "万宁天汇城店", "万宁大学城店", "万宁嘉和苑店", "万宁芭堤水岸店", "万宁棠溪商业中心店", "万宁怡乐路店",
        "百佳超市江南新一城广场店", "百佳超市西城都荟店", "百佳超市君益分店", "信和石岗店", "滔搏运动城", "中华百货", "华忆百货岗顶店", "曜和百货", "东山百货", "丽特百货", 
        "百佳超市都市广场店", "百佳超市星荟城店", "百佳超市正佳分店", "百佳超市王朝分店", "摩登百货西城都荟店", "摩登百货北京路店", "摩登百货新塘店", "摩登百货花都店", "万宁滨江路店", "新光百货康王店",
        "百佳超市怡港花园店", "百佳普君新城店", "卜蜂莲花三元里店", "信和西城店", "信和银都店", "摩登百货黄埔店", "摩登百货圣地店", "摩登百货海购店", "摩登百货岗顶店", "正佳广场", 
        "百佳超市华忆丽晶广场店", "百佳超市名盛广场店", "卜蜂莲花天河店", "信和百德店", "信和佳盛店", "信和桂园店", "信和建设店", "信和盐步店", "信和大石店", "信和太港城店",
        "百佳超市和业广场店", "百佳超市嘉仕花园店", "卜蜂莲花花都店", "卜蜂莲花长兴店", "信和里水店", "信和朝阳店", "信和西丽广场店", "信和清河店", "信和石楼店", "信和玉秀店", 
        "百佳超市顺联购物中心店", "百佳超市鸿禧分店", "卜蜂莲花南海店", "卜蜂莲花三水店", "信和康乐店", "信和榄核店", "信和钟福店", "信和美心店", "信和东怡店", "信和御院店",
        "万宁龙珠路店", "万宁丽影商业广场店", "万宁东鸣轩店", "万宁番禺钻汇广场店", "万宁番禺禺山店", "万宁员村家乐福店", "万宁新塘大润发店", "万宁百信店", "万宁三元里店", "万宁中山六路乐购店",
        "万宁黄埔惠润店", "万宁佳润广场店", "万宁动漫星城店", "万宁华忆店", "万宁增城泰富广场店", "万宁柏西商都店", "万宁青年路店", "万宁华忆江南店", "万宁华忆丽晶店", "万宁增城东汇店",
        "万宁马务商业广场店", "万宁机场店", "万宁太古汇店", "万宁曜和广场店", "万宁GOGO城店", "万宁财富广场店", "万宁番禺沙湾大润发店", "每一角落中信旗舰店", "每一角落侨怡店", "广州酒家客村店",
        "每一角落汇景新城店", "广州酒家东山店", "广州酒家敦和店", "广州酒家同福中店", "广州酒家滨江西店", "广州酒家江畔红楼店", "广州酒家文昌店", "广州酒家五羊店", "广州酒家体育东店", "广州酒家黄埔店",
        "广州酒家临江店", "广州酒家越华天极品店", "渔米之香(凤凰城店)分店", "渔米之香(赛马场店)分店", "红馆私房菜(跑马场一店)分店", "红馆私房菜(跑马场二店)分店", "红馆私房菜(白云国际会议中心店)分店", "大椰丰饭中华广场店", "广州酒家体育东店", "大椰丰饭-正佳广场店",
        "old记茶餐厅天河北店", "蟹将军喜记太古汇店", "江山享味万达广场店", "江南厨子太古汇店", "川国演义", "潮皇食府国贸总店", "潮皇食府广东外商活动中心店", "潮皇食府亚太国际俱乐部店", "王府井酒家", "柏悦酒家东山口店",
        "柏悦酒家水荫路店", "黄埔华苑临江店", "黄埔华苑天河店", "黄埔华苑黄埔店", "半岛名轩", "御珍轩", "绿茵阁港艺店", "绿茵阁江南西店", "绿茵阁江南中店", "绿茵阁新一城店",
        '绿茵阁仓边店','绿茵阁光明店','绿茵阁环市店','绿茵阁农林路店','绿茵阁区庄店','绿茵阁淘金店','绿茵阁五羊店','绿茵阁中二店','绿茵阁中华广场店','绿茵阁十甫名都店',
        '绿茵阁潮流店','绿茵阁东圃店','绿茵阁石牌店','绿茵阁体育西店','绿茵阁佳润店','绿茵阁万达广场店','绿茵阁新市店','绿茵阁莱茵店','绿茵阁易发店','绿茵阁黄埔店',
        '小肥羊广州小北店','小肥羊广州大北路店','小肥羊广州东晓店','小肥羊广州林乐路店','小肥羊广州五羊店','小肥羊广州新塘店','小肥羊广州盈丰路店','小肥羊广州兴旺店','小肥羊远景路店','大渔天河东店',
        '大渔越秀店','大渔万达店','大渔东方宝泰店','富田菊日本皇尚料理','富田菊铁板皇尚料理','富田寿司料理','九毛九赛马场店','九毛九水荫店','九毛九天河南店','九毛九江南西店',
        '九毛九天河北店','九毛九同和店','九毛九高德店','九毛九中四店','九毛九中五店','九毛九名盛店','九毛九广怡大厦店','九毛九佳润店','九毛九万达店','九毛九G5店'
        );

        var i = parseInt(22 * Math.random()) * 10 + parseInt(22 * Math.random());
        return familyNames[i];
    },

    // 生成随机身份证号
    getId_no:function(){
        var coefficientArray = [ "7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"];// 加权因子
        var lastNumberArray = [ "1","0","X","9","8","7","6","5","4","3","2"];// 校验码
        var address = "420101"; // 住址
        var birthday = "19810101"; // 生日
        var s = Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString();
        var array = (address + birthday + s).split(""); 
        var total = 0;
        for(i in array){
            total = total + parseInt(array[i])*parseInt(coefficientArray[i]);
        } 
        var lastNumber = lastNumberArray[parseInt(total%11)];
        var id_no_String = address + birthday + s + lastNumber;
        return id_no_String;
    },

    analysisFindeType:function(msg) {

        if (typeof(msg)!='object') {
            return -1; 
        }

        var findCombine = findCombine || [];
        //********* 1. 单一搜索 *********

        //商户商品搜索
        findCombine[0] = {'id':true};
        //商品模糊搜索       
        findCombine[1] = {'name':true}; 
        //商品Sku搜索
        findCombine[2] = {'sku':true};
        //商品类别搜索
        findCombine[3] = {'categoryid':true};
        //商品时间搜索 
        findCombine[4] = {'createdAt1':true,'createdAt2':true};
        //商品状态搜索 
        findCombine[5] = {'status':true};

        //********* 2. 组合搜索 *********

        //运营商 + 商品名称搜索
        findCombine[6] = {'id':true,'name':true};
        //运营商 + 商品编号搜索   
        findCombine[7] = {'id':true,'sku':true};
        //运营商 + 商品创建时间搜索 
        findCombine[8] = {'id':true,'createdAt1':true,'createdAt2':true};
        //运营商 + 商品类别搜索
        findCombine[9] = {'id':true,'categoryid':true};
        //运营商 + 商品状态搜索
        findCombine[10] = {'id':true,'status':true};

        //运营商 + 商品名称搜索 + 商品编号搜索
        findCombine[11] = {'id':true,'name':true,'sku':true};
        //运营商 + 商品名称搜索 + 商品创建时间搜索 
        findCombine[12] = {'id':true,'name':true,'createdAt1':true,'createdAt2':true};
        //运营商 + 商品名称搜索 + 商品类别搜索
        findCombine[13] = {'id':true,'name':true,'categoryid':true};
        //运营商 + 商品名称搜索 + 商品状态搜索
        findCombine[14] = {'id':true,'name':true,'status':true};

        //运营商 + 商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 
        findCombine[15] = {'id':true,'name':true,'sku':true,'createdAt1':true,'createdAt2':true};

        //运营商 + 商品名称搜索 + 商品编号搜索 + 商品类别搜索 
        findCombine[16] = {'id':true,'name':true,'sku':true,'categoryid':true};
        //运营商 + 商品名称搜索 + 商品编号搜索 + 商品状态搜索
        findCombine[17] = {'id':true,'name':true,'sku':true,'status':true};

        //运营商 + 商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 
        findCombine[18] = {'id':true,'name':true,'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true};
        //运营商 + 商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 + 商品状态搜索
        findCombine[19] = {'id':true,'name':true,'sku':true,'createdAt1':true,'createdAt2':true,'status':true};

        
        //运营商 + 商品编号搜索 + 商品创建时间搜索 
        findCombine[20] = {'id':true,'sku':true,'createdAt1':true,'createdAt2':true};
        //运营商 + 商品编号搜索 + 商品类别搜索 
        findCombine[21] = {'id':true,'sku':true,'categoryid':true};
        //运营商 + 商品编号搜索 + 商品状态搜索 
        findCombine[22] = {'id':true,'sku':true,'status':true};

        //运营商 + 商品编号搜索 + 商品类别搜索 + 商品状态搜索 
        findCombine[23] = {'id':true,'sku':true,'categoryid':true,'status':true};

        //运营商 + 商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 
        findCombine[24] = {'id':true,'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true};
        //运营商 + 商品编号搜索 + 商品创建时间搜索 + 商品状态搜索 
        findCombine[25] = {'id':true,'sku':true,'createdAt1':true,'createdAt2':true,'status':true};
        //运营商 + 商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 + 商品类别搜索 
        findCombine[26] = {'id':true,'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};

        //运营商 + 商品创建时间搜索 + 商品类别搜索 
        findCombine[27] = {'id':true,'createdAt1':true,'createdAt2':true,'categoryid':true};
        //运营商 + 商品创建时间搜索 + 商品状态搜索 
        findCombine[28] = {'id':true,'createdAt1':true,'createdAt2':true,'status':true};
        //运营商 + 商品创建时间搜索 + 商品类别搜索 + 商品状态搜索 
        findCombine[29] = {'id':true,'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};
        //运营商 + 商品类别搜索 + 商品状态搜索 
        findCombine[30] = {'id':true,'categoryid':true,'status':true};
        
        //********* 3. 组合搜索 *********

        //商品名称搜索 + 商品编号搜索   
        findCombine[31] = {'name':true,'sku':true};
        //商品名称搜索 + 商品创建时间搜索 
        findCombine[32] = {'name':true,'createdAt1':true,'createdAt2':true};
        //商品名称搜索 + 商品类别搜索
        findCombine[33] = {'name':true,'categoryid':true};
        //商品名称搜索 + 商品状态搜索
        findCombine[34] = {'name':true,'status':true};

        //商品名称搜索 + 商品编号搜索 + 商品创建时间搜索   
        findCombine[35] = {'name':true,'sku':true,'createdAt1':true,'createdAt2':true};
        //商品名称搜索 + 商品编号搜索 + 商品类别搜索
        findCombine[36] = {'name':true,'sku':true,'categoryid':true};
        //商品名称搜索 + 商品编号搜索 + 商品状态搜索
        findCombine[37] = {'name':true,'sku':true,'status':true};

        //商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 + 商品状态搜索    
        findCombine[38] = {'name':true,'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true};
        //商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 + 商品状态搜索    
        findCombine[39] = {'name':true,'sku':true,'createdAt1':true,'createdAt2':true,'status':true};

        //商品名称搜索 + 商品创建时间搜索 + 商品类别搜索   
        findCombine[40] = {'name':true,'createdAt1':true,'createdAt2':true,'categoryid':true};
        //商品名称搜索 + 商品创建时间搜索 + 商品状态搜索  
        findCombine[41] = {'name':true,'createdAt1':true,'createdAt2':true,'status':true};

        //商品名称搜索 + 商品创建时间搜索 + 商品类别搜索 + 商品状态搜索  
        findCombine[42] = {'name':true,'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};

        //商品名称搜索 + 商品类别搜索 + 商品状态搜索  
        findCombine[43] = {'name':true,'categoryid':true,'status':true};

        //商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 + 商品状态搜索   
        findCombine[44] = {'name':true,'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};


        //********* 4. 组合搜索 *********

        //商品编号搜索 + 商品创建时间搜索 
        findCombine[45] = {'sku':true,'createdAt1':true,'createdAt2':true};
        //商品编号搜索 + 商品类别搜索
        findCombine[46] = {'sku':true,'categoryid':true};
        //商品编号搜索 + 商品状态搜索  
        findCombine[47] = {'sku':true,'status':true};
        //商品编号搜索 + 商品创建时间搜索 + 商品类别搜索
        findCombine[48] = {'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true};
        //商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 + 商品状态搜索  
        findCombine[49] = {'sku':true,'createdAt1':true,'createdAt2':true,'status':true};
        //商品编号搜索 + 商品类别搜索 + 商品状态搜索  
        findCombine[50] = {'sku':true,'categoryid':true,'status':true};
        //商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 + 商品状态搜索  
        findCombine[51] = {'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};

        // 商品创建时间搜索 + 商品类别搜索  
        findCombine[52] = {'createdAt1':true,'createdAt2':true,'categoryid':true};
        // 商品创建时间搜索 + 商品状态搜索  
        findCombine[53] = {'createdAt1':true,'createdAt2':true,'status':true};
        // 商品创建时间搜索 + 商品类别搜索 + 商品状态搜索  
        findCombine[54] = {'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};


        // 商品类别搜索 + 商品状态搜索  
        findCombine[55] = {'categoryid':true,'status':true};

        //********* 5. 全key搜索 *********

        //运营商 + 商品名称搜索 + 商品编号搜索 + 商品创建时间搜索 + 商品类别搜索 
        findCombine[56] = {'id':true,'name':true,'sku':true,'createdAt1':true,'createdAt2':true,'categoryid':true,'status':true};

        //匹配搜索
        for(var i = 0; i<findCombine.length; i++){
            var obj = findCombine[i],isOk = true;

            var ojb_count = 0;
            for (key in obj) {
                ojb_count = ojb_count + 1;
            }

            var msg_count = 0; 
            for(key in msg){
                msg_count = msg_count + 1;
            }

            if (ojb_count == msg_count) {

                for(key in msg){
                    if (!obj[key]) {
                        isOk = false
                        break;
                    }
                }

                if (isOk){
                    return i;
                } 
            }
        }

        return -1;
    },
    saveUserToken: function (account) {
        var client = redis.client();

        var tokenId = this.generateToken(account);
        var oldKey=tokenId.substring(tokenId.lastIndexOf(".")+1);
        oldKey+=this.generateMixed(6,false);
        var cmd5 = crypto.createHash("md5");
        var key = cmd5.update(oldKey).digest("hex");
        client.set(key, tokenId);
        client.expire(key,86400*7);
        return key;
    },
    generateToken: function (source) {
        var date = new Date();
        var secret = "darling" + (date.getMonth() + 1 + ":" + date.getFullYear());
        return jwt.encode(source, secret);
    },
    decodeToken: function (token) {
        var date = new Date();
        var secret = "darling" + (date.getMonth() + 1 + ":" + date.getFullYear());

        try{
            return jwt.decode(token, secret);
        }catch (e){
            return false;
        }

    },

    isPushCategorety:function(obj_arr,parent_ojb){
        for(var i = 0;i<obj_arr.length;i++){
            var obj = obj_arr[i];
            console.log('obj: check it out: ',obj);
            if (obj.parent.id == parent_ojb.id) {

            }
        }
    },

    

    setHorizontalAlliancesList:function(list){
        this.mHorizontalAlliancesList = list;
    },

    getHorizontalAlliancesList:function(){
        return this.mHorizontalAlliancesList;
    },
    
    hashClassify:function(classify){
        var str = '';
        for(var i = 0;i<classify.length;i++){
            var obj = classify[i];

            str+=obj.id+'[.]';
            str+=obj.storecategoryid+'[.]'
            str+=obj.sortorder;
            if (i < classify.length -1) {
                str+='|';
            }
        }
        return str;
    },
    hashHorizontalAlliances:function(storeidArray){
        var str = '';
        for(var i = 0;i<storeidArray.length;i++){
            var obj = storeidArray[i];

            str+=obj.storeid+'[.]';
            str+=obj.name+'[.]'
            str+=obj.sortorder;
            if (i < classify.length -1) {
                str+='|';
            }
        }
        return str;
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 

// Date.prototype.Format = function(fmt)   
// { //author: meizz   
//   var o = {   
//     "M+" : this.getMonth()+1,                 //月份   
//     "d+" : this.getDate(),                    //日   
//     "h+" : this.getHours(),                   //小时   
//     "m+" : this.getMinutes(),                 //分   
//     "s+" : this.getSeconds(),                 //秒   
//     "q+" : Math.floor((this.getMonth()+3)/3), //季度   
//     "S"  : this.getMilliseconds()             //毫秒   
//   };   
//   if(/(y+)/.test(fmt))   
//     fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
//   for(var k in o)   
//     if(new RegExp("("+ k +")").test(fmt))   
//   fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
//   return fmt;   
// };

// Array.prototype.remove = function(val) {
    
//     var index = this.indexOf(val);
//     if (index > -1) {
//         this.splice(index, 1);
//     }
// };

// if (!Array.prototype.includes) {
//   Object.defineProperty(Array.prototype, 'includes', {
//     value: function(searchElement, fromIndex) {

//       // 1. Let O be ? ToObject(this value).
//       if (this == null) {
//         throw new TypeError('"this" is null or not defined');
//       }

//       var o = Object(this);

//       // 2. Let len be ? ToLength(? Get(O, "length")).
//       var len = o.length >>> 0;

//       // 3. If len is 0, return false.
//       if (len === 0) {
//         return false;
//       }

//       // 4. Let n be ? ToInteger(fromIndex).
//       //    (If fromIndex is undefined, this step produces the value 0.)
//       var n = fromIndex | 0;

//       // 5. If n ≥ 0, then
//       //  a. Let k be n.
//       // 6. Else n < 0,
//       //  a. Let k be len + n.
//       //  b. If k < 0, let k be 0.
//       var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

//       // 7. Repeat, while k < len
//       while (k < len) {
//         // a. Let elementK be the result of ? Get(O, ! ToString(k)).
//         // b. If SameValueZero(searchElement, elementK) is true, return true.
//         // c. Increase k by 1.
//         // NOTE: === provides the correct "SameValueZero" comparison needed here.
//         if (o[k] === searchElement) {
//           return true;
//         }
//         k++;
//       }

//       // 8. Return false
//       return false;
//     }
//   });
// }  

// function clone(obj) {
//     var o;
//     if (typeof obj == "object") {
//         if (obj === null) {
//             o = null;
//         } else {
//             if (obj instanceof Array) {
//                 o = [];
//                 for (var i = 0, len = obj.length; i < len; i++) {
//                     o.push(clone(obj[i]));
//                 }
//             } else {
//                 o = {};
//                 for (var j in obj) {
//                     o[j] = clone(obj[j]);
//                 }
//             }
//         }
//     } else {
//         o = obj;
//     }
//     return o;
// }