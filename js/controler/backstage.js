/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-24
 * Time: 下午6:03
 * To change this template use File | Settings | File Templates.
 */

define(function(require,exports,module){
    var template = require("dinit");
    var load = template.load;
    var ajax=template.ajax;
    var glist = template.templateList;

    var permissionInit = function(params,data){
        $("#p_edict").on('hidden',function(){
            $("#p_code").val("");
            $("#p_discr").val("");
        })
        console.dir(params);
        debugger;
        if(params.params.selecthandler){
            $("#"+params.params.selecthandler).addClass("in")
        }
        $(".p_d_update").unbind("click").bind("click",function(){
            var id = $(this).parent().parent().attr("tid");
            var handler = $("#permissondefined .in").attr("id");
            ajax.get("./permission/get",{id:id},function(data){
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
                ajax.post("./permission/update",{id:id,code_str:code_str,description_str:description_str},function(){
                    $("#p_edict").modal('hide');
                    load({
                        app:"backstage",
                        cmd:"powermanage_entry",
                        params:{
                            "selecthandler":handler
                        }
                    });
                });
            });
        });

    }
    var backstageInit=function(param,data){
        $(".firstmenu").unbind("click").bind("click",function(){
            var fm = $(this).attr("app");
            if(fm){
                load({
                    app:"backstage",
                    cmd:"tag",
                    params:{
                        fm:fm
                    }
                });
            }
        })
    }

    var taginit = function(param,data){
        $('#tagPanel a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        })
        $("#tagPanel li").unbind("click").bind("click",function(){
            var cmd = $(this).attr("app");
            console.log(cmd);
            load({
                app:"backstage",
                cmd:cmd
            });
        })
        var a=$("#tagPanel li:eq(0)").attr("app");
        if(glist.backstage[a]){
            load({
                app:"backstage",
                cmd:a
            });
        }
    }
   var permissiondifineInit=function(param,data){
       $("#p_d_modal").on("hidden",function(){
           $("#p_d_code").val("");
           $("#p_d_discr").val("");
       })
       $(".btn_permission_define_update").unbind("click").bind("click",function(){
           var id = $(this).parent().parent().attr("tid");
           ajax.get("./permission/get",{id:id},function(data){
               $("#p_d_modal").modal('show');
               var moduelAndHeader = data.name_str;
               $("#p_d_header").text(moduelAndHeader);
               $("#p_d_code").val(data.code_str);
               $("#p_d_discr").val(data.description_str);
           });
           $("#p_d_submit").unbind("click").bind("click",function(){
               var code_str =  $("#p_d_code").val();
               var description_str =  $("#p_d_discr").val();
               ajax.post("./permission/update",{id:id,code_str:code_str,description_str:description_str},function(){
                   $("#p_d_modal").modal('hide');
                   template.reload();
               });
           });
       })
   }

    module.exports.init = {
        init:backstageInit
    }
    module.exports.permission = {
        init:permissionInit
    };
    module.exports.tag={
        init:taginit
    }
    module.exports.permissiondefine={
        init:permissiondifineInit
    }
})