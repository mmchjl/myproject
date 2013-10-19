define(function (require, exports, module) {
    //var $ = require("jquery");

    var G_TemplateList = {};

	module.exports.templateList = G_TemplateList;
	
    var defaultOptions = {
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
        preload: function (opt) { },
        onload: function (opt, data) { },
        unload: function (opt) { }
    };

    var globalParams = {
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

    function Template() {
        this.templateOnLoadContextArray = [];
        this.loadingTemplateCount = 0;
        this.loadingTemplateCountIncludeOnload = 0;
        this.appAndCmdTemp = [];
    }

    Template.prototype.load = function (ops, isExtendBySelf, deep, isExtendPrevLoadParams, extendOnloadEvent) {
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
                    options = $.extend(deep, {}, defaultOptions, cO, p, ops[i]);
                } else {
                    options = $.extend(deep, {}, defaultOptions, cO, p);
                }
                //设最后的参数
                globalParams.options = options;

                this.templateLoad(options, extendOnloadEvent);
            }
        }
    };

    Template.prototype.showLoading = function (content) {
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
        $loading.find(".loadpic").css("top", function () { return (($loading.height() - $(this).height()) / 2); }).css("left", function () { return (($loading.width() - $(this).width()) / 2); });
    };

    Template.prototype.hideLoading = function (content) {
        if (typeof (content) != "undefined" && content.length > 0) {
            //$('#' + content).find(".loading").remove();
        }
        else {
            //$('.loading').remove();
        }
    }

    Template.prototype.templateLoad = function (options, extendOnloadEvent) {
        //加载前函数
        var contentList = options.content.split(",");
        var _this = this;
        $.each(contentList, function (index, content) {
            if (options.showLoading)
                _this.showLoading(content);
        });

        if (options.preload(options) == false) {
            $.each(contentList, function (index, content) {
                if (options.showLoading)
                    _this.hideLoading(content);
            });
            return;
        }
        //正常加载
        if (options.content.length == 0) {
            alert("app " + options.app + " cmd " + options.cmd + " content Id is empty");
            $.each(contentList, function (index, content) {
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
            $.each(contentList, function (index, content) {
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
                $("#body").css({cursor:"wait"});
                $.ajax({
                    type: options.requestType,
                    dataType: "json",
                    url: dataUrl,
                    cache: false,
                    data: options.params,
                    success: function (data) {
                        _this.templateOnLoadContextArray.push({ "options": options, "data": data, extendOnload: extendOnloadEvent });
                        _this.templateProcess(options, data, contents);
                        $("#body").css({cursor:"inherit"});
                    },
                    error: function (rs) {
                        if (rs.status != 0) {
                            $("#body").css({cursor:"inherit"});
                            _this.loadingTemplateCount--;
                            //contents[0].html('loading error!');
                            //设置loading动画begin
                            //设置loading动画end
                            alert("数据加载失败、请重试！", function () {
                                var contentList = options.content.split(",");
                                $.each(contentList, function (index, content) {
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

    Template.prototype.templateUnload = function (contents, options, findChildren) {
        var r = true;
        for (var i = 0; i < contents.length; i++) {
            var opt = contents[i].data("currentOptions");
            if (opt) {
                if (findChildren) {
                    var list = [];
                    $("[templateLoad=true]", contents[i]).each(function () { list.push($(this)); });
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

        for (var i = 0; i < globalParams.unload.length; i++) {
            var sr = globalParams.unload[i](opt, options);
            if (rv != false)
                r = sr;
        }

        if (r != false)
            //Nenglong.Template.G_Path.releasePath(opt);

            return r;
    };

    Template.prototype.templateProcess = function (options, data, contents) {
        //globalParams.LoadPath(globalParams.options);
        //var _this = this;
        for (var i = 0; i < contents.length; i++) {
            contents[i].processTemplate(data);
            var domList = $("[template=true][load=true]", contents[i]).toArray();
            //debugger;
            var pros = Object.keys(options.params);
            if (pros.length > 0 && pros.Exists(function (obj) { return obj.indexOf(".") != -1 })) {
                for (var j = 0; j < domList.length; j++) {
                    var opt = getDomAppAndCmd(domList[j]);
                    if (options.params.routeChange) {
                        opt.cmd = options.params.routeChange[opt.cmd];
                        delete options.params.routeChange;
                    }
                    var Npros = pros.FindAll(function (obj) { return obj.indexOf(opt.cmd) != -1 });
                    if (Npros && Npros.length > 0) {
                        for (var n = 0; n < Npros.length; n++) {
                            var _t = Npros[n];
                            var cmds = _t.split(".");
                            cmds.shift();
                            if (!opt.params) opt.params = {};
                            opt.params[cmds.join(".")] = options.params[Npros];
                            delete options.params[Npros];
                        }
                    }
                    this.load(opt, true);
                }
            } else {
                for (var j = 0; j < domList.length; j++) {
                    var opt = getDomAppAndCmd(domList[j]);
                    if (options.params.routeChange) {
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
            globalParams.currentPath.panel = this.appAndCmdTemp[0].panel;
            globalParams.currentPath.app = this.appAndCmdTemp[0].app;
            globalParams.currentPath.cmd = this.appAndCmdTemp[0].cmd;
            globalParams.currentPath.data = data;
            globalParams.currentPath.path = globalParams.options.path;

            //for (var i = this.templateOnLoadContextArray.length - 1; i >= 0; i--) {
            for (var i = 0; i < this.templateOnLoadContextArray.length; i++) {
                for (var j = 0; j < globalParams.onload.length; j++) {
                    globalParams.onload[j](this.templateOnLoadContextArray[i].options, this.templateOnLoadContextArray[i].data);
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

    Template.prototype.getTemplateOptions = function (obj) {
        var app = obj.app, cmd = obj.cmd;
        var returnVal = null;
        //debugger;
        if (typeof (app) != "undefined" && app != null) globalParams.app = app;
        if (typeof (cmd) != "undefined" && cmd != null) globalParams.cmd = cmd;
        var cApp = globalParams.app, cCmd = globalParams.cmd;

        if (typeof (G_TemplateList[cApp]) == "undefined") {
            returnVal = G_TemplateList[globalParams.defaultApp][globalParams.defaultCmd];
        }
        else {
            if (typeof (G_TemplateList[cApp][cCmd]) == "undefined") {
                var defaultObj = null;
                $.each(G_TemplateList[cApp], function (key, value) { defaultObj = value; return false; });
                if (defaultObj != null)
                    returnVal = defaultObj;
                else
                    returnVal = G_TemplateList[globalParams.defaultApp][globalParams.defaultCmd];
                //if (typeof (cmd) == "undefined") {
                //    return G_TemplateList[cApp][globalParams.defaultCmd];
                //}
                //else {
                //    return G_TemplateList[globalParams.defaultApp][cmd];
                //}
            }
            else {
                returnVal = G_TemplateList[cApp][cCmd];
            }
        }
        if (returnVal.isPanel) {
            globalParams.panel = returnVal.content;
            globalParams.module = returnVal.app;
        }
        this.appAndCmdTemp.push({ panel: globalParams.panel, app: returnVal.app, cmd: returnVal.cmd });
        return returnVal;
    };

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
        if (ops.length == 0) { ops = { "app": G_Template_Params.app, "cmd": G_Template_Params.cmd } };
        return ops;
    }

    module.exports.init = init = function () {
        $("[template=true][load=true]").each(function () {
            load(getDomAppAndCmd(this));
        });

        $("[template=true][click=true]").live("click", function () {
            load(getDomAppAndCmd(this));
        });
    }

    //加载模板
    //isNoShowLoading不展现加载动画
    module.exports.load = load = function (ops, isExtendBySelf, deep, isExtendPrevLoadParams, extendOnLoadEvent, isNoShowLoading) {
        if (!arguments[1]) isExtendBySelf = true;
        if (!arguments[2]) deep = false;
        if (!arguments[3]) isExtendPrevLoadParams = false;
        if (!arguments[4] && $.isFunction(arguments[4]) == false) extendOnLoadEvent = function () { };
        var o = new Template();
        o.load(ops, isExtendBySelf, deep, isExtendPrevLoadParams, extendOnLoadEvent);
        return;
    }

    //刷新最后加载的template路由
    module.exports.reload = reload = function (container) {
        var $container = null;
        if (typeof (container) != "undefined" && container.length > 0)
            $container = $("#" + container);
        if ($container == null || $container.length == 0) {
            load(globalParams.options, true);
        }
        else {
            var prevOptions = $container.data("prevOptions");
            if (typeof (prevOptions) == "undefined" || prevOptions.length == 0)
                load(globalParams.options, true);
            else
                load(prevOptions.pop());
        }
    }


    //加载进入新版各功能主页
    var EnterMain = function (appEntranceRouteOrFun) {
        if ($.isPlainObject(appEntranceRouteOrFun)) {
            load({
                app: "communicate",
                cmd: "init"
            }, true, true, false, function () { load(appEntranceRouteOrFun); });
        }
        else if ($.isFunction(appEntranceRouteOrFun)) {
            load({
                app: "communicate",
                cmd: "init"
            }, true, true, false, function () { appEntranceRouteOrFun(); });
        }
        else {
            alert("跳转出错");
        }
    };

    var CheckRoute = function (app, isAlert) {
        if (typeof (G_TemplateList[app]) != "undefined") {
            if (typeof (isAlert) == "undefined" || isAlert) {
                alert("Route" + app + "exist!");
            }
            return true;
        }
        return false;

    };

    var PrevRoute = function (contextId) {
        var prevList = $("#" + contextId).data("prevOptions");
        if (CheckIsExistPrevRoute(contextId)) {
            if (CheckIsExistNextRoute(contextId)) {
                var nextList = $("#" + contextId).data("nextOptions");
                var c = prevList.pop();
                c = prevList.pop();
                nextList.unshift(c);
                load(c);
            }
            else {
                $("#" + contextId).data("nextOptions", []);
                var nextList = $("#" + contextId).data("nextOptions");
                var c = prevList.pop();
                nextList.unshift(c);
                c = prevList.pop();
                nextList.unshift(c);
                load(c);
            }
        }
    };

    var NextRoute = function (contextId) {
        if (CheckIsExistNextRoute(contextId)) {
            var nextList = $("#" + contextId).data("nextOptions");
            var c = nextList.shift();
            load(nextList[0]);
        }
    };

    var CheckIsExistPrevRoute = function (contextId) {
        var prevList = $("#" + contextId).data("prevOptions");
        if (typeof (prevList) == "undefined" || prevList.length <= 1) {
            return false;
        }
        return true;
    };

    var CheckIsExistNextRoute = function (contextId) {
        var nextList = $("#" + contextId).data("nextOptions");
        if (typeof (nextList) == "undefined" || nextList.length <= 1) {
            return false;
        }
        var prevList = $("#" + contextId).data("prevOptions");
        return Nenglong.System.ObjectEqual(prevList[prevList.length - 1], nextList[0]);
    };

    var ajax={};

    module.exports.ajax=ajax;

    ajax.post = function(url, ops, successCallback, errorCallback, async, isStandardFormat) {
        ajax.ajax(url, ops, successCallback, errorCallback, "post", async, isStandardFormat);
    };

    ajax.get = function(url, ops, successCallback, errorCallback, async, isStandardFormat) {
        ajax.ajax(url, ops, successCallback, errorCallback, "get", async, isStandardFormat);
    };


    /*返回类型固定格式：
    {
        result: 获取数据结果，true表示成功，false表示出错；没有此值，也表示错误，也会调用errorCallback
        Data: 数据，成功时返回数据json对象，失败时返回错误信息
    }*/
    ajax.ajax = function(url, ops, successCallback, errorCallback, ajaxType, async, isStandardFormat) {
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

});