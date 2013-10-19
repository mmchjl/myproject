/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-22
 * Time: 下午9:22
 * To change this template use File | Settings | File Templates.
 */

var struct = {
    _id: "ObjectId",
    account_str: "str",
    password_str: "string",
    username_str: "string",
    email_str: "string",
    locations: [
        {
            locationId_str: "string",
            address_str: "string",
            position: { x: 0, y: 0 },
            phoneNum_str: "string",
            isSelect_bool: "bool"
        }
    ],
    type_int: "int",
    lastloginTime_date: "datetime",
    regesterTime_data: "datetime",
    firstVisteTime_data: "datetime",
    session_str: "",
    enabled_bool: "bool"
};


var query = {
    location_arr:
        {
            $elemMatch: {
                "position.x": {
                    $gt: 823.43,
                    $lt: 826.32
                },
                "position.y": {
                    $gt: 35.43,
                    $lt: 55.43
                }
            }
        }
};
//db.location.find(query).count();

//db.location.ensureIndex({ "location_arr.position.x": 1 })
//db.location.ensureIndex({ "location_arr.position.y": 1 })

var base = require("../bllBase.js");

var app = new base(),
    db = app.db;

var COLLECTION = "user_data";
var handleEx = utility.handleException;

app.handlers = {
    checkExists: function (param, cb) {
        if (!param) {
            return cb(true);
        }
        var account = param.account;
        var email = param.email;
        var opt = {
            collection: COLLECTION,
            query: {
                account_str: account
            }
        };
        if (email) opt.query = { email_str: email };
        db.findOne(opt, function (err, data) {
            if (err) {
                utility.handleException(err);
                return cb(true);
            }
            if (data) {
                return cb(true);
            }
            return cb(false);
        });
    },
    login: function (accout, password, cb) {
        if (!accout && !password) {
            return cb({ status: 500 });
        }
        var header = this;
        var opt = {
            collection: COLLECTION,
            query: {
                $or: [
                    { email_str: accout },
                    { account_str: accout }
                ]
            }
        };
        db.findOne(opt, function (err, data) {
            if (err) {
                utility.handleException(err);
                return cb({ status: 500 });
            }
            if (data) {
                //账号存在 utility
                var md5Pwd = utility.MD5(password);
                if (data.password_str == md5Pwd) {
                    header.setSession({
                        authorization: true,
                        userId: data._id,
                        userEmail: data.email_str,
                        userAccount: data.account_str,
                        userLocations: data.locations
                    });
                    var cid = header.cookie.cid;
                    if (cid!=data.session_str) login(cid);
                    return cb({ status: 200, cid: data.session_str });
                }
                return cb({ status: 403 });
            } else {
                //账号不存在
                cb({ status: 404 });
            }
        });
    },
    update: function (uid, newObject, cb) {
        var opt = {
            collection: COLLECTION,
            query: {
                _id: uid
            },
            newObject: newObject
        };
        db.update(opt, function (err, data) {
            if (err) {
                handleEx(err);
                return cb(false);
            }
            if (data) {
                return cb(true);
            }
            return cb(false);
        });
    },
    register: function (param, cb) {
        if (arguments.length == 1) {
            cb = param;
            param = undefined;
        }
        var uid = param.uid;
        if (param) {
            var newObject = {
                $set: {
                    account_str: param.account || "",
                    password_str: utility.MD5(param.password),
                    email_str: param.email || "",
                    type_int: param.type, //用于标识是注册用户还是未注册用户 0:未注册，1:注册的个人用户，2:注册的商铺用户
                    lastloginTime_date: (new Date()).getTime(),
                    registerTime_date: (new Date()).getTime()
                }
            };
            this.update(uid, newObject, cb);
        } else {
            registerQuick(cb);
        }
    },
    getUserByCid: function (cid, cb) {
        getUserByCid(cid, function (data) {
            if (data) {
                cb(data);
            } else {
                registerQuick(cid, cb);
            }
        });
    },
    getUserById: function (id, cb) {
        getUserById(id, cb);
    }
};

function getUserById(id, cb) {
    var opt = {
        collection: COLLECTION,
        query: {
            _id: id
        }
    };
    db.findOne(opt, function (err, data) {
        if (data) {
            return cb(data);
        }
        return cb(null);
    });
}

function getUserByCid(cid, cb) {
    var opt = {
        collection: COLLECTION,
        query: {
            session_str: cid
        }
    };
    db.findOne(opt, function (err, data) {
        if (data) {
            return cb(data);
        }
        return cb(null);
    });
}

//快速注册
function registerQuick(cid, cb) {
    var newObject = {
        account_str: "",
        password_str: "",
        username_str: "",
        email_str: "",
        locations: [],
        type_int: 0, //用于标识是注册用户还是未注册用户 0:未注册，1:注册的个人用户，2:注册的商铺用户
        lastloginTime_date: 0,
        registerTime_date: 0,
        firstVisteTime_date: (new Date()).getTime(),
        session_str: cid,
        enabled_bool: true
    };

    var opt = {
        collection: COLLECTION,
        newObject: newObject
    };
    db.insert(opt, function (err, data) {
        if (err) {
            utility.handleException(err);
            return cb(null);
        } else {
            return cb(data);
        }
    });
}

function login(cid) {
    var opt = {
        collection: COLLECTION,
        query: {
            session_str: cid
        }
    };
    db.findOne(opt, function (err, data) {
        if (data) {
            if (data.type_int == 0) {
                db.remove(opt);
            }
        }
    })
}

module.exports = app.handlers;
