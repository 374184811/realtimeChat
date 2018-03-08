/**
 * Userchat.js
 * This is Zhang Kun's work for notification communications
 * -----------------------------------------------------------------------------------------------
 * Our destiny offers not the cup of despair, but the chalice of opportunity. 
 * ---- Richard Nixon, American president
 **/

module.exports = {
    tableName: "notifyrecord",
    attributes: {
        sender: {
            type: 'string',
        },
        roomName: {
            type: 'string',
        },
        receiver: {
            type: 'string',
        },
        message: {
            type: 'string',
        },
        isRead: {
            type: 'string',
        },
        socketId: {
            type: 'string',
        },
        session: {
            type: 'string',
        },
        platform: {
            type: 'string',
        },
        deviceToken: {
            type: 'string',
        },
        expireAt: {
            type: 'string',
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,

    createTable: function (tableName, next) {
        var createSql = "create table " + tableName + " like notifyrecord";
        NotifyRecord.query(createSql, function (err, val) {
            return next(err, val);
        });
    },
    createLog: function (msg, next) {
        var tableName = "notifyrecord" + ((new Date()).Format("yyyyMM"));
        NotifyRecord.query("show TABLES like '"+tableName+"'",function (err,tb) {
            if(tb.length>0){
                console.log(tableName+"表已存在");
                var keys = [], values = [];
                for (var key in msg) {
                    keys.push(key);
                    values.push("'" + msg[key] + "'");
                }
                
                var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
                console.log(sql);
                NotifyRecord.query(sql, next);
            }else{
                console.log("创建新表"+tableName);
                NotifyRecord.createTable(tableName,function (err, table) {
                    var keys = [], values = [];
                    for (var key in msg) {
                        keys.push(key);
                        values.push("'" + msg[key] + "'");
                    }
                    
                    var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
                    console.log(sql);
                    NotifyRecord.query(sql, next);
                });
            }
        });
    }
    
};