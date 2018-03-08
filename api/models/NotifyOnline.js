/**
 * Userchat.js
 * This is Zhang Kun's work for notification communications
 * -----------------------------------------------------------------------------------------------
 * Our destiny offers not the cup of despair, but the chalice of opportunity. 
 * ---- Richard Nixon, American president
 **/

module.exports = {
    tableName: "notifyonline",
    attributes: {
        userName: {
            type: 'string',
        },
        roomName: {
            type: 'string',
        },
        socketId: {
            type: 'string',
        },
        session: {
            type: 'string',
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true
};
