/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-21
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */

var handler = require("../bll/temporary.js");
var authorization = require("../bll/authorization.js");
var appBase = require("../lib/handleAppBase").handleBase;



var _handler = {
    get:function(header,response){
        var str = header.get("id");
        authorization.getById(str,function(err,result){
            result.handletime = new Date() - header.starthandletime;
            response.endJson({
                result:true,
                data:result
            });
        })
    },
    "get.isAuth":true,
    getactionlist:function(header,response){
        authorization.getAcrionList(function(data){
           data.handleTime = new Date()-header.starthandletime;
           response.endJson(data);
        })
    },
    "getactionlist.isAuth":true,
    update:function(header,response){
        var id = header.get("id");
        var code_str = header.get("code_str");
        var description_str = header.get("description_str");
        authorization.getById(id,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false});
            };
            data.code_str = code_str;
            data.description_str=description_str;
            authorization.update(data,function(err,_data){
                if(err){
                    utility.handleException(err);
                    return response.endJson({result:false});
                }
                return response.endJson({result:true});
            });
        })
    },
    "update.isAuth":true
}

var app = new appBase(_handler);
app.isAuthorization = false;


function handle(header,response){
    app.handle(header,response)
}

module.exports.handle = handle;

module.exports.explain = _handler;

