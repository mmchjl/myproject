/*
index.controler
*/
define(function (require, exports, module) {
    var template = require("dinit"),
	load = template.load,
	reload = template.reload;
    ajax = template.ajax;
    window.BMap_loadScriptTime = (new Date).getTime();
    errorArr = [];
    window.map=null;
    require.async("http://api.map.baidu.com/getscript?v=2.0&ak=FF15603e1554d04799839a1df321cf75&services=&t=20130906084028");
    //require.async("http://api.map.baidu.com/getscript?v=1.4&ak=&services=&t=20130906090653");
    var init = {
        init: function (param, data) {
            $(".dropdown-toggle").dropdown();
            $("#dLabel").unbind("click").bind("click", function () {
                var p = {
                    app: "index",
                    cmd: "location"
                };
                load(p);
            });
            $("#i_i_home_btn").unbind("click").bind("click", function () {
                var o = {
                    app: "index",
                    cmd:"home"
                };
                load(o);
            });
            registerInit();
            loginInit();
            $("#registshop").unbind("click").bind("click", function () {
                var o = {
                    app: "shop",
                    cmd:"register"
                };
                load(o)
            });

            $("#myshop").unbind("click").bind("click", function () {
                var o = {
                    app: "shop",
                    cmd:"myshop"
                };
                load(o)
            });

        }
    };

    var home = {
        init: function (param, data) {
            /*$("div.pagination li").unbind("click").bind("click",function(){
                var $self = $(this);
                $("div.pagination li").removeClass("active");
                $self.addClass("active");
                var index = $("a",$self).text();
                if(isNaN(index))return;
                var o={
                    app:"shop",
                    cmd:"shoplist",
                    params:{
                        pageindex:index
                    }
                };
                load(o);
            });*/
            loadPage("i_h_shoplist_page",17);
        }
    };

    var location = {
        init: function (param, data) {
            $("#i_l_edict").appendTo("body");
            var bsErr = ["自定义地名不能为空", "请勿输入过长地址", "请填写规范信息", "您填写的出生地信息含有不合适内容，请检查"];
            var site1 = new site([G("bs0"), G("bs1"), G("bs2")], [G("bsSpan0"), G("bsSpan1"), G("bsSpan2")], G("txt_bs"), G("birth_site"), arrCity, bsErr, G("bsErr"));
            $("#i_l_getaddresss_btn").unbind("click").bind("click", function () {
                getAddress(map);
            });
            $("#i_l_edict").on("shown", mapOnShown);
            $("#i_l_edict").on("hide", mapOnHiden);
            $(".addaddress").unbind("click").bind("click", function () {
                $("#i_l_address_div").removeClass("active");
                $("#i_l_area_div").addClass("active");
                $(this).addClass("btn-primary");
                $(".myaddress").removeClass("btn-primary");
            });

            $(".myaddress").unbind("click").bind("click", function () {
                $("#i_l_address_div").addClass("active");
                $("#i_l_area_div").removeClass("active");
                $(this).addClass("btn-primary");
                $(".addaddress").removeClass("btn-primary");
            });

            $("#i_l_ensure_btn").unbind("click").bind("click", function () {
                var address = $("#i_l_ensureaddress_text").val().Trim();
                if (address) {
                    var point = map.getOverlays()[0];
                    var position = point.getPosition();
                    var o = {
                        address_str: address,
                        lng: position.lng,
                        lat: position.lat
                    };
                    var url = "./location/addlocation";
                    ajax.get(url, { location: JSON.stringify(o) }, function (data) {
                        console.dir(data);
                        $('#i_l_edict').modal('hide')
                    });
                }
            });
        },
        preload: function (param) {
            //console.info("i_l_edict remove.");
            $("#i_l_map_div").removeClass("i_l_uniq").appendTo("body");
            $("#i_l_edict").remove();
        }
    };

    var locationlist = {
        init: function (param, data) {
            $(".i_l_select").unbind("click").bind("click", function () {
                var lid = $(this).parent().parent().attr("tid");
                var url = "./location/updateselect";
                ajax.get(url, { lid: lid }, function (data) {
                    reload();
                });
            });
            $(".i_l_delete_btn").unbind("click").bind("click", function () {
                var lid = $(this).parent().parent().attr("tid");
                var url = "./location/removelocation";
                ajax.get(url, { lid: lid }, function (data) {
                    reload();
                });
            });
        }
    };

    function loadPage(target,records,index,size,param){
        //debugger;
        var $content = $("#"+target);
        $content.find("ul").remove();
        param = param||{};
        if(!index) index=1;
        if(!size) size=4;
        var pageSize = parseInt($content.attr("pagesize"))||size;
        var pageIndex = parseInt($content.attr("pageindex"))||index;
        var groutSize = parseInt($content.attr("groupsize"))||10;
        var app = $content.attr("app")||"shop";
        var cmd = $content.attr("cmd")||"shoplist";
        var pageCount = Math.ceil(records/pageSize);
        var ul = $("<ul></ul>");    //   <li class="active"><a href="javascript:;">1</a></li>
        var flag = true;
        var flag1 = true;
        var start = Math.ceil(groutSize/2);
        var end = groutSize-start;
        if(index>start){
            appendHeader(ul);
        }
        for(var i = 1;i<=groutSize;i++){
           // if(pageCount>groutSize){
                var cur = i;
                if((index>start)){
                    if(flag){
                        flag=false;
                    }
                    cur = index-start+i;
                }
                if(index+end>pageCount){
                    cur=pageCount-groutSize+i;
                }
                if(pageCount<groutSize){
                    cur=i;
                    if(cur>pageCount) break;
                }
                if(cur==index){
                    appentli(cur,ul,true)
                }else{
                    appentli(cur,ul)
                }
            //}

        }
        appendTailer(ul);
        $content.append(ul);
        function appendHeader(dom){
            var head=$("<li><a href='javascript:;'>首页</a></li>");
            head.unbind("click").bind("click",function(){
                loadPage(target,records,1);
            });
            var head2 = $("<li><a href='javascript:;'>...</a></li>");
            dom.append(head);
            dom.append(head2);
        }
        function appentli(_index,dom,selected){
            var li = $("<li class=''><a href='javascript:;'>"+_index+"</a></li>");
            //debugger;
            if(selected){
                li.addClass("active")
            }
            li.unbind("click").bind("click",function(){
                loadPage(target,records,_index)
                param.pageindex=_index;
                var o={
                    app:app,
                    cmd:cmd,
                    params:param
                };
                load(o);
            });
            dom.append(li)
        }
        function appendTailer(dom){
            if((pageCount>groutSize)&&(index+end<pageCount)){
            var tail1 =$("<li><a href='javascript:;'>...</a></li>");
            var tail = $("<li><a href='javascript:;'>末页</a></li>");
            tail.unbind("click").bind("click",function(){
                loadPage(target,records,pageCount)
            });
            dom.append(tail1);
            dom.append(tail);
            console.log("当前页"+index+"  总页数:"+pageCount+" cur:"+end);
            }
        }
    }

    function mapOnShown() {
        try {
            var opt = {
                app: "index",
                cmd: "locationlist"
            };
            load(opt);
            if (!map) {
                map = new BMap.Map("i_l_map_div");
                var point = new BMap.Point(116.404, 39.915);
                map.centerAndZoom(point, 15);
                //map.centerAndZoom("北京市");
                //map.addEventListener("dblclick", function (e) {
                //    alert(e.point.lng + "," + e.point.lat);
                //});
                map.enableScrollWheelZoom();
                map.enableDragging();
                map.disableDoubleClickZoom();
                addMenu(map);
            } else {
                //debugger;
                $("#i_l_area_div div.i_l_uniq").remove();
                $("#i_l_map_div").appendTo($("#i_l_area_div"));
                $("#i_l_map_div").show();
            }
        } catch (e) {
            errorArr.push(e);
            console.dir(e);
        }
    }

    function mapOnHiden() {
        $("#i_l_map_div").hide();
    }

    function addMenu(map) {
        var menuItem = new BMap.MenuItem("设为我的定位", selectPoint);
        var context = new BMap.ContextMenu();
        context.addItem(menuItem);
        map.addContextMenu(context);
    }

    function selectPoint(point) {
        //this.clearOverlays();
        var overlays = map.getOverlays();
        overlays.Each(function (obj) { map.removeOverlay(obj); });
        var marker = new BMap.Marker(point);
        console.dir(overlays);
        marker.draw();
        map.addOverlay(marker);
        $(".i_l_detailaddress_form").show();
        $(".i_l_detailaddress_form input:text").focus();
    }

    function getAddress(map) {
        var reg = /[请选择|无]/g;
        var result = "";
        //debugger;
        result += reg.test(G("bs0").value) ? "" : G("bs0").value;
        result += reg.test(G("bs1").value) ? "" : G("bs1").value;
        result += reg.test(G("bs2").value) ? "" : G("bs2").value;
        //console.info(result);

        var area = $("#i_l_address_text").val();
        var city = result;
        area = area == "" ? "政府" : area;
        var url = "http://api.map.baidu.com/geocoder/v2/?output=json&ak=FF15603e1554d04799839a1df321cf75&city=" + city + "&address=" + area;
        var option = {
            type: "get",
            url: url,
            dataType: "jsonp",
            jsonpCallback: "back",
            success: function (data) {
                if (data.status == 0 && data.result.location) {
                    var x = data.result.location.lat;
                    var y = data.result.location.lng;
                    map.centerAndZoom(new BMap.Point(y, x), 15);
                }
            },
            error: function (err) {
                console.err(err);
            }
        };
        $.ajax(option);

        //http://api.map.baidu.com/geocoder/v2/?ak=FF15603e1554d04799839a1df321cf75&callback=FF15603e1554d04799839a1df321cf75&location=22.673130980898,113.35642604738&output=json&pois=0    
    }

    function registerInit() {
        debugger;
        $("#i_r_modal").on("hidden", function () {
            clear($(".i_r_div"));
        })
        $("#i_r_modal_pwd2").addClass("uneditable-input");
        $("#i_r_modal_uid").unbind("blur").bind("blur", function () {
            var self = $(this);
            var account = self.val();
            //debugger;
            if (account && account.length >= 6) {
                var url = "./user/checkaccount";
                var pa = { account: account };
                ajax.get(url, pa, function (data) {
                    if (data.isExists) {
                        error(self, "该用户名已存在");
                    } else {
                        success(self);
                    }
                })
            }
        });
        $("#i_r_modal_email").unbind("blur").bind("blur", function () {
            var self = $(this);
            var email = self.val();
            //debugger;
            if (email && email.length >= 6) {
                var url = "./user/checkemail";
                var pa = { email: email };
                ajax.get(url, pa, function (data) {
                    if (data.isExists) {
                        error(self, "该邮箱已注册");
                    } else {
                        success(self);
                    }
                })
            }
        });
        $("#i_r_modal_pwd1").unbind("blur").bind("blur", function () {
            var self = $(this);
            var pwd1 = self.val();
            if (pwd1.length > 0 && pwd1.length < 6) {
                error(self, "密码需要6位以上");
                return;
            }
            if (pwd1 && pwd1.length >= 6) {
                success(self);
                $("#i_r_modal_pwd2").removeClass("uneditable-input");
            }
        });
        $("#i_r_modal_pwd2").unbind("blur").bind("blur", function () {
            var self = $(this);
            var pwd2 = self.val();
            if (pwd2 == $("#i_r_modal_pwd1").val()) {
                success(self);
            } else {
                error(self, "两次密码不一致");
            }
        });
        $("#i_r_modal_btn").unbind("click").bind("click", function () {
            var len = $(".i_r_div.success").length;
            if (len == 4) {
                var account = $("#i_r_modal_uid").val();
                var password = $("#i_r_modal_pwd2").val();
                var email = $("#i_r_modal_email").val();
                var o = {
                    account: account,
                    password: password,
                    email: email,
                    type: 1
                },
                    url = "./user/register";
                ajax.post(url, o, function () {
                    console.info("完成注册");
                    $("#i_r_modal").modal("hide");
                });
            }
        });
        function clear(objs) {
            objs.each(function (i, _o) {
                var o = $(_o);
                o.removeClass("error").removeClass("success");
                $("input:text", o).val("");
                $("input:password", o).val("");
                $("span", o).remove();
            });
        }
        function success(obj) {
            obj.next().remove();
            obj.parent().parent().removeClass("error").addClass("success");
        }
        function error(obj, msg) {
            obj.next().remove();
            obj.parent().parent().removeClass("success").addClass("error");
            if (msg) {
                obj.after("<span class='help-inline'>" + msg + "</span>");
            }
        }
    }

    function loginInit() {
        var $account = $("#i_login_uid");
        var $password = $("#i_login_pwd");
        var $modal = $("#i_login_modal");
        var $loginbtn = $("#i_login_btn");
        $modal.on("hidden", function () {
            $("input", $modal).val("");
            rmerror();
        });
        $loginbtn.unbind("click").bind("click", function () {
            var account = $account.val();
            var password = $password.val();
            if (account && password) {
                var url = "./user/login",
                    p = {
                        account: account,
                        password: password
                    };
                ajax.get(url, p, function (result) {
                    switch (result.status) {
                        case 200:
                            $modal.modal("hide");
                            break;
                        case 403:
                        case 404:
                            error(result.status);
                            break;
                        default:
                            break;
                    }
                });
            }
        });
        $password.unbind("blur").bind("blur", function () {
            $password.parent().parent().removeClass("error");
            $password.next().remove();
        });
        $account.unbind("blur").bind("blur", function () {
            $account.parent().parent().removeClass("error");
            $account.next().remove();
        });
        function error(status) {
            rmerror();
            if (status == 404) {
                $account.parent().parent().addClass("error")
                $account.after("<span  class='help-inline'>不存在用户</span>");
            }
            if (status == 403) {
                $password.parent().parent().addClass("error")
                $password.after("<span  class='help-inline'>密码错误</span>");
            }
        }
        function rmerror() {
            $(".i_login_div", $modal).removeClass("error");
            $("span", $modal).remove();
        }
    }

    module.exports.init = init;
    module.exports.home = home;
    module.exports.location = location;
    module.exports.locationlist = locationlist;
})
