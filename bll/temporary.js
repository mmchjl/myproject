/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-21
 * Time: 下午9:07
 * To change this template use File | Settings | File Templates.
 */

var base = require("./bllBase.js");

var app =new base();

var db = app.db;

app.handlers={
    get:function(id,cb){
        db.query({
            collection:"static",
            query:{}
        },function(err,data){
            if(err) return cd(err)
            cb(data)
        })
    }

}

module.exports = app.handlers;