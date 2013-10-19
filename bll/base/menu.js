/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-31
 * Time: 上午8:35
 * To change this template use File | Settings | File Templates.
 */

var base = require("../bllBase.js");
var fs = require("fs");
var path = require("path");

var app = new base(),
    db = app.db,
    cache ={};

app.handlers={
    getMenu:function(userType,cb){
        var _path = path.join(configuration.config.runtime.basePath,getFilenameByUserType(userType));
        if(cache[userType.toString()]){
            return cb(null,cache[userType.toString()]);
        }
        fs.readFile(_path,function(err,data){
            if(err){
                return cb(err,null);
            }else{
                var jObj = JSON.parse(data);
                cache[userType.toString()] = jObj;
                return cb(null,jObj)
            }
        })
    }
};

function getFilenameByUserType(userType){
     return "./config/menu/superadmin.json"
}

module.exports=app.handlers;
