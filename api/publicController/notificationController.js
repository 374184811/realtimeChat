/**
 * notificationController
 * This is Zhang Kun's work for notifications on 2017/10/1
 * -----------------------------------------------------------------------------------------------
 * All things of Halloween, including costumes, pumpkins, monsters, vampires, 
 * witches, werewolves, ghosts,...
 * 
 **/
const apn = require("apn");
module.exports = {
    //------------------------------------------------客户端消息推送---------------------------------------------

    //------------------------------------------------All Stuff of Android APIs------------------------------------------

    //-----------------------------All Sorts of Notification Socket Stuff-----------------------------------
    /*
        Create a socket for merchants, and then join the room
        API: /notification/createClient
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
    */
    create: function (req, res) {

        var nickName= req.param('nickName', ''),
            storeId= parseInt(req.param('storeId', '4')),
            phoneArray = req.param('phoneArray', ''),
            socket= req.socket,
            session= req.session;

        if (nickName == '') {
            nickName = session.nickName || ('Guest' + Math.round(Math.random() * 100000));
        }

        phoneArray.forEach(function(elem,key){
            //Join the party.
            //let's play costume parties and trick-or-treating!
            //Ah, Ah, Ah...
            sails.sockets.join(socket, elem.usermobile);
            console.log(nickName+" joined the room: "+elem.usermobile+", with socketId "+socket.id);
        });

        return res.json({
            "success": true,
            "msgCode": 200,
            "msg": phoneArray.length + " users joined all rooms",
        });
    },
    /*
        Create a socket for client, then join the room
        API: /notification/createClient
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
    */
    createClient: function (req, res) {
        console.log('createClient: This is the function entry.  check it out: ');
        var options = {
            nickName: req.param('nickName', ''),
            roomName: req.param('roomName', ''),
            socket: req.socket,
            session: req.session,
        }

        if (options.nickName == '') {
            options.nickName = options.session.nickName || ('Guest' + Math.round(Math.random() * 100000));
        }

        NotifyOnline.destroy({roomName: options.roomName, userName: options.nickName}).exec(function (err, userResults) {
           if(err) return res.negotiate(err);
            // if (userResults.length > 0) {
            //     sails.sockets.leave(socket, options.roomName);//must be that user socket
            // }

            return NotifyOnline
                .create({ userName: options.nickName.trim(), socketId: options.socket.id, roomName: options.roomName})
                .then(function (userResult) {
                    //Join the party.
                    //Come on, Babie, let's go party!
                    //Oh, Oh, Oh...
                    sails.sockets.join(options.socket, options.roomName);
                    console.log(options.nickName+" joined the room: "+options.roomName+", with socketId "+options.socket.id);
                    return res.json({
                        "success": true,
                        "msgCode": 200,
                        "msg": "TCP sets up with a room joined",
                    });

                }).catch(function (err) {
                    sails.log.error('On socket create interface, catch:\n', err);
                    if (err.message.indexOf('A record with that `nickName` already exists') >= 0) {
                        return res.json({
                            "success": false,
                            "msgCode": 404,
                            "msg": "BadRequest",
                        });
                    }

                    return res.json({
                            "success": false,
                            "msgCode": 400,
                            "msg": "ServerError",
                    });
                });
      
        });
    },
    /*
        Destroy a socket, leaving the room
        API: /notification/destroy
        parameters: nickName, refundrnumber, socketId
        return：{'success': true,'code':200,"msg": "打令智能 left the room 600000000013432"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    destroy: function (req, res) {
        var options = {
            roomName: req.param('roomName', ''),
            nickName: req.param('nickName', ''),
            socketId: req.param('socketId', ''),
            socket: req.socket,
            session: req.session,
        }
        
        NotifyOnline.destroy({userName: options.nickName, socketId: options.socketId}).exec(function (err, userResults) {
            if (err) {
                console.log(err);
                return;
            }
            if (!userResults[0]) {
                return res.json({
                    "success": false,
                    "msgCode": 404,
                    "msg": "NOT FOUND",
                });
            }
            sails.sockets.leave(options.socket, options.roomName);
            console.log(options.nickName + " left the room: " + options.roomName);
            return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": options.nickName + " left the room: " + options.roomName,
            });
        });
    },
    //--------------------------All sorts of message stuff-------------------------------------
    /*
        identify which os using
        API: /notification/identifyDevice
        parameters: usermobile, os, deviceToken
        return：{'code':200,"msg": "ALL SET"}
                {'code':400,"msg": err}
    */
    identifyDevice: function (req, res) {
        console.log('identifyDevice: This is the function entry.  check it out: ');

        var usermobile = req.param('usermobile', '');
        var os = req.param('os', '');
        var deviceToken = req.param('deviceToken', '');

        Account.update({usermobile: usermobile}).set({os: os, deviceToken: deviceToken}).exec(function(err, results){
            if (err) return res.negotiate(err);
            
            if (!results[0]) {
                return res.json({
                    "success": false,
                    "msgCode": 404,
                    "msg": "NOT FOUND",
                });
            }

            return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "ALL SET",
            });            

        });
    },
    /*
        Texting messages in the room
        API: /notification/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_MESSAGE_SUCCESS"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    sendMsg_android: function (req, res, phoneArray, callback) {

        var msg = req.param('msg', '');
        console.log(phoneArray);

        //scan all users 
        async.mapSeries(phoneArray, function(item,callback){           
            //check who's online
            NotifyOnline.find({userName: item.usermobile, roomName: item.usermobile}).exec(function (err, userResult) {
                if (err) return res.negotiate(err);
                
                var message = {
                    sender: req.param('storeName', ''),
                    receiver: item.usermobile,
                    roomName: item.usermobile,
                    socketId: req.socket.id,
                    message: msg,
                    isRead: userResult.length,
                    session: '',
                    platform: '',
                    deviceToken: '',
                    expireAt: req.param('expireAt', ''),
                    createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                    updatedAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),

                };

                sails.sockets.broadcast(item.usermobile, 'notification', message);

                NotifyRecord.createLog(message, function (err, record) {
                    if (err) return res.negotiate(err);
                    callback(null, message);
                });
            });
        },function(err,results){
                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "SEND_MESSAGE_SUCCESS",
                    "results": results,
                });
        });
        
    },
    sendMsg: function (req, res) {
        // async.parallel({
        //     one: function(callback) {
        //         setTimeout(function() {
        //             callback(null, 1);
        //         }, 200);
        //     },
        //     two: function(callback) {
        //         setTimeout(function() {
        //             callback(null, 2);
        //         }, 100);
        //     }
        // }, function(err, results) {
        //     // results is now equals to: {one: 1, two: 2}
        // });
        var phoneArray = req.param('phoneArray', ''),
            msg = req.param('msg', ''),
            phoneArray_android = [],
            phoneArray_ios = [],
            output = [];
        console.log(phoneArray);

        for (var i = 0; i < phoneArray.length; i++){
            if (phoneArray[i].deviceToken) {
                phoneArray_ios.push(phoneArray[i])
            }else{
                phoneArray_android.push(phoneArray[i])
            }
        }

        async.parallel({
            one: function(cb) {
                //sendMsg_android(req, res, phoneArray_android, function(){callback(null, 1);});
                console.log(phoneArray);
                //scan all users 
                async.mapSeries(phoneArray_android, function(item,callback){                   
                    //check who's online
                    NotifyOnline.find({userName: item.usermobile, roomName: item.usermobile}).exec(function (err, userResult) {
                        if (err) return res.negotiate(err);
                        
                        var message = {
                            sender: req.param('storeName', ''),
                            receiver: item.usermobile,
                            roomName: item.usermobile,
                            socketId: req.socket.id,
                            message: msg,
                            isRead: userResult.length,
                            session: '',
                            platform: 'android',
                            deviceToken: '',
                            expireAt: req.param('expireAt', ''),
                            createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                            updatedAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),

                        };

                        //sails.sockets.broadcast(item.usermobile, 'notification', message, req.socket);
                        NotifyMsg.create(message).exec(function (err, record) {
                            if (err) return res.negotiate(err);
                            console.log("The Message " + record.id + ", " + record.message + ", Is Being Sending To " + item.usermobile);
                            //console.log(record);
                            sails.sockets.broadcast(item.usermobile, 'notification', record);
                            callback(null, message);                       
                        });
                    });
                },function(err,results1){
                    console.log("Android Accounts Are All Set, My Lord.");
                    cb(null, results1);
                });
            },
            two: function(cb) {
                //sendMsg_ios(req, res, phoneArray_ios, callback);

                //var message = req.param('msg', '');;
                var options = {
                    cert: './certificate/devpush.pem',
                    key: './certificate/devkey.pem',
                    passphrase: '123456',
                    production: false,
                };

                var apnProvider = new apn.Provider(options);
                var note = new apn.Notification();

                note.alert = msg;
                note.payload = {'messageFrom':'U SUCK!'};    

                async.mapSeries(phoneArray_ios, function(item, callback){

                    //check who's online
                    NotifyOnline.find({userName: item.usermobile, roomName: item.usermobile}).exec(function (err, userResult) {
                        if (err) return res.negotiate(err);

                        var deviceToken = item.deviceToken;  
                        
                        apnProvider.send(note, deviceToken).then(function(result){
                            //console.log("phone Number: ",item.usermobile);
                            //console.log("sent: ",result.sent);
                            //console.log("err: ",result.failed);
                            if (result.failed){
                                callback(result.failed, result);
                            }
                    
                        });

                        var message = {
                            sender: req.param('storeName', ''),
                            receiver: item.usermobile,
                            roomName: item.usermobile,
                            socketId: req.socket.id,
                            message: msg,
                            isRead: userResult.length,
                            session: '',
                            platform: 'ios',
                            deviceToken: deviceToken,
                            expireAt: req.param('expireAt', ''),
                            createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                            updatedAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),

                        };

                        NotifyMsg.create(message).exec(function (err, record) {
                            if (err) return res.negotiate(err);
                            callback(null, message);                       
                        });

                    });
                },function(err,results2){
                    console.log("Apple Accounts Are All Set, My Lord.");
                    apnProvider.shutdown();
                    cb(null, results2);
                });
            }

        },function(err,results){
            var storedata = [];
            storedata = storedata.concat(results.one,results.two);

            //console.log(storedata);
            storedata.forEach(function(elem,key){
                NotifyRecord.createLog(elem, function (err, record) {
                    if (err) return res.negotiate(err);                       
                });
            });
            return res.json({
                "success": true,
                "msgCode": 200,
                "msg": "SEND/STORE_MESSAGES_SUCCESS",
                //"results": storedata,
            });
        });
        
    },
    /*
        Acknowledge messages received
        API: /notification/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_ACK_SUCCESS"}
    */
    sendAck: function (req, res) {

        var id = parseInt(req.param('id', ''));
        
        NotifyMsg.destroy({id: id}).exec(function (err, record) {
            if (err) return res.negotiate(err);     
            
            console.log('sendACK user: '+record[0].receiver + ' received the message '+id+', '+record[0].message);

            return res.json({
                "success": true,
                "msgCode": 200,
                "msg": record[0].receiver + " SEND_ACK_SUCCESS",
            }); 
        }); 
        //sails.sockets.broadcast(usermobile, 'notification', message, req.socket);                    
    },
    /*
        Resend messages lost
        API: /notification/resendMsg
        parameters: 
        return：{'success': true,'code':200,"msg": "RESEND_MSG_SUCCESS"}
    */
    resendMsg: function (req, res) {

        var time = (new Date()).Format("yyyy-MM-dd hh:mm:ss");

        NotifyMsg.find({}).exec(function (err, userResult) {
            if (err) return res.negotiate(err); 
            console.log('resendMsg.length '+userResult.length); 

            async.mapSeries(userResult, function(item,callback){ 
                NotifyMsg.destroy({expireAt: {'<':time}}).exec(function (err) {
                    if (err) return res.negotiate(err); 
                    sails.sockets.broadcast(item.roomName, 'notification', item);
                    console.log('roomName: '+item.roomName);
                    console.log(item);
                    console.log('The message, '+item.message +" is sent to "+ item.receiver);

                //NotifyMsg.destroy({or:[{id: item.id},{expireAt: {'<':time}}]}).exec(function (err) {
                //    if (err) return res.negotiate(err); 
                    callback(null, 'resendMsg'); 
                });
            },function(err,results){

                //cb(null, results);
                console.log("RESEND_MSG_SUCCESS AT "+time);
                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "RESEND_MSG_SUCCESS AT "+time,
                });
            });
        });                    
    },
    /*
        Store history messages in the chat room
        API: /notification/loadMsg
        parameters: page, refundrnumber
        return：{'code':200,"msg": "STORE_MESSAGE_SUCCESS"}
                {'code':400,"msg": err}
    */
    storeMsg: function (req, res) {
        console.log('storeMsg: This is the function entry.  check it out: ');

        var msgArray = req.param('results', '');

        msgArray.forEach(function(elem,key){
            if (elem.isRead==0) {
                NotifyMsg.create(elem).exec(function (err, msg) {
                    if (err) return res.negotiate(err);
                    
                });
            }

            if (key==msgArray.length-1){
                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "STORE_MESSAGE_SUCCESS",
                });
            }   
        });
 
    },
    /*
        Load history messages in the chat room
        API: /notification/loadMsg
        parameters: page, refundrnumber
        return：{'code':200,"msg": "message"}
                {'code':400,"msg": err}

    */
    loadMsg1: function (req, res) {
        console.log('loadMsg: This is the function entry.  check it out: ');

        var socket = req.socket,
        session = req.session,
        receiver = req.param('receiver', ''),
        roomName = req.param('roomName', '');
 
        NotifyMsg.find({
            where: { receiver: receiver, roomName: roomName },
            sort: 'createdAt ASC'
        }).exec(function(err, results){
            if (err) return res.negotiate(err);

            NotifyMsg.destroy({receiver: receiver, roomName: roomName}).exec(function (err, userResults) {
                if (err) return res.negotiate(err);

                if (!userResults[0]) {
                    return res.json({
                        "success": false,
                        "msgCode": 404,
                        "msg": "NOT FOUND",
                    });
                }

                return res.json({
                        "success": true,
                        "msgCode": 200,
                        "msg": "LOAD SUCCESSFULLY",
                        "result": results,
                });            
            });
        });
    },
    loadMsg: function (req, res) {
        console.log('loadMsg: This is the function entry.  check it out: ');

        var socket = req.socket,
        session = req.session,
        receiver = req.param('receiver', ''),
        roomName = req.param('roomName', ''),
        time = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
 
        NotifyMsg.destroy({expireAt: {'<':time}}).exec(function(err, results){
            if (err) return res.negotiate(err);

            NotifyMsg.destroy({receiver: receiver, roomName: roomName}).exec(function (err, userResults) {
                if (err) return res.negotiate(err);

                // if (!userResults[0]) {
                //     return res.json({
                //         "success": false,
                //         "msgCode": 404,
                //         "msg": "NOT FOUND",
                //     });
                // }

                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "LOAD SUCCESSFULLY",
                    "result": userResults,
                });            
            });
        });
    },
    //------------------------------------------------This is the End of Android APIs------------------------------------------

    //-------------------------------------------------All Stuff of Apple APIs-------------------------------------------------
        /*
        Texting notifications in the room for apple
        API: /notification/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_MESSAGE_SUCCESS"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    sendMsgios: function (req, res) {

        var deviceToken = req.param('deviceToken', '32f0f4e0d08b993b4b867152b2beb8930736fe3526347a9cf0742dd08f1873b4');
        var message = 'U got a new income, babie!!!';

        var options = {
            cert: './certificate/devpush.pem',
            key: './certificate/devkey.pem',
            passphrase: '123456',
            production: false,
        };

        var apnProvider = new apn.Provider(options);
        var note = new apn.Notification();

        note.alert = message;
        note.payload = {'messageFrom':'U SUCK!'};      
        
        apnProvider.send(note, deviceToken).then(function(result){
            console.log("sent: ",result.sent);
            console.log("err: ",result.failed);
        });

        apnProvider.shutdown();

        return res.json({
            "success": true,
            "msgCode": 200,
            "msg": "SEND_MESSAGE_SUCCESS",
            "result": message,
        });  
    },
    sendMsg_ios: function (req, res, phoneArray, callback) {

        var message = req.param('msg', '');;

        var options = {
            cert: './certificate/devpush.pem',
            key: './certificate/devkey.pem',
            passphrase: '123456',
            production: false,
        };

        var apnProvider = new apn.Provider(options);
        var note = new apn.Notification();

        note.alert = message;
        note.payload = {'messageFrom':'U SUCK!'};    

        async.mapSeries(phoneArray, function(item, callback){

            var deviceToken = item.deviceToken;  
            
            apnProvider.send(note, deviceToken).then(function(result){
                console.log("phone Number: ",item.usermobile);
                console.log("sent: ",result.sent);
                console.log("err: ",result.failed);
                callback(null, result);
            });

        },function(err,results){
            apnProvider.shutdown();

            return res.json({
                "success": true,
                "msgCode": 200,
                "msg": "SEND_MESSAGE_SUCCESS",
                "results": results,
            });
        });
    },

};
