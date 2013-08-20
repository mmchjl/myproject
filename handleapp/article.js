/**
 * Created with JetBrains WebStorm.
 * User: NL_LE
 * Date: 13-7-26
 * Time: 上午11:18
 * To change this template use File | Settings | File Templates.
 */

var mongo  = require("../lib/mongoClient.js"),
    handleBase = require("../lib/handleAppBase.js").handleBase;

function handle(header,response){
    app.handle(header,response)
}

var _handler = {
    add:function(header,response){
        var t = JSON.parse(header.fields.data);
        t=utility.objectValid(t);
        var newobject = {};
        newobject.type_int = t.type_int;
        newobject.title_str = t.title_str||"";
        newobject.content_str = t.content_str||"";
        newobject.synopsis_str = t.synopsis_str||"";
        newobject.updateTime_date = parseInt(t.updateTime_date);
        newobject.tags=[];
        if(!utility.isNull(t.tags)){
            for(var i=0;i< t.tags.length;i++){
                newobject.tags.push({
                    name_str: t.tags[i],
                    hit:0
                });
            }
        }
        var option={
            collection:"article",
            query:{},
            newObject:newobject
        }
        console.dir(option);
        if(t.id!=0){
            option.query._id= t.id;
            mongo.update(option,function(err,data){
                if(err){
                    utility.handleException(err);
                    return response.endJson({result:false,data:{code:500}});
                }
                response.endJson({result:true,data:{code:200}});
                console.dir(data);
            });
        }else{
            mongo.insert(option,function(err,data){
                if(err){
                    utility.handleException(err);
                    return response.endJson({result:false,data:{code:500}});
                }
                response.endJson({result:true,data:{code:200}});
                console.dir(data);
            });
        }
    },
    "add.isAuth":true,
    getlist:function(header,response){
        var opt={
            collection:"article",
            query:{}
        };
        if(header.get("type_int")) opt.query.type_int =parseInt(header.get("type_int"));
        mongo.query(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false,data:{
                    code:500
                }});
            }
            response.endJson({
                result:true,
                data:data
            });
        });
    },
    getrange:function(header,response){
        var opt={
            collection:"article",
            query:{},
            fields:{_id:1,title_str:1,views:1,"comments.commentId":1},
            sort:[["updateTime_date",-1]],
            pageSize:5
        };
        mongo.query(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false,data:{code:500}});
            }
            if(data){
                for(var i=0;i<data.list.length;i++) {
                    if(data.list[i].comments){
                        data.list[i].replies = data.list[i].comments.length;
                        delete data.list[i].comments;
                    }else{
                        data.list[i].replies = 0;
                    }
                }
            }
            response.endJson({
                result:true,
                data:data
            });
        });
    } ,
    gettags:function(header,response){

    },
    list:function(header,response){
        var opt={
            collection:"article",
            query:{},
            fields:{
                _id:1,
                title_str:1,
                updateTime_date:1,
                tags:1,
                views:1,
                "comments.commentId":1,
                synopsis_str:1
            },
            sort:[["updateTime_date",-1]]
        };
        if(header.get("type_int")) opt.query.type_int =parseInt(header.get("type_int"));
        //if(header.get("tags"))
        mongo.query(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({
                    result:false
                })
            }
            if(data){
                for(var i=0;i<data.list.length;i++) {
                    if(data.list[i].comments){
                        data.list[i].replies = data.list[i].comments.length;
                        delete data.list[i].comments;
                    }else{
                        data.list[i].replies=0;
                    }
                }
            }
            response.endJson({
                result:true,
                data:data
            });
        });
    },
    detail:function(header,response){
        var opt = {
            collection:app.opt.collection,
            query:{
                _id:header.get("id")
            },
            newObject:{
                $inc:{views:1}
            }
        };
        mongo.update(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false,data:{code:500}});
            }else{
                delete  opt.newObject;
                mongo.findOne(opt,function(err,data){
                    if(err){
                        utility.handleException(err);
                        return response.endJson({result:false,data:{code:500}});
                    }
                    if(utility.isNull(data)) return response.endJson({result:false});
                    data.result = true;
                    response.endJson(data);
                })
            }
        });
    },
    comment:function(header,response){
        var temp = JSON.parse(header.fields.data);
        if(temp){
            temp = utility.objectValid(temp);
        }else{
            return response.endJson({result:false});
        }
        var id = temp.id;
        delete temp.id
        var opt = {
            collection:app.opt.collection,
            query:{_id:id},
            newObject:{
                $push:{
                    comments:
                    temp
                },
                $set:{
                    updateTime_date:(new Date()).getTime()
                }
            }
        }
        mongo.update(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false});
            }
            return response.endJson({result:true});
        });
    },
    thumb:function(header,response){
        var id = header.queryString.articleId_str,
            commentId = header.queryString.commentId_str,
            isYes = header.queryString.type_int==1?true:false;
        var temp = utility.Format("{0}_{1}",id,commentId);
        if(header.session.session[temp]) return response.endJson({result:false,msg:"ni has thumb before"});
        var opt={
                collection:app.opt.collection,
                query:{
                    _id:id,
                    "comments.commentId":commentId
                },
                newObject:{
                    $inc:{
                       "comments.$.yes":1
                    }
                }
            };
         if(!isYes) {
             opt.newObject.$inc["comments.$.no"] = 1;
             delete opt.newObject.$inc["comments.$.yes"];
         }
        mongo.update(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return   response.endJson({result:false})
            }
            return response.endJson({result:true})
        });
        header.session.session[temp] = true;
    },
    admin:function(header,response){
        var typeId = header.get("typeId");
        var opt={
            collection:app.opt.collection,
            query:{},
            fields:{
                _id:1,
                title_str:1,
                updateTime_date:1,
                tags:1,
                views:1,
                type_int:1,
                "comments.commentId":1,
                synopsis_str:1
            },
            sort:[["updateTime_date",-1]]
        };
        var result = {
            result:true,
            data:{
                tech:[],
                life:[],
                interst:[],
                common:[]
            },
            type:typeId
        };
        mongo.query(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false,code:500});
            }
            for(var i=0;i<data.count;i++){
                var t = data.list[i];
                if(t.type_int==1){
                    result.data.tech.push(t);
                }else if(t.type_int==2){
                    result.data.life.push(t);
                }else if(t.type_int==3){
                    result.data.interst.push(t);
                }
            }
            mongo.query({
                collection:"menu",
                query:{}
            },function(err,data){
                if(err){
                    utility.handleException(err);
                    return response.endJson({result:false})
                }
                for(var i = 0;i<data.list.length;i++){
                    var temp = data.list[i];
                    result.data.common.push(temp);
                }
                response.endJson(result)
            })
            //response.endJson(result);
        })
    },
    "admin.isAuth":true,
    remove:function(header,response){
        var id = header.get("id");
        if(!id) return response.endJson({result:false,code:500})
        var opt = {
            collection:app.opt.collection,
            query:{
                _id:id
            }
        };
        mongo.remove(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false,code:500});
            }
            return response.endJson({result:true,code:200});
        })
    },
    "remove.isAuth":true,
    detailwithoutcomment:function(header,response){
        var opt = {
            collection:app.opt.collection,
            query:{
                _id:header.get("id")
            },
            fields:{
                _id:1,
                title_str:1,
                commonts:-1,
                content_str:1,
                tags:1,
                type_int:1,
                synopsis_str:1
            }
        };
        mongo.findOne(opt,function(err,data){
            if(err){
                utility.handleException(err);
                return response.endJson({result:false,data:null})
            }
            if(utility.isNull(data)) return response.endJson({result:false});
            data.result = true;
            response.endJson(data);
        })
    },
    md5:function(header,response){
        var raw = header.get("str")||"";
        var des = utility.MD5(raw);
        response.end(des);
    }
};

var app = new handleBase("article",_handler);
app.isAuthorization = false;

module.exports.handle = handle;