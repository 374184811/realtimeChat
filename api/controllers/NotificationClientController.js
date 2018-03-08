var notificationController = require('../publicController/notificationController')

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
    /*
        Create a socket, then join the room
        API: /Socket/create
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
    */
    createClient: function (req, res) {
        return notificationController.createClient(req,res);
    },
    /*
        Destroy a socket, leaving the room
        API: /Socket/destroy
        parameters: nickName, refundrnumber, socketId
        return：{'success': true,'code':200,"msg": "打令智能 left the room 600000000013432"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    destroy: function (req, res) {
        return notificationController.destroy(req,res);
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
        return notificationController.identifyDevice(req,res);
    },
    /*
        Acknowledge messages received
        API: /notification/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_ACK_SUCCESS"}
    */
    sendAck: function (req, res) {
        return notificationController.sendAck(req,res);
    },
    /*
        Load history messages in the chat room
        API: /Socket/loadMsg
        parameters: page, refundrnumber
        return：{'code':200,"msg": "load page: 1"}
                {'code':400,"msg": err}
    */
    loadMsg: function (req, res) {
        return notificationController.loadMsg(req,res);
    },

    
};
