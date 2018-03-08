/**
 * UserchatTemplate.js
 * This is Zhang Kun's work for real time communications
 * -----------------------------------------------------------------------------------------------
 * The man who has made up his mind to win will never say "impossible".  
 * ---- Bonapart Naploeon, French emperor
 **/

module.exports = {
    tableName: "userchattemplate",
    attributes: {
        message: {
            type: 'string',
        },
        storeName: {
            type: 'string',
        },
        // refundrnumber: {
        //     type: 'string',
        // },
        session: {
            type: 'string',
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true
};
