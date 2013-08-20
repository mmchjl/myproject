/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-5-5
 * Time: 下午4:03
 * To change this template use File | Settings | File Templates.
 */

var redis = require("redis"),
    client;
if(configuration.config.runtime.sessionMode==2){
    client= redis.createClient();
}

exports.redis = function(){
    try
    {
        if(typeof (client)==undefined){
            console.info("call createClient");
            client = redis.createClient();
        }
        return client;
    }catch(e){
        throw e;
    }

}

exports.hGetAll = function(key,callback){
    client.hgetall(key,function(err,data){
        if(err){
            utility.handleException(err);
        }
        callback(data);
    });
}

exports.hMSet = function(hash,obj,callback){
    if(utility.isNull(obj)){
        obj={
            _a:-1
        };
    }
    if(Object.keys(obj).length==0){
        obj={
            _a:0
        };
    }
    client.hmset(hash,obj,function(err,_data){
        if(err){
            utility.handleException(err);
        }
        if(callback)  callback(_data);
    })
}

exports.expire =function(key,time,callback){
   client.expire(key,time,function(err,result){
       if(err){
           utility.handleException(err);
       }
      if(callback) callback(result);
   });
}