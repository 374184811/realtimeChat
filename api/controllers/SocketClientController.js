var socketController = require('../publicController/SocketController')

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
        Create a socket, then join the room, and finally clear isRead
        API: /Socket/create
        parameters: nickName, refundrnumber
        return：{"success": true,'code':200,"msg": "TCP sets up with a room joined"}
                {"success": false,'code':404,"msg": "BadRequest"}
                {"success": false,'code':400,"msg": "ServerError"}
    */
    create: function (req, res) {
        return socketController.create(req,res);
    },
    createClient: function (req, res) {
        return socketController.createClient(req,res);
    },
    /*
        Destroy a socket, leaving the room
        API: /Socket/destroy
        parameters: nickName, refundrnumber, socketId
        return：{'success': true,'code':200,"msg": "打令智能 left the room 600000000013432"}
                {'success': false,'code':404,"msg": "NOT FOUND"}
    */
    destroy: function (req, res) {
        return socketController.destroy(req,res);
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
        return socketController.getRedflag(req,res);
    },
    getRedflags: function (req, res) {
        return socketController.getRedflags(req,res);
    },
    /*
        Clear redflag for client
        API: /Socket/clearRedflag
        parameters: "refundrnumber", "tableName"
        return：{'success': true,'code':200,"msg": "Redflag Removed"}
                {'success': true,'code':400,"msg": "No Redflag Found!"}
    */
    clearRedflag: function (req, res) {
        return socketController.clearRedflag(req,res);
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
        return socketController.sendMsg(req,res);
    },
    /*
        Upload an image in the chat room
        API: /Socket/uploadImage
        parameters: "pic", "socketchat"
        return：{'success': true,'code':200,"msg": "file(s) uploaded successfully!"}
                {'code':400,"msg": "上传失败"}
    */
    uploadImage: function (req, res) {
        return socketController.uploadImage(req,res);
    },
    /*
        Load history messages in the chat room
        API: /Socket/loadMsg
        parameters: page, refundrnumber
        return：{'code':200,"msg": "load page: 1"}
                {'code':400,"msg": err}
    */
    loadMsg: function (req, res) {
        return socketController.loadMsg(req,res);
    },
    loadMsg2: function (req, res) {
        return socketController.loadMsg2(req,res);
    },
    /*
        Load history message templates in the chat room
        API: /Socket/loadTemplate
        parameters: storeName
        return：{'code':200,"msg": "SUCCESS", 'result':[{"text":"sadas","default":false}]}
                {'code':400,"msg": err}
    */
    loadTemplate: function (req, res) {
        return socketController.loadTemplate(req,res);
    },
    /*
        Store history message templates from the chat room
        API: /Socket/storeTemplate
        parameters: storeName, message
        return：{"success": true,'code':200,"msg": "Store successfully"}
                {"success": false,'code':400,"msg": "NOT FOUND"}
    */
    storeTemplate: function (req, res) {
        return socketController.storeTemplate(req,res);
    },
    //--------------------------------------Just one More Example---------------------------------------
    hello: function(req, res) {
        return socketController.hello(req,res);
    },

    
};
