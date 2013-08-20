/**
 * Created with JetBrains WebStorm.
 * User: NL_LE
 * Date: 13-7-29
 * Time: 上午9:05
 * To change this template use File | Settings | File Templates.
 */

var htmlEditor;
function FCKeditor_OnComplete(editorInstance) {
    htmlEditor = editorInstance;
    htmlEditor.onerror = function() {
        event.returnValue = false;
        return false;
    };
    if (typeof (htmlEditor_OnComplete) != "undefined") {
        htmlEditor_OnComplete();
    }
}


/*
 function NengLong_CMP_Web_SetTabStripStyle(id) {
 var obj = document.getElementById(id);
 obj.tabDefaultStyle = NengLong_Tab_DefaultStyle;
 obj.tabSelectedStyle = NengLong_Tab_SelectedStyle;
 obj.tabHoverStyle = NengLong_Tab_HoverStyle;

 for (var i = 0; i < obj.numTabs; i++) {
 var tab = obj.getTab(i);
 tab.setAttribute("title", tab.getAttribute("innerText"));
 }

 }*/
/* 通用函数 */
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



//========================================================命名空间Begin===========================================================
var dc = new Object();
var Namespace = new Object();
Namespace.Register = function(fullNS) {
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();";
    }
    if (sEval != "") eval(sEval);
};
Namespace.Exists = function(fullNS) {
    var nsArray = fullNS.split('.');
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        if (eval("typeof(" + sNS + ") == 'undefined'")) {
            return false;
        }
    }
    return true;
};
//========================================================命名空间End=============================================================

//========================================================系统函数Begin=============================================================
Namespace.Register("dc.System");
dc.System.LoadCss = function(file) {
    var cssTag = document.getElementById('loadCss');
    var head = document.getElementsByTagName('head').item(0);
    if (cssTag) head.removeChild(cssTag);
    var css = document.createElement('link');
    css.href = file;
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.id = 'loadCss';
    head.appendChild(css);
};
dc.System.LoadJsList = function(files, onload, iscache) {
    if (files.length > 0) {
        Nenglong.System.LoadJs(files.shift(), function() {
            Nenglong.System.LoadJsList(files, onload);
        }, iscache);

    }
    else {
        onload();
    }
};
dc.System.LoadJs = function(file, onload, iscache) {
    var js = $("script");
    var exists = false;
    if (typeof (iscache) == undefined || iscache == null) {
        iscache = false;
    }
    for (var i = 0; i < js.length; i++) {
        if (js[i].src == file) { exists = true; break; }
    }
    if (exists) {
        onload();
    }
    else {
        $.loadScript(file, onload, iscache);
    }
};
dc.System.ObjectEqual = function(obj1, obj2) {
    if (obj1 == obj2) return true;
    var equal = true;
    $.each(obj1, function(key, value) {
        if (typeof (obj2[key]) == "undefined" || obj2[key] != value) {
            equal = false;
        }
    });
    if (equal) {
        $.each(obj2, function(key, value) {
            if (typeof (obj1[key]) == "undefined" || obj1[key] != value) {
                equal = false;
            }
        });
    }
    return equal;
};

dc.System.GetJqObjectById = function(idOrJq) {
    var $jq = null;

    if (idOrJq instanceof jQuery)
        $jq = idOrJq;
    else if (typeof (idOrJq) != "undefined" && idOrJq.length > 0) {
        $jq = $("#" + idOrJq);
    }

    return $jq;
};

Namespace.Register("dc.System.Url");
dc.System.Url.GetQueryString = function(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var sUrl = window.location.search;
    if (typeof (url) != "undefined") sUrl = Nenglong.System.Url.Query(url);
    var r = sUrl.replace("?", "").match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
dc.System.Url.RegEx = function(url) {
    //如果加上/g参数，那么只返回$0匹配。也就是说arr.length = 0
    var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;
    //re.exec(url);
    var arr = url.match(re);
    return arr;
};
dc.System.Url.Host = function(url) {
    var arr = Nenglong.System.Url.RegEx(url);
    return typeof (arr[2]) == "undefined" ? "" : arr[2];
};
dc.System.Url.Path = function(url) {
    var arr = Nenglong.System.Url.RegEx(url);
    return typeof (arr[4]) == "undefined" ? "" : arr[4];
};
dc.System.Url.FileName = function(url) {
    var arr = Nenglong.System.Url.RegEx(url);
    return typeof (arr[5]) == "undefined" ? "" : arr[5];
};
dc.System.Url.Query = function(url) {
    var arr = Nenglong.System.Url.RegEx(url);
    var str = typeof (arr[7]) == "undefined" ? '' : arr[7];
    str += typeof (arr[6]) == "undefined" ? '' : arr[6];
    if (str.indexOf("#!") >= 0)
        return str.replace("#!", "&");
    else if (str.indexOf("#") >= 0)
        return str.replace("#", "&");
    else
        return str;
};

//获取参数列表
dc.System.Url.QueryParams = function(url) {
    var sUrl;
    if (typeof (url) != "undefined")
        sUrl = url;
    else
        sUrl = window.location.href;
    var query = Nenglong.System.Url.Query(sUrl);
    if (query.length > 1) {
        // 获取链接中参数部分
        var queryString = query.substring(query.indexOf("?") + 1);
        // 分离参数对 ?key=value&key2=value2
        var parameters = queryString.split("&");
        if (parameters.length > 0) {
            var pos, paraName, paraValue;
            var qs = {};
            var qstr = '';
            for (var i = 0; i < parameters.length; i++) {
                // 获取等号位置
                pos = parameters[i].indexOf('=');
                if (pos == -1) { continue; }

                qstr += ',\"' + parameters[i].substring(0, pos) + '\":\"' + parameters[i].substring(pos + 1) + '\"';
            }
            if (qstr.length > 1) {
                qstr = '{' + qstr.substring(1) + '}';
                qs = eval("(" + qstr + ")");
                return qs;
            }
        }
    }
    return null;
};
//========================================================系统函数End===============================================================

//=======================================================模板函数BEGIN=============================================================
//$.jTemplatesDebugMode(true);
Namespace.Register("Nenglong.Template");
var G_TemplateList = {};

var NengLong_Template_Default_Options = {
    app: "",
    cmd: "",
    content: "",
    isPanel: false,
    parent: "form1",
    templateUrl: "",
    dataUrl: "",
    data: null,
    filterData: true,
    requestType: "get",
    params: {},
    preload: function(opt) { },
    onload: function(opt, data) { },
    unload: function(opt) { }
};
if (typeof (G_Template_Params) == "undefined") {
    var G_Template_Params = {
        module: "communicate",
        panel: "div_Main",
        cmd: "",
        app: "",
        options: {},
        defaultCmd: "",
        defaultApp: "",
        currentPath: { panel: "", cmd: "", app: "", data: {}, path: {}, options: {} },
        historyPathList: [],
        historyPathList2: [],
        onload: [],
        unload: []
    };
}


Nenglong.Template.G_Route = G_TemplateList;

//-------------------------------------------------类Begin---------------------------------------------------------------------
function NengLongTemplate() {
    this.templateOnLoadContextArray = [];
    this.loadingTemplateCount = 0;
    this.loadingTemplateCountIncludeOnload = 0;
    this.appAndCmdTemp = [];
}

NengLongTemplate.prototype.load = function(ops, isExtendBySelf, deep, isExtendPrevLoadParams, extendOnloadEvent) {
    if ($.isPlainObject(ops)) {
        ops = new Array(ops);
    }
    if ($.isArray(ops)) {
        for (var i = 0; i < ops.length; i++) {
            var options = null;
            var p = {};
            var cO = this.getTemplateOptions(ops[i]);
            if (isExtendPrevLoadParams) {
                var prevList = $("#" + cO.content).data("prevOptions");
                if (typeof (prevList) != "undefined") p = prevList[prevList.length - 1];
                //p = $("#" + cO.content).data("options");
            }
            if (isExtendBySelf) {
                options = $.extend(deep, {}, NengLong_Template_Default_Options, cO, p, ops[i]);
            } else {
                options = $.extend(deep, {}, NengLong_Template_Default_Options, cO, p);
            }
            //设最后的参数
            G_Template_Params.options = options;

            this.templateLoad(options, extendOnloadEvent);
        }
    }
};

NengLongTemplate.prototype.showLoading = function(content) {
    var con = $("#" + content);
    var $loading = con.find(".loading");
    if ($loading.length == 0) {
        $loading = $('<div class="loading"><div class="loadpic"></div><div class="NewsLoad"></div></div>');
        con.prepend($loading);
    }
    var height = con.height();
    var width = con.width();
    $loading.height(height).width(width);
    $loading.find(".NewsLoad").height(height).width(width);
    $loading.find(".loadpic").css("top", function() { return (($loading.height() - $(this).height()) / 2); }).css("left", function() { return (($loading.width() - $(this).width()) / 2); });
};

NengLongTemplate.prototype.hideLoading = function(content) {
    if (typeof (content) != "undefined" && content.length > 0) {
        //$('#' + content).find(".loading").remove();
    }
    else {
        //$('.loading').remove();
    }
}

NengLongTemplate.prototype.templateLoad = function(options, extendOnloadEvent) {
    //加载前函数
    var contentList = options.content.split(",");
    var _this = this;
    $.each(contentList, function(index, content) {
        if (options.showLoading)
            _this.showLoading(content);
    });

    if (options.preload(options) == false) {
        $.each(contentList, function(index, content) {
            if (options.showLoading)
                _this.hideLoading(content);
        });
        return;
    }
    //正常加载
    if (options.content.length == 0) {
        alert("app " + options.app + " cmd " + options.cmd + " content Id is empty");
        $.each(contentList, function(index, content) {
            if (options.showLoading)
                _this.hideLoading(content);
        });
        return;
    };
    this.loadingTemplateCount++;
    this.loadingTemplateCountIncludeOnload++;

    var urlList = options.templateUrl.split(",");
    if (contentList.length != urlList.length) {
        alert("content count is not equal to templateUrl count");
        $.each(contentList, function(index, content) {
            if (options.showLoading)
                _this.hideLoading(content);
        });
        return;
    };
    var contents = [];
    for (var i = 0; i < contentList.length; i++) {
        var $content = $("#" + $.trim(contentList[i]));
        if (options.isPanel && $content.length == 0) {
            $content = $(string.Format("<div id='{0}'></div>", $.trim(contentList[i])));
            $content.appendTo("#" + options.parent);
        };
        var url = $.trim(urlList[i]);
/*        if (url.indexOf("~") >= 0) {
            url = url.replace('~', NENGLONG_CMP_URL_BASE).replace("//", "/");
        }
        else if (url.indexOf(NENGLONG_CMP_URL_BASE) != 0 && url.indexOf("http://") < 0) {
            url = NENGLONG_CMP_URL_TEMPLATE + url;
        }*/
        //app应用跨域时
        if (url.indexOf("http://") >= 0 && url.indexOf(window.location.host) < 0) {
            url = Nenglong.System.App.GetProxyUrl(url);
        }
        $content.setTemplateURL(url, null, { filter_data: options.filterData });
        contents.push($content);
    }

    if (this.templateUnload(contents, options, true) == false) {
        return;
    }

    var dataUrl = options.dataUrl;
    if (typeof (options.data) != "undefined" && options.data != null && $.isPlainObject(options.data)) {
        this.templateOnLoadContextArray.push({ "options": options, "data": options.data, extendOnload: extendOnloadEvent });
        this.templateProcess(options, options.data, contents);
    }
    else {
        if (dataUrl != "") {
/*            if (dataUrl.indexOf("http://") < 0) {
                dataUrl = NENGLONG_CMP_URL_BASE + dataUrl;
            } else if (url.indexOf(window.location.host) < 0) {
                dataUrl = Nenglong.System.App.GetProxyUrl(dataUrl, options.params);
            }*/
            $.ajax({
                type: options.requestType,
                dataType: "json",
                url: dataUrl,
                cache:false,
                data: options.params,
                success: function(data) {
                    _this.templateOnLoadContextArray.push({ "options": options, "data": data, extendOnload: extendOnloadEvent });
                    _this.templateProcess(options, data, contents);
                },
                error: function(rs) {
                    if (rs.status != 0) {
                        _this.loadingTemplateCount--;
                        //contents[0].html('loading error!');
                        //设置loading动画begin
                        //设置loading动画end
                        alert("数据加载失败、请重试！", function() {
                            var contentList = options.content.split(",");
                            $.each(contentList, function(index, content) {
                                _this.hideLoading(content);
                            });
                        });
                    }
                }
            });
        } else {
            this.templateOnLoadContextArray.push({ "options": options, "data": null, extendOnload: extendOnloadEvent });
            this.templateProcess(options, null, contents);
        }
    }
};

NengLongTemplate.prototype.templateUnload = function(contents, options, findChildren) {
    var r = true;
    for (var i = 0; i < contents.length; i++) {
        var opt = contents[i].data("currentOptions");
        if (opt) {
            if (findChildren) {
                var list = [];
                $("[templateLoad=true]", contents[i]).each(function() { list.push($(this)); });
                if (list.length > 0) {
                    var sr = this.templateUnload(list, options, false);
                    if (r != false)
                        r = sr;
                }
            }
            var sr = opt.unload(opt, options);
            if (r != false)
                r = sr;
        }
        if (r != false) {
            contents[i].attr("templateLoad", "true");
            if (findChildren)
                contents[i].data("currentOptions", options);
            else
                contents[i].data("currentOptions", null);
        }
    }

    for (var i = 0; i < G_Template_Params.unload.length; i++) {
        var sr = G_Template_Params.unload[i](opt, options);
        if (rv != false)
            r = sr;
    }

    if (r != false)
        //Nenglong.Template.G_Path.releasePath(opt);

    return r;
};

NengLongTemplate.prototype.templateProcess = function(options, data, contents) {
    //G_Template_Params.LoadPath(G_Template_Params.options);
    //var _this = this;
    for (var i = 0; i < contents.length; i++) {
        contents[i].processTemplate(data);
        var domList = $("[template=true][load=true]", contents[i]).toArray();
        //debugger;
        var pros = Object.keys(options.params);
        if(pros.length>0&&pros.Exists(function(obj){return obj.indexOf(".")!=-1})){
            for (var j = 0; j < domList.length; j++) {
                var opt = getDomAppAndCmd(domList[j]);
                if(options.params.routeChange){
                    opt.cmd = options.params.routeChange[opt.cmd];
                    delete options.params.routeChange;
                }
                var Npros = pros.FindAll(function(obj){return obj.indexOf(opt.cmd)!=-1});
                if(Npros&&Npros.length>0){
                    for(var n=0;n<Npros.length;n++){
                        var _t = Npros[n];
                        var cmds = _t.split(".");
                        cmds.shift();
                        if(!opt.params) opt.params={};
                        opt.params[cmds.join(".")] = options.params[Npros];
                        delete options.params[Npros];
                    }
                }
                this.load(opt,true);
            }
        }else{
            for (var j = 0; j < domList.length; j++) {
                var opt = getDomAppAndCmd(domList[j]);
                if(options.params.routeChange){
                    opt.cmd = options.params.routeChange[opt.cmd];
                    delete options.params.routeChange;
                }
                this.load(opt);
            }
        }
    };
    this.loadingTemplateCount--;
    //设置loading动画begin

    //设置loading动画end
    if (this.loadingTemplateCount == 0) {
        //一个指令中加载其它指令时，取第一个为路径指令。
        G_Template_Params.currentPath.panel = this.appAndCmdTemp[0].panel;
        G_Template_Params.currentPath.app = this.appAndCmdTemp[0].app;
        G_Template_Params.currentPath.cmd = this.appAndCmdTemp[0].cmd;
        G_Template_Params.currentPath.data = data;
        G_Template_Params.currentPath.path = G_Template_Params.options.path;

        //for (var i = this.templateOnLoadContextArray.length - 1; i >= 0; i--) {
        for (var i = 0; i < this.templateOnLoadContextArray.length; i++) {
            for (var j = 0; j < G_Template_Params.onload.length; j++) {
                G_Template_Params.onload[j](this.templateOnLoadContextArray[i].options, this.templateOnLoadContextArray[i].data);
            }

            //Nenglong.Template.G_Path.addHistory(this.templateOnLoadContextArray[i].options, this.templateOnLoadContextArray[i].data);

            this.templateOnLoadContextArray[i].options.onload(this.templateOnLoadContextArray[i].options, this.templateOnLoadContextArray[i].data);
            if (this.templateOnLoadContextArray[i].extendOnload && $.isFunction(this.templateOnLoadContextArray[i].extendOnload))
                this.templateOnLoadContextArray[i].extendOnload(this.templateOnLoadContextArray[i].options, this.templateOnLoadContextArray[i].data);

            this.loadingTemplateCountIncludeOnload--;

            var contentIds = this.templateOnLoadContextArray[i].options.content.split(",");
            for (var j = 0; j < contentIds.length; j++) {
                var $con = $("#" + contentIds[j]);
                if ($con.length > 0) {
                    var prevList = $con.data("prevOptions");
                    if (typeof (prevList) == "undefined") {
                        $con.data("prevOptions", []);
                        prevList = $con.data("prevOptions");
                    }
                    prevList.push(this.templateOnLoadContextArray[i].options);
                    if (prevList.length > 10) prevList.shift();
                }
            };
        }

        //设置loading动画begin
        //G_NengLongLoading.animate(100);
        //G_NengLongLoading.hide();
        //设置loading动画end
    }
    if (this.loadingTemplateCountIncludeOnload == 0) {
        //Nenglong.Template.G_Navi.createNaviFromRoute(options);
        //Nenglong.Template.G_Path.createPath();
    }
};

NengLongTemplate.prototype.getTemplateOptions = function(obj) {
    var app = obj.app, cmd = obj.cmd;
    var returnVal = null;

    if (typeof (app) != "undefined" && app != null) G_Template_Params.app = app;
    if (typeof (cmd) != "undefined" && cmd != null) G_Template_Params.cmd = cmd;
    var cApp = G_Template_Params.app, cCmd = G_Template_Params.cmd;

    if (typeof (G_TemplateList[cApp]) == "undefined") {
        returnVal = G_TemplateList[G_Template_Params.defaultApp][G_Template_Params.defaultCmd];
    }
    else {
        if (typeof (G_TemplateList[cApp][cCmd]) == "undefined") {
            var defaultObj = null;
            $.each(G_TemplateList[cApp], function(key, value) { defaultObj = value; return false; });
            if (defaultObj != null)
                returnVal = defaultObj;
            else
                returnVal = G_TemplateList[G_Template_Params.defaultApp][G_Template_Params.defaultCmd];
            //if (typeof (cmd) == "undefined") {
            //    return G_TemplateList[cApp][G_Template_Params.defaultCmd];
            //}
            //else {
            //    return G_TemplateList[G_Template_Params.defaultApp][cmd];
            //}
        }
        else {
            returnVal = G_TemplateList[cApp][cCmd];
        }
    }
    if (returnVal.isPanel) {
        G_Template_Params.panel = returnVal.content;
        G_Template_Params.module = returnVal.app;
    }
    this.appAndCmdTemp.push({ panel: G_Template_Params.panel, app: returnVal.app, cmd: returnVal.cmd });
    return returnVal;
};
//-------------------------------------------------类End-----------------------------------------------------------------------

//-------------------------------------------------以下是模板公有函数--------------------------------------------------------


$.ajaxSetup({
    complete: function(xhr, ts) {
        AjaxSetupcomplete(xhr, ts);
    },
    statusCode: {
        302: function() {
            //location.href = NENGLONG_CMP_LOGINPAGE;
        }
    }
});

function AjaxSetupcomplete(xhr, ts) {
    //加上undefined判断是为了getScript跨域时不出错
    if (typeof (xhr) != "undefined" && typeof (xhr.responseText) != "undefined") {
        if (xhr.responseText == "unlogin") {
            if (top.dialogHeight) {
                top.close();
            }
            else {
                //top.location.href = NENGLONG_CMP_LOGINPAGE;
            }
        }
        else if (xhr.responseText.indexOf("<SCRIPT language='javascript'>") == 0) {
            var script = xhr.responseText.replace("<SCRIPT language='javascript'>", "").replace("</SCRIPT>", "");
            eval(script);
        }
    }
}



//页面初始化
function NengLongTemplateInit() {
    $("[template=true][load=true]").each(function() {
        NengLongTemplateLoad(getDomAppAndCmd(this));
    });

    $("[template=true][click=true]").live("click", function() {
        NengLongTemplateLoad(getDomAppAndCmd(this));
    });
}

//加载模板
//isNoShowLoading不展现加载动画
function NengLongTemplateLoad(ops, isExtendBySelf, deep, isExtendPrevLoadParams, extendOnLoadEvent, isNoShowLoading) {
    if (!arguments[1]) isExtendBySelf = true;
    if (!arguments[2]) deep = false;
    if (!arguments[3]) isExtendPrevLoadParams = false;
    if (!arguments[4] && $.isFunction(arguments[4]) == false) extendOnLoadEvent = function() { };
    var o = new NengLongTemplate();
    o.load(ops, isExtendBySelf, deep, isExtendPrevLoadParams, extendOnLoadEvent);
    return;
}

//刷新最后加载的template路由
function NengLongTemplateReload(container) {
    var $container = null;
    if (typeof (container) != "undefined" && container.length > 0)
        $container = $("#" + container);
    if ($container == null || $container.length == 0) {
        NengLongTemplateLoad(G_Template_Params.options, true);
    }
    else {
        var prevOptions = $container.data("prevOptions");
        if (typeof (prevOptions) == "undefined" || prevOptions.length == 0)
            NengLongTemplateLoad(G_Template_Params.options, true);
        else
            Nenglong.Template.Load(prevOptions.pop());
    }
    //NengLongTemplateLoad({ "app": G_Template_Params.app, "cmd": G_Template_Params.cmd }, true);
}

Nenglong.Template.Reload = NengLongTemplateReload;
Nenglong.Template.Load = NengLongTemplateLoad;
Nenglong.Template.Init = NengLongTemplateInit;

//加载进入新版各功能主页
Nenglong.Template.EnterMain = function(appEntranceRouteOrFun) {
    if ($.isPlainObject(appEntranceRouteOrFun)) {
        Nenglong.Template.Load({
            app: "communicate",
            cmd: "init"
        }, true, true, false, function() { Nenglong.Template.Load(appEntranceRouteOrFun); });
    }
    else if ($.isFunction(appEntranceRouteOrFun)) {
        Nenglong.Template.Load({
            app: "communicate",
            cmd: "init"
        }, true, true, false, function() { appEntranceRouteOrFun(); });
    }
    else {
        alert("跳转出错");
    }
};

Nenglong.Template.CheckRoute = function(app, isAlert) {
    if (typeof (Nenglong.Template.G_Route[app]) != "undefined") {
        if (typeof (isAlert) == "undefined" || isAlert) {
            alert("Route" + app + "exist!");
        }
        return true;
    }
    return false;

};

Nenglong.Template.PrevRoute = function(contextId) {
    var prevList = $("#" + contextId).data("prevOptions");

    if (Nenglong.Template.CheckIsExistPrevRoute(contextId)) {

        if (Nenglong.Template.CheckIsExistNextRoute(contextId)) {
            var nextList = $("#" + contextId).data("nextOptions");
            var c = prevList.pop();
            c = prevList.pop();
            nextList.unshift(c);
            Nenglong.Template.Load(c);
        }
        else {
            $("#" + contextId).data("nextOptions", []);
            var nextList = $("#" + contextId).data("nextOptions");
            var c = prevList.pop();
            nextList.unshift(c);
            c = prevList.pop();
            nextList.unshift(c);
            Nenglong.Template.Load(c);
        }
    }
};
Nenglong.Template.NextRoute = function(contextId) {
    if (Nenglong.Template.CheckIsExistNextRoute(contextId)) {
        var nextList = $("#" + contextId).data("nextOptions");
        var c = nextList.shift();
        Nenglong.Template.Load(nextList[0]);
    }
};
Nenglong.Template.CheckIsExistPrevRoute = function(contextId) {
    var prevList = $("#" + contextId).data("prevOptions");
    if (typeof (prevList) == "undefined" || prevList.length <= 1) {
        return false;
    }
    return true;
};
Nenglong.Template.CheckIsExistNextRoute = function(contextId) {
    var nextList = $("#" + contextId).data("nextOptions");
    if (typeof (nextList) == "undefined" || nextList.length <= 1) {
        return false;
    }
    var prevList = $("#" + contextId).data("prevOptions");
    return Nenglong.System.ObjectEqual(prevList[prevList.length - 1], nextList[0]);
};
//---------------------------------------------------------以下是模板公有函数END------------------------------------------------------

//------------------------------------------------------------模板私有方法BEGIN--------------------------------------------------------



function getDomAppAndCmd(dom) {
    var ops = [];
    var appStr = $(dom).attr("app");
    var cmdStr = $(dom).attr("cmd");
    var apps = [], cmds = [];
    if (typeof (appStr) != "undefined") { apps = appStr.split(",") };
    if (typeof (cmdStr) != "undefined") { cmds = cmdStr.split(",") };
    for (var i = 0; i < apps.length; i++) {
        ops.push({ "app": apps[i] });
    }
    for (var i = 0; i < cmds.length; i++) {
        if (i < ops.length) {
            ops[i].cmd = cmds[i];
        } else {
            ops.push({ "cmd": cmds[i] });
        }
    }
    if (ops.length == 1) { ops = ops[0] };
    if (ops.length == 0) { ops = { "app": G_Template_Params.app, "cmd": G_Template_Params.cmd} };
    return ops;
}
//----------------------------------------------------------模板私有方法END-------------------------------------------------------------
//=============================================================模板函数END===============================================================


Namespace.Register("Nenglong.UI.PageControl");
Nenglong.UI.PageControl = function(param) {
    this.setting = {
        objlist: [],
        keyName: "key",
        defaultValue: '',
        nextBtn: null,
        nextBtnClick: function(clickResult) {
        },
        prevBtn: null,
        prevBtnClick: function(clickResult) {
        },
        pageSize: 0,
        objClick: function(clickResult) {
        },
        pageChange: function(pageIndex, pageTotal) {
        }
    };

    this.isReClick = false;

    $.extend(true, this.setting, param);

    var sel = this;
    var settingParam = this.setting;

    var selectKey = '';
    var selectValue = '';
    var currentPage = 1;
    var isReflash = false;
    var currentObj = null;
    var total = settingParam.objlist.length;
    var page = computePageNum(settingParam.pageSize, total);

    //绑定向下事件
    if (settingParam.nextBtn instanceof jQuery) {
        settingParam.nextBtn.unbind("click").bind("click", function() {
            if (currentPage < page) {
                currentPage++;
                isReflash = true;
                showList();
                var clickResult = {
                    obj: $(this),
                    pageIndex: currentPage,
                    pageTotal: page
                };
                if ($.isFunction(settingParam.nextBtnClick)) {
                    settingParam.nextBtnClick(clickResult);
                }
                if ($.isFunction(settingParam.pageChange)) {
                    settingParam.pageChange(currentPage, page);
                }
            }
        });
    }

    //绑定向上事件
    if (settingParam.prevBtn instanceof jQuery) {
        settingParam.prevBtn.unbind("click").bind("click", function() {
            if (currentPage > 1) {
                currentPage--;
                isReflash = true;
                showList();
                var clickResult = {
                    obj: $(this),
                    pageIndex: currentPage,
                    pageTotal: page
                };
                if ($.isFunction(settingParam.prevBtnClick)) {
                    settingParam.prevBtnClick(clickResult);
                }
                if ($.isFunction(settingParam.pageChange)) {
                    settingParam.pageChange(currentPage, page);
                }
            }
        });
    }

    //各项点击事件
    settingParam.objlist.each(function(index, obj) {
        $(obj).unbind("click").bind("click", function() {
            sel.SelectObj(getObjValue($(this)));
        });
    });

    //选取项
    this.SelectObj = function(value) {
        var obj = getObj(value);
        var index = getIndex(value);
        currentObj = obj;
        selectKey = index;
        selectValue = value;
        changeCurrentPage(computePageNum(settingParam.pageSize, total, index));

        showList();

        var clickResult = {
            pageControl: sel,
            objlist: settingParam.objlist,
            "index": index,
            value: getObjValue(currentObj),
            obj: currentObj,
            page: currentPage
        };

        if ($.isFunction(settingParam.objClick)) {
            settingParam.objClick(clickResult);
        }

        if ($.isFunction(settingParam.pageChange)) {
            settingParam.pageChange(currentPage, page);
        }
    };

    this.Next = function() {
        var nextObj = currentObj.next();
        if (nextObj.length > 0) {
            sel.SelectObj(getObjValue(nextObj));
            return true;
        }
        return false;
    };

    this.Prev = function() {
        var prevObj = currentObj.prev();
        if (prevObj.length > 0) {
            sel.SelectObj(getObjValue(prevObj));
            return true;
        }
        return false;
    };

    this.ReClick = function() {
        sel.isReClick = true;
        currentObj.click();
        sel.isReClick = false;
    };

    this.GetSelectedDom = function() {
        return currentObj[0];
    };

    this.GetSelectedJq = function() {
        return currentObj;
    };

    isReflash = true;
    sel.SelectObj(settingParam.defaultValue);

    //显示列表

    function showList() {
        if (isReflash == true) {
            var minIndex = (currentPage - 1) * settingParam.pageSize;
            var maxIndex = currentPage * settingParam.pageSize - 1;
            if (maxIndex >= total)
                maxIndex = total - 1;

            settingParam.objlist.hide();

            for (var i = minIndex; i <= maxIndex; i++) {
                getObjByIndex(i).show();
            }

            isReflash = false;
        }
    }

    //根据值获取项

    function getObj(value) {
        var obj = settingParam.objlist.filter("[" + settingParam.keyName + "=" + value + "]");
        if (obj.length > 0)
            return obj;
        else
            return settingParam.objlist.first();
    }

    //根据值获取index

    function getIndex(value) {
        var index = settingParam.objlist.filter("[" + settingParam.keyName + "=" + value + "]").index();
        if (index == -1)
            index = 0;
        return index;
    }

    function getObjValue(obj) {
        return obj.attr(settingParam.keyName);
    }

    function getObjByIndex(index) {
        if (index < settingParam.objlist.length)
            return settingParam.objlist.eq(index);
        else
            return settingParam.objlist.first();
    }

    function computePageNum(pageSize, total, index) {
        var page = 1;
        var position = 1;

        if (typeof (index) == "undefined" || index + 1 > total) {
            position = total;
        } else if (index < 0) {
            position = 1;
        } else {
            position = index + 1;
        }

        page = parseInt(position / pageSize);
        if (position > page * pageSize)
            page++;

        return page;
    }

    function changeCurrentPage(newPage) {
        if (currentPage != newPage) {
            isReflash = true;
        }

        currentPage = newPage;
    }

    return this;
};
//=================================================================UI END==========================================================================//

//=================================================================AJAX共用方法 BEGIN==========================================================================//
Namespace.Register("Nenglong.Ajax");
Nenglong.Ajax.PostData = function(url, ops, successCallback, errorCallback, async, isStandardFormat) {
    Nenglong.Ajax.AjaxData(url, ops, successCallback, errorCallback, "post", async, isStandardFormat);
};

Nenglong.Ajax.GetData = function(url, ops, successCallback, errorCallback, async, isStandardFormat) {
    Nenglong.Ajax.AjaxData(url, ops, successCallback, errorCallback, "get", async, isStandardFormat);
};

//返回类型固定格式：
//{
//    result: 获取数据结果，true表示成功，false表示出错；没有此值，也表示错误，也会调用errorCallback
//    Data: 数据，成功时返回数据json对象，失败时返回错误信息
//}
Nenglong.Ajax.AjaxData = function(url, ops, successCallback, errorCallback, ajaxType, async, isStandardFormat) {
    var _isStandardFormat = true;
    if (isStandardFormat == false)
        _isStandardFormat = false;

    var ay = true;
    if (async == false)
        ay = false;

    var type = ajaxType;
    if (!type || type.length == 0)
        type = "get";

    var dataUrl = url;
    if (url.indexOf("http://") >= 0 && url.indexOf(window.location.host) < 0) {
        if (type == "get")
            dataUrl = Nenglong.System.App.GetProxyUrl(url, ops);
        else
            dataUrl = Nenglong.System.App.GetProxyUrl(url);
    }

    $.ajax({
        "type": type,
        url: dataUrl,
        data: ops,
        cache:false,
        dataType: "json",
        async: ay,
        success: function(data) {
            if (_isStandardFormat == true) {
                if (data && typeof (data.result) != "undefined") {
                    if (data.result == true) {
                        if (successCallback)
                            successCallback(data.data);
                    } else {
                        if (errorCallback)
                            errorCallback(data.data);
                    }
                } else {
                    if (errorCallback) errorCallback("失败");
                }
            } else {
                if (successCallback)
                    successCallback(data);
            }
        }
    }).error(function() { if (errorCallback) errorCallback('连接失败'); });
};
//=================================================================AJAX共用方法 END============================================================================//


//=====================================================交流互动的所有全局变量BEGIN==========================================
// var G_TemplateList = {};
var G_CommunicateInitOnload = [];
//=====================================================交流互动的所有全局变量END============================================


//=======================================================脚本加载后初始化BEGIN===============================================
if (typeof (G_OnLoadParams) != "undefined") {
    G_OnLoadParams.onload.push(function() {
        NengLongTemplateInit();
        $(document).unbind("keydown.pageKeyDown").bind("keydown.pageKeyDown", NengLongPageOnKeyDown);
        //$("#loading div").animate({ width: "34px" }).text("34%");
    });
}
//=======================================================脚本加载后初始化END=================================================

//=======================================================分页BEGIN=============================================================
function NenglongPageInit(options, data) {
    var $divs = $("#" + options.content + " [page=true]");
    $divs.each(function() {
        var pageCount = parseInt($(this).attr("pageCount")), pageIndex = parseInt($(this).attr("pageIndex")), pageTotal = parseInt($(this).attr("pageTotal")), app = $(this).attr("app"), cmd = $(this).attr("cmd");
        var nextBtn = $(this).find("a.next");
        var prevBtn = $(this).find("a.prve");
        var clickBtn = $(this).find("[click=true]");
        var pageClass = $(this).attr("pageClass");
        var currentPageClass = $(this).attr("currentPageClass");

        if (typeof (app) == "undefined") app = "";
        if (typeof (cmd) == "undefined") cmd = "";
        if (pageIndex <= 1) {
            pageIndex = 1; prevBtn.attr("href", "javascript:");
        }
        else {
            prevBtn.attr("href", "javascript:NenglongPageClick(" + (pageIndex - 1) + ",'" + app + "','" + cmd + "');");
        }
        if (pageIndex >= pageTotal) {
            pageIndex = pageTotal; nextBtn.attr("href", "javascript:");
        }
        else {
            nextBtn.attr("href", "javascript:NenglongPageClick(" + (pageIndex + 1) + ",'" + app + "','" + cmd + "');");
        }
        var pageList = [];
        if (pageCount >= pageTotal) {
            for (var i = 1; i <= pageTotal; i++) {
                pageList.push(i);
            }
        }
        else if (pageIndex < (pageCount / 2 + 2)) {
            for (var i = 1; i < pageCount; i++) {
                pageList.push(i);
            }
            pageList.push(0);
            pageList.push(pageTotal);
        }
        else if (pageIndex > (pageTotal - pageCount / 2 - 2)) {
            pageList.push(1);
            pageList.push(-1);
            var begin = pageTotal - pageCount + 1;
            for (var i = (begin == 2 ? 3 : begin); i <= pageTotal; i++) {
                pageList.push(i);
            }
        }
        else {
            pageList.push(1);
            pageList.push(-1);
            for (var i = pageIndex - pageCount / 2 + 1; i <= pageIndex + pageCount / 2; i++) {
                pageList.push(i);
            }
            pageList.push(0);
            pageList.push(pageTotal);
        }

        for (var i = 0; i < pageList.length; i++) {
            var index = pageList[i];
            var url = "";
            if (index == -1) {
                index = "...";
                url = "javascript:NenglongPageClick(" + (pageIndex - pageCount / 2) + ",'" + app + "','" + cmd + "');";
            }
            else if (index == 0) {
                index = "...";
                url = "javascript:NenglongPageClick(" + (pageIndex + pageCount / 2 + 1) + ",'" + app + "','" + cmd + "');";
            }
            else {
                url = "javascript:NenglongPageClick(" + index + ",'" + app + "','" + cmd + "');";
            }
            if (index == pageIndex) {
                $("<a class=\"" + (currentPageClass == undefined || currentPageClass.length == 0 ? "selected" : currentPageClass) + "\" href='javascript:'>" + index + "<em></em></a>").insertBefore(nextBtn);
            } else {
                $("<a href=\"" + url + "\"" + (pageClass == undefined || pageClass.length == 0 ? "" : (" class=\"" + pageClass + "\"")) + ">" + index + "<em></em></a>").insertBefore(nextBtn);
            }
        }

        $(this).attr("page", "false");
        clickBtn.click(function() {
            NenglongPageClick($(this).prev().val(), app, cmd);
            return false;
        }).prev().val(pageIndex);

    });

}
function NenglongPageClick(pageIndex, app, cmd) {
    if (app.length == 0) app = null;
    if (cmd.length == 0) cmd = null;
    NengLongTemplateLoad({ "app": app, "cmd": cmd, "params": { "pageIndex": pageIndex} }, true, true, true);
}
function NengLongPageOnKeyDown(e) {
    var $obj = $("[page][onkey=true]");
    if ($obj.length > 0) {
        var pageIndex = parseInt($obj.attr("pageIndex")), pageTotal = parseInt($obj.attr("pageTotal")), app = $obj.attr("app"), cmd = $obj.attr("cmd");
        if (e.keyCode == 37 && pageIndex > 1) {
            NenglongPageClick(--pageIndex, app, cmd);
        }
        if (e.keyCode == 39 && pageIndex < pageTotal) {
            NenglongPageClick(++pageIndex, app, cmd);
        }

    }

}
G_Template_Params.onload.push(NenglongPageInit);
//=========================================================分页END==========================================================

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


