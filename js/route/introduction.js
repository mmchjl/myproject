/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-9-2
 * Time: 下午9:38
 * To change this template use File | Settings | File Templates.
 */

define(function(require,exports,module){
     var template = require("dinit"),
         app = require("controler/introduction"),
         templateList = template.templateList;

    templateList.introduction={
        init:{
            app:"introduction",
            cmd:"init",
            content:"body",
            dataUrl:"./user/getuserinfo",
            //data:{},
            templateUrl:"./template/introduction/index.htm",
            onload:function(param,data){
                app.init.init(param,data);
            }
        }
    };
})
