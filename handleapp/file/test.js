/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-24
 * Time: 下午9:49
 * To change this template use File | Settings | File Templates.
 */

var handler = require("../../bll/temporary.js");
var authorization = require("../../bll/authorization.js");
var appBase = require("../../lib/handleAppBase").handleBase;



var _handler = {
    get:function(header,response){
        var str = header.get("id");
        handler.get(str,function(result){
            result.handletime = new Date() - header.starthandletime;
            response.endJson({
                str:result
            });
        })
    },
    getactionlist:function(header,response){
        authorization.getAcrionList(function(data){
            response.endJson(data);

        })
    }
}

var app = new appBase(_handler);
app.isAuthorization = false;


function handle(header,response){
    app.handle(header,response)
}

module.exports.handle = handle;

module.exports.explain = _handler;