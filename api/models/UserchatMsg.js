/**
 * UserchatMsg.js
 * This is Zhang Kun's work for real time communications
 * -----------------------------------------------------------------------------------------------
 * It is well that war is so terrible, or we 
 * should grow too fond of it. 
 * ---- Robert E. Lee
 **/

module.exports = {
    tableName: "userchatmsg",
    attributes: {
        sender: {
            type: 'string',
        },
        receiver: {
            type: 'string',
        },
        isPic: {
            type: 'string',
        },
        refundrnumber: {
            type: 'string',
        },
        socketId: {
            type: 'string',
        },
        message: {
            type: 'string',
        },
        isRead: {
            type: 'integer',
        },
        tableName: {
            type: 'string',
        },
        session: {
            type: 'string',
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,

    createTable: function (tableName, next) {
        var createSql = "create table " + tableName + " like userchatmsg";
        UserchatMsg.query(createSql, function (err, val) {
            return next(err, val);
        });
    },
    createLog: function (msg, next) {
        var tableName = "userchatmsg" + ((new Date()).Format("yyyyMM"));
        UserchatMsg.query("show TABLES like '"+tableName+"'",function (err,tb) {
            if(tb.length>0){
                console.log(tableName+"表已存在");
                var keys = [], values = [];
                for (var key in msg) {
                    keys.push(key);
                    values.push("'" + msg[key] + "'");
                }
                
                var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
                console.log(sql);
                UserchatMsg.query(sql, next);
            }else{
                console.log("创建新表"+tableName);
                UserchatMsg.createTable(tableName,function (err, table) {
                    var keys = [], values = [];
                    for (var key in msg) {
                        keys.push(key);
                        values.push("'" + msg[key] + "'");
                    }
                    
                    var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
                    console.log(sql);
                    UserchatMsg.query(sql, next);
                });
            }
        });
    }
};
