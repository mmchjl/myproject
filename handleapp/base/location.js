/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-9-7
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

var handleBase = require("../../lib/handleAppBase.js").handleBase,
    location = require("../../bll/base/location.js");

var _handler = {
    getlocationlist: function (header, response) {
        header.getUser(function (data) {
            location.getLocationListByUserId(data._id, function (list) {
                response.endJson({ list: list });
            });
        });
    },
    addlocation: function (header, response) {
        header.getUser(function (data) {
            var newlocation = header.get("location");
            newlocation = JSON.parse(newlocation);
            var lng = parseFloat(newlocation.lng);
            var lat = parseFloat(newlocation.lat);
            var o = {
                locationId_str: utility.Guid(),
                address_str: newlocation.address_str,
                position: { lng: lng, lat: lat },
                phoneNum_str: "",
                isSelect_bool: true
            };
            location.insert(data._id, o, function (result) {
                if (result) {
                    return response.endJson({ result: true, status: 200 });
                } else {
                    return response.endJson({ rseult: false, status: 500 });
                }
            });
        });
    },
    removelocation: function (header, response) {
        var lid = header.get("lid", 0);
        header.getUser(function(data){
            location.removeById(data._id,lid, function (result) {
                var opt = {
                    result: result
                };
                return response.endJson(opt);
            })
        })
    },
    updateselect: function (header, response) {
        var lid = header.get("lid", 0);
        header.getUser(function (user) {
            var uid = user._id;
            return location.updateSelect(uid, lid, function (result) {
                var opt = {
                    result: result
                };
                return response.endJson(opt);
            })
        });
    }
};

function handle(header, response) {
    app.handle(header, response)
}

var app = new handleBase(_handler);
app.isAuthorization = false;

module.exports.handle = handle;

module.exports.explain = _handler;