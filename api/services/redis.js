/**
 * Created by Administrator on 2016/8/11.
 */
var express=require("express");
var redis = require("redis");
module.exports = {
	mRedis:{},
    _userInfo:{},
    client: function () {
        var config = sails.config.connections.redis;
        if (arguments.length > 0) config.db = arguments[0].db;

        var curIndex = config.db;

        var index=parseInt(curIndex)%16;

        if (this.mRedis && this.mRedis[index]) {
            return this.mRedis[index];
        }

        try{
            this.mRedis[index] = new redis.createClient(config);
            this.mRedis[index].on("error", function (err) {
                console.log("Error " + err);
            });
            this.mRedis[index].on("ready", function () {
                console.log("ready ");
            });
            return this.mRedis[index];
        }catch(e){
            console.log(e);
        }
    },

    setUserInfo: function(userdata) {
        this._userInfo = userdata;
    },

    getUserInfo: function() {
        return this._userInfo;
    }
}

