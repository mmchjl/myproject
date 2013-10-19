/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-9-2
 * Time: 下午9:38
 * To change this template use File | Settings | File Templates.
 */

define(function(require,exports,module){
    var templatelist = require("dinit"),
        load = templatelist.load,
        reload = templatelist.reload,
        ajax = templatelist.ajax,
        flag=true;
    window.map1=null;
    var register = {
        init:function(param,data){
            stepBind();
            //mapOnShown();
        },
        unload:function(){
            window.map1=null;
            flag=true;
        }
    }

    function mapOnShown() {
        try {
            if (!map1) {
                map1 = new BMap.Map("s_r_mapdiv");
                var point = new BMap.Point(116.404, 39.915);
                map1.centerAndZoom(point, 15);
                //map.centerAndZoom("北京市");
                //map.addEventListener("dblclick", function (e) {
                //    alert(e.point.lng + "," + e.point.lat);
                //});
                map1.enableScrollWheelZoom();
                map1.enableDragging();
                map1.disableDoubleClickZoom();
                addMenu(map1);
            } else {
                //debugger;
               /* $("#i_l_area_div div.i_l_uniq").remove();
                $("#i_l_map_div").appendTo($("#i_l_area_div"));
                $("#i_l_map_div").show();*/
            }
        } catch (e) {
            errorArr.push(e);
            console.dir(e);
        }
    }

    function addMenu(map) {
        var menuItem = new BMap.MenuItem("设为我的定位", selectPoint);
        var context = new BMap.ContextMenu();
        context.addItem(menuItem);
        map.addContextMenu(context);
    }

    function selectPoint(point) {
        //this.clearOverlays();
        var overlays = map1.getOverlays();
        overlays.Each(function (obj) { map1.removeOverlay(obj); });
        var marker = new BMap.Marker(point);
        //console.dir(overlays);
        marker.draw();
        map1.addOverlay(marker);
        $(".s_r_detailaddress_form").show();
        $(".s_r_detailaddress_form input:text").focus();
        var point = marker.getPosition();
        $(".s_r_detailaddress_form input:text").data("point",point);
    }

    function stepBind(){
        $("#s_r_step1").show();
        $("#s_r_step1_next_btn").unbind("click").bind("click",function(){
            $("#s_r_step1").hide();
            $("#s_r_step2").show();
            if(flag){
                mapOnShown();
                flag=false;
            }
            $("#s_r_thumbnail1").removeClass("s_r_step");
            $("#s_r_thumbnail2").addClass("s_r_step");
            window.scrollTo(0,100)
        });
        $("#s_r_step2_prev_btn").unbind("click").bind("click",function(){
            $("#s_r_step2").hide();
            $("#s_r_step1").show();
            $("#s_r_thumbnail2").removeClass("s_r_step");
            $("#s_r_thumbnail1").addClass("s_r_step");
        });
        $("#s_r_step2_next_btn").unbind("click").bind("click",function(){
            $("#s_r_step2").hide();
            $("#s_r_step3").show();
            $("#s_r_thumbnail2").removeClass("s_r_step");
            $("#s_r_thumbnail3").addClass("s_r_step");
        });
        $("#s_r_step3_prev_btn").unbind("click").bind("click",function(){
            $("#s_r_step3").hide();
            $("#s_r_step2").show();
            $("#s_r_thumbnail3").removeClass("s_r_step");
            $("#s_r_thumbnail2").addClass("s_r_step");
            window.scrollTo(0,100)
        });
        $("#s_r_step3_next_btn").unbind("click").bind("click",function(){
            alert("finish")

            var name = $("#s_r_shopname_txt").val();
            var phone = $("#s_r_phone_txt").val();
            var tags = [];
            $("#s_r_tags_fields i").each(function(index,obj){
                var tag = $(obj).text();
                if(tag){
                    tags.push(tag);
                }
            });
            var $address = $(".s_r_detailaddress_form input:text");
            var point = $address.data("point");
            var address = $address.val();
            var o={
                name_str:name,
                phone_str:phone,
                tags:tags,
                address_str:address,
                location:{
                    lng:point.lng,
                    lat:point.lat
                }
            };
            console.dir(o);
            var url = "./shop/regist",
                data={data:JSON.stringify(o)}
            ajax.post(url,data,function(data){
                var t = {
                    app:"index",
                    cmd:"init"
                };
                load(t);
            });
        });
        $("#s_r_tag_btn").unbind("click").bind("click",function(){
            var tag = $("#s_r_tag_txt").val();
            var len = $("#s_r_tags_fields>i").length;
            if(tag&&len<2){
                var span = $("<i class='icon-tag'>"+tag+"</i>");
                $("#s_r_tags_fields").append(span);
            }
            $("#s_r_tag_txt").val("");
        });
    }

	module.exports.register=register;
})
