var init =require("./init.js");
var http = require("http");
var util = require("util");
var route =require("./route.js");

var server = http.createServer();
server.on("request",handleRequest)
server.on("listening",function(){
    startScheduleTask();
	console.log("onlistening....");
})
function handleRequest(request,response){
	route.route(request,response)
}

/*
* 开始定时任务
* */
function startScheduleTask(){
    var len = configuration.length;
    if(len >0){
        for(var i =0;i<len;i++){
            var temp = configuration.scheduleTask[i];
            if(temp instanceof Function){
                try{
                    temp();
                }catch(e){
                    utility.handleException(e);
                }
            }
        }
    }
}


function listen(port,host){
    if(port&&host){
	    server.listen(port,host);
    }else{
        return utility.handleException(new Error("the host and port are not specify!"))
    }
}

exports.listen = listen;