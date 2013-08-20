var util = require("util"),
    common = require("../init.js");

process.on("message",function(msg){
    var sessionId = msg.sessionId,
        session = msg.session,
        operation = msg.operation;
    var temp;
    switch (operation){
        case "get":
            temp = sessionArray.Find(function(obj){
                return obj.sessionId == sessionId;
            });
            if(temp){
                temp.updateTime = (new Date()).getTime();
                process.send(temp);
            }else{
                process.send(null);
            }
            break;
        case "clear":
            sessionArray = sessionArray.FindAll(function(obj){
               return obj.sessionId != sessionId;
            });
            break;
        case "update":
            temp = sessionArray.Find(function(obj){
                return obj.sessionId == sessionId;
            });
            if(temp){
                //更新
                temp.session = session;
                temp.updateTime = (new Date()).getTime()
            }else{
                //插入
                temp = {
                    sessionId:sessionId,
                    session:session,
                    addTime:(new Date()).getTime(),
                    updateTime:(new Date()).getTime()
                };
                sessionArray.push(temp);
            }
            process.send(temp);
            break;
    }
});

var sessionArray = [];

function remove(){
    var len = sessionArray.length,
        timeNow = (new Date()).getTime(),
        removeTime = timeNow - configuration.config.runtime.sessionExpireTime*1000;
    util.debug("子进程的定时任务，当前session数量： "+len);
    if(len>0){
        sessionArray = sessionArray.FindAll(function(item){
            return item.updateTime>=removeTime;
        });
    }
}

setInterval(remove,60*1000);
