var notificationController = require('../publicController/notificationController')

/**
 * SocketController
 * This is Zhang Kun's work for real time communications on 2017/11/1
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
    create: function (req, res) {
        return notificationController.create(req,res);
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
        Texting messages in the room for android
        API: /notification/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_MESSAGE_SUCCESS"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    sendMsg: function (req, res) {
        return notificationController.sendMsg(req,res);
    },
    /*
        Texting messages in the room for apple
        API: /notification/sendMsg
        parameters: nickName, refundrnumber, isPic, msg, receiver
        return：{'success': true,'code':200,"msg": "SEND_MESSAGE_SUCCESS"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    sendMsgios: function (req, res) {
        return notificationController.sendMsgios(req,res);
    },
    /*
        Store history messages in the chat room
        API: /notification/loadMsg
        parameters: page, refundrnumber
        return：{'code':200,"msg": "STORE_MESSAGE_SUCCESS"}
                {'code':400,"msg": err}
    */
    storeMsg: function (req, res) {
        return notificationController.storeMsg(req,res);
    },
    /*
        Resend messages lost
        API: /notification/resendMsg
        parameters: 
        return：{'success': true,'code':200,"msg": "RESEND_MSG_SUCCESS"}
    */
    resendMsg: function (req, res) {
        return notificationController.resendMsg(req,res);
    },
  
};
