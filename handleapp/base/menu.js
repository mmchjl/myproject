/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-31
 * Time: 上午8:54
 * To change this template use File | Settings | File Templates.
 */

var  handleBase = require("../../lib/handleAppBase.js").handleBase,
    menu =require("../../bll/base/menu.js");

function handle(header,response){
    app.handle(header,response)
}

var _handler = {
    getmenu:function(header,response){
        menu.getMenu(1,function(err,data){
            if(err){
                return response.endJson({result:false,code:500})
            }else{
                response.endJson({list:data,result:true})
            }
        })
    },
    getsecondmenu:function(header,response){
        var firstMenu = header.get("fm");
        menu.getMenu(1,function(err,data){
            if(err){
                return response.endJson({result:false,code:500})
            }else{
                var result = data.Find(function(obj){
                    return obj.app==firstMenu;
                });
                if(!result){
                    result=data[0];
                }
                response.endJson({list:result.subMenu,result:true})
            }
        });
    }
};

var app = new handleBase(_handler)
app.isAuthorization = true;

module.exports.handle = handle;

module.exports.explain = _handler;