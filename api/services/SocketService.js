/**
 * Created by Zhang Kun for Socket on 2017/9/15.
 * ---------------------------------------------------------------------------------------------------------
 * Remember, the brick walls are there for a reason. The brick walls are not there to keep us out. 
 * The brick walls are there to give us a chance to show how badly we want someting. 
 * Because the brick walls are there to stop the people who don't want it badly enough. 
 * They're there to stop the other people. 
 * ---- Randy Frederick Pausch
 **/

module.exports = {
    refundMsg: function (sender, refundrnumber, receiver, cb) {
        var data = {
            sender: sender,
            refundrnumber: refundrnumber,
            receiver: receiver,
            message: "",
            isRead: 0,
            isPic: "0",
            tableName: "userchatmsg" + ((new Date()).Format("yyyyMM")),
            createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            updatedAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
        }

        UserchatTemplate.findOne({ storeName: sender }).exec(function (err, results) {
            
            if (err) {
                sails.log(err);
                return cb(err, -1);
            }
            if(!results) {
                    console.log(result);
                    return cb(null, "StoreName Not Found!");
            }
            
            var list = eval('('+results.message+')');

            for (var i = 0; i < list.length; i++){
                if(list[i].default) 
                    data.message = list[i].text;
            }

            var keys = [], values = [];
            for (var key in data) {
                keys.push(key);
                values.push("'" + data[key] + "'");
            }
            var sql = "insert into " + data.tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
            console.log('SocketService  sql',sql);
            UserchatMsg.query(sql, function (err, result) {
                if (err) {
                    sails.log(err);
                    return cb(err, -1);
                }
                if(result) {
                    console.log(result);
                    return cb(null, "商家换货/退货");
                }
            });
        });
    },

    agreedMsg: function (sender, refundrnumber, receiver, cb) {
        var data = {
            sender: sender,
            refundrnumber: refundrnumber,
            receiver: receiver,
            message: "商家已同意",
            isRead: 0,
            isPic: "0",
            tableName: "userchatmsg" + ((new Date()).Format("yyyyMM")),
            createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            updatedAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
        }
        var keys = [], values = [];
        for (var key in data) {
            keys.push(key);
            values.push("'" + data[key] + "'");
        }
        var sql = "insert into " + data.tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";

        UserchatMsg.query(sql, function (err, result) {
            if (err) {
                sails.log(err);
                return cb(err, -1);
            }
            if(result) {
                console.log(result);
                return cb(null, "商家已同意");
            }
        });
    },

    redFlag: function (refundrnumber, receiver, cb) {
        UserchatMsg.findOne({ refundrnumber: refundrnumber, receiver:receiver }).exec(function (err, result) {
            if (err) {
                sails.log(err);
                return cb(err, -1);
            }
            if (!result) {
                return cb(null, 0);
            }
            if(result) {
                console.log(result);
                return cb(null, 1);
            }
        });
    },

    destroyChat: function () {
        Userchat.destroy().exec(function (err, userResults) {
            if (err) {
                sails.log(err);
                return;
            }
            if (userResults.length == 0) {
                return;
            }
            console.log("Chat Cleanup Done");
        });
    },
    destroyNotification: function () {
        NotifyOnline.destroy().exec(function (err, userResults) {
            if (err) {
                sails.log(err);
                return;
            }
            if (userResults.length == 0) {
                return;
            }
            console.log("Notification Cleanup Done");
        });
    },
    destroy: function (socket) {
        //console.log("destroy: room. ",room,sails.sockets.rooms());
        Userchat.destroy({ socketId: socket.id }).exec(function (err, userResults) {
            if (err) {
                sails.log(err);
                return;
            }
            if (userResults.length == 0) {
                return;
            }
            sails.sockets.leave(socket, userResults[0].room);
        });
    },
}