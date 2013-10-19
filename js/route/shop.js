define(function(require,exports,module){
    var template = require("dinit"),
      app = require("controler/shop");
    load = template.load,
    reload = template.reload,
    templateList = template.templateList;
    templateList.shop = {
        init: {
            app: "shop",
            cmd: "init",
            content: "body",
            //data: {},
            dataUrl: "./shop/getshop",
            templateUrl: "./template/shop.htm",
            onload: function (param, data) {
                app.init.init(param, data);
            }
        },
        register: {
            app: "shop",
            cmd: "register",
            content: "mainDiv",
            data: {},
            dataUrl: "",
            templateUrl: "./template/base/register.htm",
            onload: function (param, data) {
                app.register.init(param, data);
            },
            unload:function(){
                app.register.unload();
            }
        },
        shoplist:{
            app:"shop",
            cmd:"shoplist",
            content:"i_h_shoplist",
            dataUrl:"./shop/getshop",
            templateUrl: "./template/base/shoplist.htm"
        },
        myshop:{
            app:"shop",
            cmd:"myshop",
            content:"mainDiv",
            dataUrl:"./shop/getmyshop",
            templateUrl:"./template/base/myshop.htm"
        }
    }
})