define(function (require, exports, module) {
    var template = require("dinit"),
        app = require("controler/index");
    load = template.load,
    reload = template.reload,
    templateList = template.templateList;
    templateList.index = {
        init: {
            app: "index",
            cmd: "init",
            content: "body",
            data: {},
            dataUrl: "",
            templateUrl: "./template/index.htm",
            onload: function (param, data) {
                app.init.init(param, data);
            }
        },
        home: {
            app: "index",
            cmd: "home",
            content: "mainDiv",
            data: {},
            templateUrl: "./template/home.htm",
            onload: function (param, data) {
                app.home.init(param, data);
            }
        },
        location: {
            app: "index",
            cmd: "location",
            content: "i_l_list",
            /*data: {
                list: [
                    { name_str: "中山四路能龙大楼4层403", _id: "123nj2hj12bdhrks0", isSelect: true },
                    { name_str: "官渡四路油校大院4A218", _id: "123nj2hj12bdhrks1", isSelect: false },
                    { name_str: "棠下科韵路，**办公室", _id: "123nj2hsj12bdhrks1", isSelect: false },
                    { name_str: "华南农业大学第四教学楼502", _id: "123fnj2hj12bdhrks1", isSelect: false }
                ]
            },*/
            dataUrl: "./location/getlocationlist",
            templateUrl: "./template/location.htm",
            onload: function (param, data) {
                app.location.init(param, data);
            },
            preload: function (param) {
                app.location.preload(param);
            }
        },
        locationlist:{
            app:"index",
            cmd:"locationlist",
            content:"i_ll_table",
            /*data:{
                list: [
                    { name_str: "中山四路能龙大楼4层403", _id: "123nj2hj12bdhrks0", isSelect: true },
                    { name_str: "官渡四路油校大院4A218", _id: "123nj2hj12bdhrks1", isSelect: false },
                    { name_str: "棠下科韵路，**办公室", _id: "123nj2hsj12bdhrks1", isSelect: false },
                    { name_str: "华南农业大学第四教学楼502", _id: "123fnj2hj12bdhrks1", isSelect: false }
                ]
            },*/
            dataUrl:"./location/getlocationlist",
            templateUrl:"./template/locationlist.htm",
            onload:function(param,data){
                app.locationlist.init(param,data);
            }
        }
    }


});