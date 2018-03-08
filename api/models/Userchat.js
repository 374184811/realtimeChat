/**
 * Userchat.js
 * This is Zhang Kun's work for real time communications
 * -----------------------------------------------------------------------------------------------
 * Our destiny offers not the cup of despair, but the chalice of opportunity. 
 * ---- Richard Nixon, American president
 **/

module.exports = {
    tableName: "userchat",
    attributes: {
        nickName: {
            type: 'string',
        },
        refund_num: {
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
