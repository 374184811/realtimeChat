/**
 * Userchat.js
 * This is Zhang Kun's work for notification communications
 * -----------------------------------------------------------------------------------------------
 * Our destiny offers not the cup of despair, but the chalice of opportunity. 
 * ---- Richard Nixon, American president
 **/

module.exports = {
    tableName: "notifymsg",
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
    autoUpdatedAt: true
};
