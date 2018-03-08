/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {

    console.log('权限策略: This is the function entry. check it out: ', req.allParams());

    var options = req.options;
    var mine = req.session.mine;

    var groupid = mine.groupid;
    var storeid = mine.storeid;
    var action = options.action.toLowerCase();
    var controller = options.controller.toLowerCase();

    // If there's no `userId` in the session, then the user is not logged in
    // (so we can't tell if they're an admin or not!)
    // In that case, don't allow access.
    if (req.session.storeid) {
        return res.forbidden();
    }

    return next();
};
