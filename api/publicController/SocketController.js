/**
 * SocketController
 * This is Zhang Kun's work for real time communications on 2017/9/15
 * -----------------------------------------------------------------------------------------------
 * The world can be changed by man's endeavor, and that this endeavor can lead to something new and better. 
 * No man can sever the bonds that unite him to his society simply by averting his eyes. 
 * He must ever be receptive and sensitive to the new; 
 * and have sufficient courage and skill to face novel facts and to deal with them.  
 * ---- Franklin Roosevelt, American president
 **/

module.exports = {
    //-----------------------------------售后商家与客户聊天---------------------------------------

    //-----------------------------All sorts of socket stuff-----------------------------------
    /*  Old version:
        Create a socket, then join the room, and finally clear isRead
        API: /Socket/create
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
                {"success": false,'code':401,"msg": "打令智能 already in the room!"}
    */
    createold: function (req, res) {

        var options = {
            nickName: req.param('nickName', ''),
            roomName: req.param('refundrnumber', ''),
            socket: req.socket,
            session: req.session,
        }
        var tableName = req.param('tableName', '');

        if (options.nickName == '') {
            options.nickName = options.session.nickName || ('Guest' + Math.round(Math.random() * 100000));
        }
        console.log(options.nickName+" joined the room: "+options.roomName+", with socketId "+options.socket.id);

        Userchat.find({refund_num: options.roomName, nickName: options.nickName}).exec(function (err, userResults) {
            if(err) return res.negotiate(err);
            if(userResults.length >= 1){
                return res.json({
                    "success": true,
                    "msgCode": 401,
                    "msg": options.nickName + " 已经在聊天室了!",
                });
            }else{
                return Userchat
                .create({ nickName: options.nickName.trim(), socketId: options.socket.id, refund_num: options.roomName})
                .then(function (userResult) {
                    //Join the party.
                    //Come on, Babie, let's go party!
                    //Oh, Oh, Oh...
                    sails.sockets.join(options.socket, options.roomName);
                    if (tableName.length > 0) {
                        //----------------------------------create tables and clear isRead---------------------------------------
                        var month=parseInt(tableName.substring(15));
                        var table = [];

                        for (var i = 0; month <= parseInt((new Date()).Format("MM")); month++, i++){
                            var month_str = '';
                            if (month.toString().length==1) {
                                month_str = '0' + month;             
                                table[i] = 'userchatmsg2017' + month_str;
                            }else{
                                table[i] = 'userchatmsg2017' + month;
                            }
                        }
                        table.forEach(function(elem,i){
                        //for (var i = 0; i < table.length; i++) {
                            var sqltext = 'update '+table[i]+' set isRead=1 where refundrnumber="'+ options.roomName+'" and isRead=0 and receiver="'+options.nickName+'"';
                            console.log(sqltext);
                            UserchatMsg.query(sqltext, function(err, results) {
                            //UserchatMsg.update({refundrnumber: options.roomName, receiver: options.nickName, isRead: 0}).set({isRead: 1}).exec(function(err,insert){
                                if (err) {
                                    return res.negotiate(err);
                                }
                                if (i==table.length-1){
                                    return res.json({
                                        "success": true,
                                        "msgCode": 200,
                                        "msg": "TCP sets up with a room joined",
                                        "result": userResult,
                                    });
                                }
                            });
                        });
                    }else{
                        return res.json({
                            "success": true,
                            "msgCode": 200,
                            "msg": "TCP sets up with a room joined",
                            "result": userResult,
                        });
                    }

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
            }        
        });
    },
    /*
        Create a socket for merchants, then join the room, and finally clear isRead
        API: /Socket/createClient
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
    */
    create: function (req, res) {

        var options = {
            nickName: req.param('nickName', ''),
            roomName: req.param('refundrnumber', ''),
            socket: req.socket,
            session: req.session,
        }
        var tableName = req.param('tableName', '');

        if (options.nickName == '') {
            options.nickName = options.session.nickName || ('Guest' + Math.round(Math.random() * 100000));
        }

        //Userchat.destroy({refund_num: options.roomName, nickName: options.nickName}).exec(function (err, userResults) {
            //if(err) return res.negotiate(err);
            // if (userResults.length > 0) {
            //     sails.sockets.leave(socket, options.roomName);
            // }

            return Userchat
                .create({ nickName: options.nickName.trim(), socketId: options.socket.id, refund_num: options.roomName})
                .then(function (userResult) {
                    //Join the party.
                    //Come on, Babie, let's go party!
                    //Oh, Oh, Oh...
                    sails.sockets.join(options.socket, options.roomName);
                    console.log(options.nickName+" joined the room: "+options.roomName+", with socketId "+options.socket.id);
                    if (tableName.length > 0) {
                        //----------------------------------create tables and clear isRead---------------------------------------
                        //var month=parseInt(tableName.substring(tableName.length-2));
                        var table = [];

                        for (var i = 0; i < 3; i++){
                            var d = new Date();
                            var time = d.setMonth(d.getMonth()-i);
                            table[i] = 'userchatmsg' + (new Date(time)).Format("yyyyMM");
                        }

                        // for (var i = 0; month <= parseInt((new Date()).Format("MM")); month++, i++){
                        //     var month_str = '';
                        //     if (month.toString().length==1) {
                        //         month_str = '0' + month;             
                        //         table[i] = 'userchatmsg2017' + month_str;
                        //     }else{
                        //         table[i] = 'userchatmsg2017' + month;
                        //     }
                        // }
                        table.forEach(function(elem,i){
                            var sqltext = 'update '+table[i]+' set isRead=1 where refundrnumber="'+ options.roomName+'" and isRead=0 and receiver="'+options.nickName+'"';
                            console.log(sqltext);
                            UserchatMsg.query(sqltext, function(err, results) {
                                if (err) {
                                    return res.negotiate(err);
                                }
                                if (i==table.length-1){
                                    return res.json({
                                        "success": true,
                                        "msgCode": 200,
                                        "msg": "TCP sets up with a room joined",
                                        "result": userResult,
                                    });
                                }
                            });
                        });
                    }else{
                        return res.json({
                            "success": true,
                            "msgCode": 200,
                            "msg": "TCP sets up with a room joined",
                            "result": userResult,
                        });
                    }

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
      
        //});
    },
    /*
        Create a socket for client, then join the room, and finally clear isRead
        API: /Socket/createClient
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
    */
    createClient: function (req, res) {

        var options = {
            nickName: req.param('nickName', ''),
            roomName: req.param('refundrnumber', ''),
            socket: req.socket,
            session: req.session,
        }
        var tableName = req.param('tableName', '');

        if (options.nickName == '') {
            options.nickName = options.session.nickName || ('Guest' + Math.round(Math.random() * 100000));
        }

        Userchat.destroy({refund_num: options.roomName, nickName: options.nickName}).exec(function (err, userResults) {
            if(err) return res.negotiate(err);
            // if (userResults.length > 0) {
            //     sails.sockets.leave(socket, options.roomName);
            // }

            return Userchat
                .create({ nickName: options.nickName.trim(), socketId: options.socket.id, refund_num: options.roomName})
                .then(function (userResult) {
                    //Join the party.
                    //Come on, Babie, let's go party!
                    //Oh, Oh, Oh...
                    sails.sockets.join(options.socket, options.roomName);
                    console.log(options.nickName+" joined the room: "+options.roomName+", with socketId "+options.socket.id);
                    if (tableName.length > 0) {
                        //----------------------------------create tables and clear isRead---------------------------------------
                        //var month=parseInt(tableName.substring(tableName.length-2));
                        var table = [];

                        for (var i = 0; i < 3; i++){
                            var d = new Date();
                            var time = d.setMonth(d.getMonth()-i);
                            table[i] = 'userchatmsg' + (new Date(time)).Format("yyyyMM");
                        }

                        // for (var i = 0; month <= parseInt((new Date()).Format("MM")); month--, i++){
                        //     var month_str = '';
                        //     if (month.toString().length==1) {
                        //         month_str = '0' + month;             
                        //         table[i] = 'userchatmsg2017' + month_str;
                        //     }else{
                        //         table[i] = 'userchatmsg2017' + month;
                        //     }
                        // }

                        table.forEach(function(elem,i){
                            var sqltext = 'update '+table[i]+' set isRead=1 where refundrnumber="'+ options.roomName+'" and isRead=0 and receiver="'+options.nickName+'"';
                            console.log(sqltext);
                            UserchatMsg.query(sqltext, function(err, results) {
                                if (err) {
                                    return res.negotiate(err);
                                }

                                if (i==table.length-1){
                                    return res.json({
                                        "success": true,
                                        "msgCode": 200,
                                        "msg": "TCP sets up with a room joined",
                                        "result": userResult,
                                    });
                                }
                            });
                        });
                    }else{
                        return res.json({
                            "success": true,
                            "msgCode": 200,
                            "msg": "TCP sets up with a room joined",
                            "result": userResult,
                        });
                    }

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
        API: /Socket/destroy
        parameters: nickName, refundrnumber, socketId
        return：{'success': true,'code':200,"msg": "打令智能 left the room 600000000013432"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    destroy: function (req, res) {
        var options = {
            roomName: req.param('refundrnumber', ''),
            nickName: req.param('nickName', ''),
            socketId: req.param('socketId', ''),
            socket: req.socket,
            session: req.session,
        }
        
        Userchat.destroy({socketId: options.socket.id}).exec(function (err, userResults) {
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
    /*
        Get redflag for client
        API: /Socket/getRedflag
        parameters: "refundrnumber", "tablenameofitem"
        return：{'success': true,'code':200,"msg": "You got it"}
                {'success': true,'code':400,"msg": "No Redflag Found!"}
                {'success': true,'code':404,"msg": "No Refundrnumber!"}
    */
    getRedflag: function (req, res) {
        console.log('socket/getRedflag: This is the function entry. check it out: ', req.allParams());
        var refundrnumber = req.param('refundrnumber','');
        var table = req.param('tablenameofitem','');
        var redflag = 0;

        if (refundrnumber.length > 0) {
            //---------------------------------- get isRead---------------------------------------
            var tableName = "view_userchatmsg" + table.substring(14,18);
            var sqltext = 'select * from '+tableName+' as a where a.refundrnumber="'+refundrnumber+'" and a.receiver="'+redis.getUserInfo().usermobile+'" and a.isRead=0 order by a.createdAt asc';
            UserchatMsg.query(sqltext, function(err, result) {
                
                if (err) return res.negotiate(err);

                if (result.length==0) {

                    return res.json({
                        "success":true,
                        "msgCode":400,
                        "msg":"No Redflag Found!",
                        "redFlag":redflag,
                    });
                }else{
                    redflag=1;
                }
                return res.json({
                    "success":true,
                    "msgCode":200,
                    "msg":"Redflag Found!",
                    "redFlag":redflag,
                });
            });

        }else{
            return res.json({
                "success":true,
                "msgCode":404,
                "msg":"No Refundrnumber!",
                "redFlag":redflag,
            })
        }           
    },
    /*
        Get redflags for client
        API: /Socket/getRedflags
        parameters: "refundrnumber", "tablenameofitem"
        return：{'success': true,'code':200,"msg": "You got it"}
                {'success': true,'code':400,"msg": "No Redflag Found!"}
                {'success': true,'code':404,"msg": "No Refundrnumber!"}
    */
    getRedflags: function (req, res) {
        console.log('socket/getRedflag: This is the function entry. check it out: ', req.allParams());
        var array = req.param('array','');
        //console.log(array);
        var len = 0;

        array.forEach(function(elem,key){
            //---------------------------------- get isRead---------------------------------------
            var tableName = "view_userchatmsg" + array[key].tablenameofitem.substring(14,18);
            var sqltext = 'select * from '+tableName+' as a where a.refundrnumber="'+array[key].refundrnumber+'" and a.receiver="'+redis.getUserInfo().usermobile+'" and a.isRead=0 order by a.createdAt asc';
            //console.log(sqltext);
            UserchatMsg.query(sqltext, function(err, result) {
                
                if (err) return res.negotiate(err);

                if (result.length==0) {
                    array[key]['redFlag']=0;
                }else{
                    array[key]['redFlag']=1;
                }

                len++;
                if(len==array.length){
                    console.log("Redflags Done! len: "+len);
                    return res.json({
                        "success":true,
                        "msgCode":200,
                        "msg":"Redflags Done!",
                        "redFlag":array,
                    });
                }
            });
        });
    },
    /*
        Clear redflag for client
        API: /Socket/clearRedflag
        parameters: "refundrnumber", "tableName"
        return：{'success': true,'code':200,"msg": "Redflag Removed"}
                {'success': true,'code':400,"msg": "No Redflag Found!"}
    */
    clearRedflag: function (req, res) {
        console.log('socket/removeRedflag: This is the function entry. check it out: ', req.allParams());
        var roomName = req.param('refundrnumber', '');
        var tableName = req.param('tableName', '');

        if (tableName.length > 0) {
            //---------------------------------- clear isRead---------------------------------------
            var month=parseInt(tableName.substring(15));
            var table = [];

            for (var i = 0; month <= parseInt((new Date()).Format("MM")); month++, i++){
                var month_str = '';
                if (month.toString().length==1) {
                    month_str = '0' + month;             
                    table[i] = 'userchatmsg2017' + month_str;
                }else{
                    table[i] = 'userchatmsg2017' + month;
                }
            }
            table.forEach(function(elem,i){
                var sqltext = 'update '+table[i]+' set isRead=1 where refundrnumber="'+ roomName+'" and isRead=0 and receiver="'+redis.getUserInfo().usermobile+'"';
                //console.log(sqltext);
                //console.log("redis.getUserInfo().usermobile: "+redis.getUserInfo().usermobile);
                UserchatMsg.query(sqltext, function(err, results) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    console.log("clearRedflag--results.length: "+results.length);
                    if (i==table.length-1){
                        return res.json({
                            "success": true,
                            "msgCode": 200,
                            "msg": "Redflag Removed",
                        });
                    }
                });
            });
        }else{
            return res.json({
            "success": true,
            "msgCode": 400,
            "msg": "No Redflag Found!",
            });
        }           
    },
    //--------------------------All sorts of message stuff-------------------------------------
    /*
        Texting messages in the room
        API: /Socket/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_MESSAGE_SUCCESS"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    sendMsg: function (req, res) {

        var options = {
            socket: req.socket,
            session: req.session,
            msg: req.param('msg', ''),
            nickName: req.param('nickName', ''),
            receiver: req.param('receiver', ''),
            isPic: req.param('isPic', ''),
            roomName: req.param('refundrnumber', ''),
        }

        if (!options.roomName) {
            return res.json({
                    "success": false,
                    "msgCode": 400,
                    "msg": "BadRequest",
            });
        }

        var messageData = {
            msg: options.msg,
            nickName: options.nickName,
            isPic: options.isPic,
            time: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
        }
        sails.sockets.broadcast(options.roomName, 'message', messageData);

        //------------------------------store msg------------------------------
        Userchat.find({refund_num: options.roomName}).exec(function (err, userResults) {
            if (err) {
                console.log("err: message insert");
            }

            var message = {
                sender: options.nickName,
                receiver: options.receiver,
                isPic: options.isPic,
                refundrnumber: options.roomName,
                socketId: options.socket.id,
                message: options.msg,
                isRead: 0,
                tableName: "userchatmsg" + ((new Date()).Format("yyyyMM")),
                session: '',
                createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                updatedAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
            }
            console.log("userResults.length: " + userResults.length);
            if(userResults.length==2) {
                message.isRead = 1;
            }else{
                message.isRead = 0;
            }
            UserchatMsg.createLog(message, function(err,insert){
            //UserchatMsg.create(message).exec(function(err,insert){
                if (err) {
                    console.log("err: message insert");
                }

                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "SEND_MESSAGE_SUCCESS",
                    //"result": messageData,
                });
            });
        });
    },
    /*
        Upload an image in the chat room
        API: /Socket/uploadImage
        parameters: "pic", "socketchat"
        return：{'success': true,'code':200,"msg": "file(s) uploaded successfully!"}
                {'code':400,"msg": "上传失败"}
    */
    uploadImage: function (req, res) {
        console.log('socket/uploadImage: This is the function entry. check it out: ', req.allParams());
        return upload.uploadFile(req,res,"pic","socketchat");
    },
    /*
        Load history messages in the chat room
        API: /Socket/loadMsg
        parameters: page, refundrnumber
        return：{'code':200,"msg": "load page: 1"}
                {'code':400,"msg": err}
    */
    loadMsg: function (req, res) {
        console.log('loadMsg: This is the function entry.  check it out: ');

        var socket = req.socket,
        session = req.session,
        page = req.param('page', ''),
        start = 15*page,
        roomName = req.param('refundrnumber', ''),
        tableName = "view_userchatmsg" + ((new Date()).Format("yyyy")),
        tableName_pre = "view_userchatmsg" + ((new Date()).Format("yyyy")-1);
        if (((new Date()).Format("yyyy")-1) < 2017){
            var sqltext = 'select * from '+ tableName + ' where refundrnumber="'+ roomName + '" order by createdAt DESC limit '
            + start + ',15';
        }else{
            var sqltext = 'select * from '+ tableName + ' where refundrnumber="'+ roomName + '" union all select * from ' + 
            tableName_pre + ' where refundrnumber="' + roomName + '" order by createdAt DESC limit '+ start + ',15';
        }
        console.log(sqltext);
        UserchatMsg.query(sqltext, function(err, results) {
        // UserchatMsg.find({
        //     where: { refundrnumber: roomName },
        //     skip: 15*page,
        //     limit: 15,
        //     sort: 'createdAt DESC'
        // }).exec(function(err, results){
            if (err) return res.negotiate(err);
            console.log("page: "+page+",length: "+results.length);
            return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "load page: " + page,
                    "result": results,
            });            
        });
    },
    loadMsg2: function (req, res) {
        console.log('loadMsg: This is the function entry.  check it out: ');

        var socket = req.socket,
        session = req.session,
        page = req.param('page', ''),
        start = 15*page,
        roomName = req.param('refundrnumber', ''),
        year = req.param('year', ''),
        tableName = "view_userchatmsg" + year;
        var sqltext = 'select * from '+ tableName +' where refundrnumber="'+ roomName+'" order by createdAt DESC limit '+start+',15';
        
        UserchatMsg.query(sqltext, function(err, results) {
        // UserchatMsg.find({
        //     where: { refundrnumber: roomName },
        //     skip: 15*page,
        //     limit: 15,
        //     sort: 'createdAt DESC'
        // }).exec(function(err, results){
            if (err) return res.negotiate(err);
            console.log("page: "+page+",length: "+results.length);
            //var year = (new Date()).Format("yyyy") - 1;
            if (results.length == 15 || (year -1) < 2017){
                return res.json({
                        "success": true,
                        "msgCode": 200,
                        "msg": "load page: " + page,
                        "result": results,
                        "year" : results[results.length-1].tableName.substring(11,15),
                });   
            }else{
                var tableName_old = "view_userchatmsg" + (year - 1);
                console.log("previous" + tableName_old);
                var len = 15 - results.length;
                var sqltext = 'select * from '+ tableName_old +' where refundrnumber="'+ roomName+'" order by createdAt DESC limit ' + len;
                UserchatMsg.query(sqltext, function(err, results_rest) {
                    if (err) return res.negotiate(err);
                    if (results.length > 0){
                        return res.json({
                                "success": true,
                                "msgCode": 200,
                                "msg": "load page: " + page,
                                "result_old": results,
                                "results": results_rest,
                                "year" : results_rest[results_rest.length-1].tableName.substring(11,15),
                        });   
                    }

                });               
            }         
        });
    },
    /*
        Load history message templates in the chat room
        API: /Socket/loadTemplate
        parameters: storeName
        return：{'code':200,"msg": "SUCCESS", 'result':[{"text":"sadas","default":false}]}
                {'code':400,"msg": err}
    */
    loadTemplate: function (req, res) {
        console.log('loadTemplate: This is the function entry.  check it out: ');
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                "success": false,
                "msgCode": 401,
                "msg": "Login Needed!",
            });
        }

        var data = {
            //message : req.param('message', ''),
            storeName : req.param('storeName', ''),
            //refundrnumber : req.param('refundrnumber', ''),
        }

        UserchatTemplate.findOrCreate(data, data).exec(function(err, result, wasCreatedOrFound) {
                if (err) { return res.serverError(err); }

                return res.json({          
                    "success": true,
                    "msgCode": 200,
                    "msg": "SUCCESS",
                    "result": result,
                });
            });
        
        // UserchatTemplate.find({refundrnumber: refundrnumber, storeName: storeName }).exec(function(err, results){
        //     if (err) console.log("err: loadTemplate");
            
        //     if (results.length) {
        //         console.log(results);
        //         return res.json({          
        //         "success": true,
        //         "msgCode": 200,
        //         "msg": "successfully",
        //         "result": results,
        //     });
        //     }
        //     return res.json({          
        //         "success": false,
        //         "msgCode": 400,
        //         "msg": "NOT FOUND",
        //     });           
        // });
    },
    /*
        Store history message templates from the chat room
        API: /Socket/storeTemplate
        parameters: storeName, message
        return：{"success": true,'code':200,"msg": "Store successfully"}
                {"success": false,'code':400,"msg": "NOT FOUND"}
    */
    storeTemplate: function (req, res) {
        console.log('storeTemplate: This is the function entry.  check it out: ');
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                "success": false,
                "msgCode": 401,
                "msg": "Login Needed!",
            });
        }

        var message = req.param('message', ''),
            storeName = req.param('storeName', '');
            //refundrnumber = req.param('refundrnumber', '');
        
        UserchatTemplate.update({storeName: storeName }).set({message:message}).exec(function(err, result){
            if (err) console.log("err: storeTemplate");
            if (!result.length) 
                return res.json({
                    "success": false,
                    "msgCode": 400,
                    "msg": "NOT FOUND",
                }); 
                 
            return res.json({
                "success": true,
                "msgCode": 200,
                "msg": "Store successfully",
            });            
        });
    },
    //--------------------------------------Just one More Example---------------------------------------
    hello: function(req, res) {
        console.log(req.isSocket);
        // Make sure this is a socket request (not traditional HTTP)
        if (!req.isSocket) {
            return res.badRequest("Not Socket Request!");
        }

        // Have the socket which made the request join the "funSockets" room.
        sails.sockets.join(req, 'funSockets');

        // Broadcast a notification to all the sockets who have joined
        // the "funSockets" room, excluding our newly added socket:
        sails.sockets.broadcast('funSockets', 'hello', { howdy: 'hi there!'}, req);
        console.log("done");

        // ^^^
        // At this point, we've blasted out a socket message to all sockets who have
        // joined the "funSockets" room.  But that doesn't necessarily mean they
        // are _listening_.  In other words, to actually handle the socket message,
        // connected sockets need to be listening for this particular event (in this
        // case, we broadcasted our message with an event name of "hello").  The
        // client-side you'd need to write looks like this:
        // 
        // io.socket.on('hello', function (broadcastedData){
        //   console.log(data.howdy);
        //   // => 'hi there!'
        // }
        // 

        // Now that we've broadcasted our socket message, we still have to continue on
        // with any other logic we need to take care of in our action, and then send a
        // response.  In this case, we're just about wrapped up, so we'll continue on

        // Respond to the request with a 200 OK.
        // The data returned here is what we received back on the client as `data` in:
        // `io.socket.get('/say/hello', function gotResponse(data, jwRes) { /* ... */ });`
        return res.json({
            anyData: 'we want to send back'
        });

    },

    
};
