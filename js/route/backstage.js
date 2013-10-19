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
                content:"mainDiv",
                dataUrl:"./menu/getmenu",
                templateUrl:"./template/backstage/frame.htm",
                onload:function(param,data){
                    app.init.init();
                }
            },
            /*permission:{
                app:"backstage",
                cmd:"permission",
                content:"home",
                dataUrl:"./permission/getactionlist",
                templateUrl:"./template/backstage/permission.htm",
                onload:function(param,data){
                    app.permission.init(param,data);
                }
            },*/
            tag:{
                app:"backstage",
                cmd:"tag",
                content:"navdiv",
                dataUrl:"./menu/getsecondmenu",
                templateUrl:"./template/backstage/tagheader.htm",
                onload:function(param,data){
                    app.tag.init(param,data);
                }
            },
            powermanage_entry:{
                app:"backstage",
                cmd:"powermanage_entry",
                content:"powermanage_entry",
                dataUrl:"./permission/getactionlist",
                templateUrl:"./template/backstage/permission.htm",
                onload:function(param,data){
                    app.permission.init(param,data);
                }
            },
            powermanage_define:{
                app:"backstage",
                cmd:"powermanage_define",
                content:"powermanage_define",
                templateUrl:"./template/backstage/permission_define.htm",
                dataUrl:"./permission/gethandler",
                onload:function(param,data){
                    app.permissiondefine.init(param,data);
                }
            }
        }
    })()
})