/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-22
 * Time: 下午9:22
 * To change this template use File | Settings | File Templates.
 */

var base = require("./../bllBase.js");
var fs =require("fs");
var path = require("path");
var enterface = require("../../handler.js");

var app =new base();
var db = app.db;
var REGITER = "Proc_Permission_Define({0})",
    COLLECTION = "permission_data";

app.handlers={
    getAcrionList:function(param,cb){
        if(typeof param=="function"){
            cb = param;
            param = {};
        }
       getActionList(param,cb);
    },
    getById:function(param,cb){
        var opt = {
            collection:COLLECTION,
            query:{
                _id:param
            }
        };
        db.findOne(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return cb(err);
            }
            return cb(null,data);
        })
    },
    update:function(param,cb){
        var opt={
            collection:COLLECTION,
            query:{},
            newObject:param
        };
        var id = param.id||param._id;
        if(id){
            opt.query._id=id;
            delete opt.newObject.id;
            delete opt.newObject._id;
        }
        db.update(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return cb(err);
            }
            cb(null,data);
        });
    },
    getHandler:function(param,cb){
        var opt={
            collection:COLLECTION,
            query:{
                leval_int:0
            }
        };
        db.query(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return cb(err,null);
            }
            return cb(null,data);
        });
    },
    getPCodeByHanderAndAction:function(hander,action,cb){
        if(!hander||!action) return cb(null);
        var opt={
            collection:COLLECTION,
            query:{
                name_str:{
                    $in:[hander,action]
                }
            }
        };
        db.findList(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return cb(err,null);
            }
            if(data.length>0){
                var handlerCode = "";
                var actionCode = "";
                var h = data.Find(function(obj){
                    return obj.leval_int==0&&obj.name_str==hander&&obj.enabled_bool;
                });
                if(h){
                    handlerCode = t.code_str;
                }
                var a = data.Find(function(obj){
                    return obj.parent_str==hander&&obj.leval_int==1&&obj.name_str==action&&obj.enabled_bool;
                });
                if(a&&h) return cb(utility.Format("{0}.{1}", h.code_str, a.code_str));
            }
            return cb(0);
        });
    }
}


function getActionList(param,cb){
    var handlers = enterface.explain;
    var handlerArr = Object.keys(handlers);
    var obj = {
        list:[]
    };
    var rawArr = [];
    var queryArr = [];
    for(var i = 0;i<handlerArr.length;i++){
        var guid = utility.Guid();
        var moduleId = utility.Guid();
        var handler = {
            name_str:handlerArr[i],
            description_str:"",
            code_str:"",
            list:[],
            parent_str:"",
            leval_int:0
        };
        rawArr.push(handler);
        for(var j in handlers[handlerArr[i]].explain){
            var item =  handlers[handlerArr[i]].explain[j];
            if(typeof item!="function") continue;
            if(!handlers[handlerArr[i]].explain[j+".isAuth"]) continue;
            var action = {
                name_str:j,
                description_str:"",
                code_str:"",
                parent_str:handlerArr[i],
                leval_int:1
            };
            handler.list.push(action);
            queryArr.push(action);
        }
        obj.list.push(handler);
    }
    var opt = {
        collection:"permissionDefine",
        pageIndex:param.pageIndex||1,
        pageSize:param.pageSize||10,
        sort:param.sort||[["addTime_Date","desc"]]
    };

    db.execute(REGITER,JSON.stringify(obj),function(err,data){
        var result = {
            list:[]
        };
        result.list = data.FindAll(function(handler){
            if(handler.leval_int==0){
                handler.list=[];
                return true;
            }
            return false;
        })
        data.forEach(function(handler){
            var pid = handler.parent_str;
            var temp = result.list.Find(function(_handler){
                if(_handler.name_str==pid){
                   _handler.list.push(handler);
                    return true;
                }
                return false;
            });
        });
        cb(result);
        console.dir(result)
    })
/*    db.mongo(function(err,db){
     var LOGIN = "login('mmchjl','123')";
     db.eval(LOGIN,function(err,da){
     console.dir(da)
     });
     })*/

}



module.exports = app.handlers;

var r = function(param){
    var permission_data=db.permission_data;
    var moduleArr=[];
    param.list.forEach(function(handler){
        var name = handler.name_str.toLowerCase();
        handler.name_str = name;
        moduleArr.push(name);
        if(!permission_data.findOne({name_str:name})){
            //不存在
            var arr=[];
            handler.list.forEach(function(action){
                action.addTime_date=(new Date()).getTime();
                action.updateTime_date = (new Date()).getTime();
                arr.push(action);
            })
            handler.list=null;
            delete  handler.list;
            handler.addTime_date=(new Date()).getTime();
            handler.updateTime_date = (new Date()).getTime();
            arr.push(handler)
            permission_data.insert(arr);
        }else{
            //存在
           var tempHandler = permission_data.findOne({name_str:name});
            var parent = tempHandler.name_str;
            var arr = [];
            var nameArr=[];
            handler.list.forEach(function(action){
                var actionName = action.name_str;
                if(!permission_data.findOne({name_str:actionName,parent_str:parent})){
                    action.addTime_date =(new Date()).getTime();
                    action.updateTime_date =(new Date()).getTime();
                    arr.push(action);
                }
                nameArr.push(actionName);
            })
            permission_data.insert(arr);
            permission_data.remove({name_str:{$nin:nameArr},parent_str:parent})
        }
    });
    permission_data.remove({name_str:{$nin:moduleArr},leval_int:0});
    return permission_data.find().toArray();
}