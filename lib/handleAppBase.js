/**
 * Created with JetBrains WebStorm.
 * User: NL_LE
 * Date: 13-8-5
 * Time: 下午2:55
 * handleApp处理类的基类，统一了写响应头的handle方法，根据每个继承类的各自_handler方法调用不同的方法
 */

/**
 * collection:对应数据库的集合名称(string)
 * hander:子类重写的处理对象(object)
 */
function handleBase(collection,handler){
    this.opt={};
    this.opt.collection = collection||"";
    this._handler=handler||{};
    this.isAuthorization = true;
}

handleBase.prototype.handle=function(header,response){
    response.writeHead(200,{
        "Content-Type":"text/plain; charset=utf-8"
    });
    var action = header.action.toLowerCase();
    if(this._handler[action]!=undefined){
        if(!this.isAuthorization){
            var auth = utility.Format("{0}.isAuth",action);
            if(this._handler[auth]){
                if(header.auth){
                    return this._handler[action](header,response);
                }else{
                    return response.endJson({result:false,code:100});
                }
            }else{
                return this._handler[action](header,response);
            }
        }else{
            if(this.isAuthorization&&header.auth){
                return this._handler[action](header,response);
            }else{
                return response.endJson({result:false,code:100});
            }
        }
    }else{
        return response.end();
    }
};

module.exports.handleBase = handleBase;