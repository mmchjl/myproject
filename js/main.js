/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-24
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 */

seajs.config({

});

define(function(require,exports,module){
    var template = require("./dinit");
    var p = require("./route/backstage");
    var introduction = require("./route/introduction");
    var index = require("./route/index"),
     shop = require("./route/shop");
        load = template.load,
        templateList = template.templateList;

    var string = {
        Format: function() {
            if (!arguments[0]) {
                return "";
            }
            if (arguments.length == 1) {
                return arguments[0];
            }
            else if (arguments.length >= 2) {

                for (var i = 1; i < arguments.length; i++) {
                    arguments[0] = arguments[0].replace(new RegExp("\\{" + (i - 1) + "\\}", "gm"), arguments[i]);
                }
                return arguments[0].replace(new RegExp("\\{", "gm"), "{").replace(new RegExp("\\}", "gm"), "}");
            }
        }
    };


    String.prototype.Trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    String.prototype.LTrim = function() {
        return this.replace(/(^[\\s]*)/g, "");
    };

    String.prototype.RTrim = function() {
        return this.replace(/([\\s]*$)/g, "");
    };
    String.prototype.HtmlDecode = function() {
        return this.replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    };
    String.prototype.HtmlEncode = function() {
        return this.replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    function isUndefined(obj) {
        return typeof (obj) == "undefined";
    }
    function isNull(obj) {
        return typeof (obj) == "undefined" || obj == null;
    }
    Array.prototype.ConvertAll = function(fun) {
        var r = [];
        for (var i = 0; i < this.length; i++) {
            r.push(fun(this[i]));
        }
        return r;
    };
    Array.prototype.FindAll = function(fun) {
        var r = [];
        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) r.push(this[i]);
        }
        return r;
    };
    Array.prototype.Find = function(fun) {
        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) return this[i];
        }
        return null;
    };
    Array.prototype.Exists = function(fun) {
        for (var i = 0; i < this.length; i++) {
            if (fun(this[i])) return true;
        }
        return false;

    };
    Array.prototype.Each = function(fun) {
        for (var i = 0; i < this.length; i++) {
            fun(this[i]);
        }
    };
    function CloneObj(target) {
        var obj = {};
        if (typeof target == "object") {
            var cb = arguments.callee;
            if (target instanceof Array) {
                for (var i = 0, obj = [], l = target.length; i < l; i++) {
                    obj.push(cb(target[i]));
                }
                return obj;
            }
            for (var i in target) {
                obj[i] = cb(target[i]);
            }
            return obj;
        }
        return target;
    }

    if(!Object.keys){
        Object.keys = function(obj){
            var arr=[];
            for(var i in obj){
                arr.push(i);
            }
            return arr;
        }
    }

    /**
     * 日期
     * 时间对象的格式化:
     * 如将date对象转化成yyyy-MM-dd hh:mm
     */
    Date.prototype.format = function(format) {
        /*
         * eg:format="YYYY-MM-dd hh:mm:ss";
         */
        var o = {
            "M+" :this.getMonth() + 1, // month
            "d+" :this.getDate(), // day
            "h+" :this.getHours(), // hour
            "m+" :this.getMinutes(), // minute
            "s+" :this.getSeconds(), // second
            "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
            "S" :this.getMilliseconds()
            // millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }

        for ( var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }

    /**
     * 对象验证
     * 根据对象的属性来将字符串转化成相应的数据类型
     */
    var objectValida = function (orgObj){
        var obj = {};
        for(var pro in orgObj){
            var type = pro.split("_")[1];
            if(type==undefined){
                continue;
            }
            switch(type){
                case "str":
                    //当字符变量的时候
                    obj[pro] = orgObj[pro];
                    break;
                case "bool":
                    //当为boolean变量的时候
                    var _val = orgObj[pro];
                    if(_val==1||_val.toLowerCase()=="true"){
                        obj[pro] = true;
                    }else{
                        obj[pro] = false;
                    }
                    break;
                case "int":
                    //当为整形变量的时候
                    obj[pro] =parseInt(orgObj[pro]);
                    break;
                case "long":
                    //当为c长整整
                    obj[pro] =parseInt(orgObj[pro]);
                    break;
                case "double":
                    //浮点型变量
                    obj[pro] =parseFloat(orgObj[pro]);
                    break;
                case "date":
                    //日期变量,要求格式为yyyy/MM/dd hh:mm
                    obj[pro] =Date.parse(orgObj[pro]);
                    break;
            }
        }
        return obj;
    }

    /**
     * 生成一个GUID
     */
    var Guid = function(format) {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        var temp = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        if(format==undefined ){
            return  temp;
        } else{
            switch(format.toLowerCase())
            {
                case "b":
                    return Format("{0}{1}{2}","{",temp,"}");
                    break;
                case "p":
                    return Format("{0}{1}{2}","(",temp,")");
                    break;
                case "n":
                    return temp.replace(/-/g,"");
                    break;
                case "d":
                default :
                    return temp;
                    break;
            }
        }
    };

    if(!$.cookies.get("cid")){
         load({
             app:"introduction",
             cmd:"init"
         });
    }else{
        load({
            app: "index",
            cmd:"init"
        });
    }
    if (typeof JSON == "undefined") {
        var url = "js/lib/json2";
        require.async(url);
    }
})
