/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-9-21
 * Time: 下午2:41
 * To change this template use File | Settings | File Templates.
 */


var base = require("../../lib/handleAppBase.js").handleBase,
    shop = require("../../bll/base/shop");

function handle(header,response){
    app.handle(header,response);
}

var _handler = {
    regist:function(header,response){
        var str = header.get("data");
        var obj = JSON.parse(str);
        var param = {
            name_str:obj.name_str,
            address:obj.address_str,
            phone_str:obj.phone_str,
            tags:obj.tags,
            location:obj.location,
            createTime_date: (new Date()).getTime(),
            managerId_str: header.user._id
        };
        shop.registShop(param,function(result){
            if(result){
                return response.endJson({result:true})
            }
            response.endJson({result:false});
        });
    },
    getshop:function(header,response){
        var str = header.get("location"),
           pindex = header.get("pageindex");
        var param={
            pageIndex:pindex
        };
        if(str) var location = JSON.parse(str);
        shop.getShops(param,function(data){
            response.endJson(data)
        });
    },
    "getmyshop.isAuth":true,
    getmyshop:function(header,response){
        var user = header.user,
            query={
               managerId_str:user._id
            },
            opt={
                pageSize:1,
                PageIndex:1,
                query:query
            };
        shop.getShops(opt,function(data){
            response.endJson({session:header.session.session,user:user,header:header,shop:data})
        })
    }
};

var app = new base(_handler);
app.isAuthorization=false;

module.exports.handle = handle;
module.exports.explain = _handler;


