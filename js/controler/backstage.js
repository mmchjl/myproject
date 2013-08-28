/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-24
 * Time: 下午6:03
 * To change this template use File | Settings | File Templates.
 */

define(function(require,exports,module){
    var template = require("dinit");
    var ajax=template.ajax;

    var permissionInit = function(params,data){
        $("#p_edict").on('hidden',function(){
            $("#p_code").val("");
            $("#p_discr").val("");
        })
        $(".p_d_update").unbind("click").bind("click",function(){
            var id = $(this).parent().parent().attr("tid");
            ajax.getData("./temporary/get",{id:id},function(data){
                $("#p_edict").modal('show');
                var moduelAndHeader = data.parent_str+"."+data.name_str;
                $("#permissionedict_heade").text(moduelAndHeader);
                $("#p_code").val(data.code_str);
                $("#p_discr").val(data.description_str);
                $("#p_edict .p_d_addtime").text((new Date(data.addTime_date).format("yyyy-MM-dd hh:mm")));
            });
            $("#permissionedict_submit").unbind("click").bind("click",function(){
                var code_str =  $("#p_code").val();
                var description_str =  $("#p_discr").val();
                ajax.postData("./temporary/update",{id:id,code_str:code_str,description_str:description_str},function(){
                    $("#p_edict").modal('hide');
                    template.reload();
                });
            });
        });

    }
    var backstageInit=function(param,data){
        $(".permissionDefine").die("click").live("click",function(){
            $("#myTab1").siblings("ul").hide();
            $("#myTab1").show();
            $('#myTab1 a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            })
            template.load({
                app:"backstage",
                cmd:"permission"
            })
            //NengLongTemplateLoad()
        });
        $(".menuDefine").die("click").live("click",function(){
            $("#myTab2").siblings("ul").hide();
            $("#myTab2").show();
            $('#myTab2 a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            })
        });
        $(".shopDefine").die("click").live("click",function(){
            $("#myTab3").siblings("ul").hide();
            $("#myTab3").show();
            $('#myTab3 a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            })
        });
    }
    module.exports.init = {
        init:backstageInit
    }
    module.exports.permission = {
        init:permissionInit
    };
})