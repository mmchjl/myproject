/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-9-2
 * Time: 下午8:56
 * To change this template use File | Settings | File Templates.
 */

var handleBase = require("../../lib/handleAppBase.js").handleBase,
    user = require("../../bll/base/user.js");

function handle(header, response) {
    app.handle(header, response)
}

var _handler = {
    getuserinfo: function (header, response) {
        var cid = header.cookie.cid;
        var time = (new Date()).getTime() + 1000 * 3600 * 24 * 1000;
        if (!header.cookie.cid) {
            cid = utility.Guid("n");
            response.setCookie({
                name: "cid",
                value: cid,
                expires: new Date(time)
            })
        }
        user.getUserByCid(cid, function (data) {
            if (data) {
                return response.endJson(data);
            }
            response.endJson({ result: false, states: 500 })
        })

    },
    register: function (header, response) {
        var uid = header.user._id;
        var param = {
            uid: uid,
            account: header.get("account", ""),
            password: header.get("password", ""),
            email: header.get("email", ""),
            type: parseInt(header.get("type", 1))
        };
        console.dir(header.user);
        user.register(param, function (result) {
            if (result) return response.endJson({ result: true })
            return response.endJson({ result: false, code: 500 })
        });
    },
    login: function (header, response) {
        var account = header.get("account", ""),
            password = header.get("password", "");
        user.login.bind(header)(account, password, function (result) {
            var cid = result.cid;
            if (cid) {
                var time = (new Date()).getTime() + 1000 * 3600 * 24 * 1000;
                response.setCookie({
                    name: "cid",
                    value: cid,
                    expires: new Date(time)
                });
            }
            delete result.cid;
            response.endJson({
                result: true, data: result
            });
        });
    },
    checkaccount: function (header, response) {
        var account = header.get("account");
        var param = { account: account };
        user.checkExists(param, function (result) {
            response.endJson({
                result: true,
                data: { isExists: result }
            });
        });
    },
    checkemail: function (header, response) {
        var email = header.get("email");
        var param = { email: email };
        user.checkExists(param, function (result) {
            response.endJson({
                result: true,
                data: { isExists: result }
            });
        });
    },
    loginout: function (header, response) {
        response.removeCookie("cid");
        response.endJson({ result: true });
    }
};

var app = new handleBase(_handler)
app.isAuthorization = true;

module.exports.handle = handle;

module.exports.explain = _handler;