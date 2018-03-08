/**
 * Created by Kun on 2017/9/15.
 */

var messageCache = [];

var commands = {
    list: function (options, res) {
        return users = User.find().then(function (userResults) {
            var messageData = {
                users: userResults.map(function (user) { return user.nickName; }),
                time: new Date().toTimeString().slice(0, 8),
            }
            //sails.sockets.emit(sails.sockets.id(options.socket), 'user-list', messageData);
            sails.sockets.broadcast('ConstantUtil.DEFAULT_ROOM', 'user-list', messageData);
            console.log(messageData.users);
            //return ResponseUtil.responseOk(ConstantUtil.GET_USER_LIST_SUCCESS, res);
            return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "GET_USER_LIST_SUCCESS",
            });
        });
    },

    nick: function (options, res) {
        var nickName = options.msg.split(' ')[1].trim() || '';
        return User.findOne({ socketId: options.socket.id }).exec(function (err, userResult) {
            if (!userResult) {
                throw new Error('can not find user by socket ID');
            }

            return UserService.changeNickname(userResult, nickName, function (oldNickName) {
                var resData = {
                    nickName: nickName,
                };

                //sails.sockets.emit(sails.sockets.id(options.socket), 'change-nick', resData);
                sails.sockets.broadcast('ConstantUtil.DEFAULT_ROOM', 'change-nick', resData);
                sails.sockets.broadcast('ConstantUtil.DEFAULT_ROOM', 'systemMessage', { msg: oldNickName + ' 改名为 ' + nickName });
                //return ResponseUtil.responseOk(resData, res);
                return res.json({
                    "success": true,
                    "msgCode": 200,
                    "msg": "连接成功",
                    "result": resData,
            });
            });
        }).then(function (err) {
            sails.log.error('On message command nick interface, catch:\n', err);
            if (err.message === 'can not find user by socket ID') {
                //return ResponseUtil.responseBadRequest(ConstantUtil.USE_SOCKET, res);
                return res.json({
                    "success": true,
                    "msgCode": 400,
                    "msg": "USE_SOCKET",
            });
            }
            else if (err.message.indexOf('A record with that `nickName` already exists') >= 0) {
                //return ResponseUtil.responseBadRequest(ConstantUtil.NICK_ALREADY_EXISTS, res);
                return res.json({
                    "success": true,
                    "msgCode": 400,
                    "msg": "NICK_ALREADY_EXISTS",
            });
            }
            //return ResponseUtil.responseServerError(ConstantUtil.SERVER_ERROR, res);
            return res.json({
                    "success": true,
                    "msgCode": 400,
                    "msg": "SERVER_ERROR",
            });
        });
    },
};

module.exports = {
    create: function (options, res) {
        var room = sails.sockets.socketRooms(options.socket)['1'];
        if (room != ConstantUtil.DEFAULT_ROOM) {
            //return ResponseUtil.responseBadRequest(ConstantUtil.NOT_JOINED_ROOM, res);
            return res.json({
                    "success": true,
                    "msgCode": 400,
                    "msg": "NOT_JOINED_ROOM",
            });
        }

        // if (options.msg.startsWith('/')) {
        //     var command = options.msg.slice(1, options.msg.length).split(' ')[0];

        //     if (commands.hasOwnProperty(command)) {
        //         return commands[command](options, res);
        //     }
        // }

        var messageData = {
            //msg: SecurityUtil.xssFilter(options.msg),
            msg: options.msg,
            nickName: options.nickName,
            time: new Date().toTimeString().slice(0, 8),
        }
        sails.sockets.broadcast('ConstantUtil.DEFAULT_ROOM', 'message', messageData);
        messageCache.push(messageData);
        if (messageCache.length > 50) {
            messageCache.shift();
        }
        //return ResponseUtil.responseOk(ConstantUtil.SEND_MESSAGE_SUCCESS, res);
        return res.json({
                    "success": true,
                    "msgCode": 400,
                    "msg": "SEND_MESSAGE_SUCCESS",
            });
    },

    getMessageCache: function () {
        return messageCache;
    },
}