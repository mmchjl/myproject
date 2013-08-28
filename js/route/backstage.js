/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-24
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */

define(function(require,exports,module){
    (function(g){
        var app = require("controler/backstage");
        var template = require("dinit");


        template.templateList.backstage={
            init:{
                app:"backstage",
                cmd:"init",
                content:"main_div",
                data:{},
                templateUrl:"./template/backstage/frame.htm",
                onload:function(param,data){
                    app.init.init();
                }
            },
            permission:{
                app:"backstage",
                cmd:"permission",
                content:"home",
                dataUrl:"./temporary/getactionlist",
                templateUrl:"./template/backstage/permission.htm",
                onload:function(param,data){
                    console.dir({
                        param:param,
                        data:data
                    });
                    app.permission.init();
                }
            }
        }


    })()
})