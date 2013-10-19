/**
 * Created with JetBrains WebStorm.
 * User: NL_LE
 * Date: 13-8-5
 * Time: 下午2:55
 * handleApp处理类的基类，统一了写响应头的handle方法，根据每个继承类的各自_handler方法调用不同的方法
 */

var permission = require("../bll/base/authorization");
var user = require("../bll/base/user");

/**
 * collection:对应数据库的集合名称(string)
 * hander:子类重写的处理对象(object)
 */
function handleBase(handler){
    this.opt={};
    this._handler=handler||{};
    this.isAuthorization = true;
}

var cache = {};

function authorzation(header, cb) {
    var handler = header.handler,
        action = header.action;
    var uniqCode = utility.Format("{0}.{1}", handler, action);
    var pCode = cache[uniqCode];
    if (!pCode) {
        //不存在
        permission.getPCodeByHanderAndAction(handler, action, function (code) {
            if(code==0){
                cb(true);
            }else{
                cache[uniqCode] = code;
                pCode = code;
            }
        });
    }
    //user.checkPower(header, pCode, cb);
    cb(true);
}

handleBase.prototype.handle=function(header,response){
    response.writeHead(200,{
        "Content-Type":"text/plain; charset=utf-8"
    });
    header.getUser(function(data){
        header.user = data;
        var action = header.action.toLowerCase();
        if(this._handler[action]!=undefined){
            var auth = action+".isAuth";
            if(this._handler[auth]){
                if(header.auth){
                    authorzation(header,function(result){
                        if(result) return this._handler[action](header,response);
                        return response.endJson({result:false,code:403})
                    }.bind(this))
                }else{
                    return response.endJson({result:false,code:100});
                }
            }else{
                return this._handler[action](header,response);
            }
        }else{
            return response.endJson({result:false,code:404});
        }
    }.bind(this))
};

module.exports.handleBase = handleBase;