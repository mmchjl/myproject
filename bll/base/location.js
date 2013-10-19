var struct = {
    _id: "objectId",
    cookie_str: "string",
    userId_str: "string",
    address_str: "string",
    position: { x: 0, y: 0 },
    phoneNum_str: "string",
    type_int: "int",
    isSelect_bool: "bool"
};

var base = require("../bllBase"),
    user = require("./user");

var app = new base(),
    db = app.db;

var COLLECTION = "user_data";
var PROC_UPDATESELECT = "Proc_Location_UpdateSelect";

app.handlers = {
    getLocationListByUserId: function (uid, cb) {
        user.getUserById(uid, function (data) {
            if(data&&data.locations) return cb(data.locations);
            return cb([]);
        });
    },
    insert: function (uid,location, cb) {
        user.getUserById(uid, function (_user) {
            if (_user && location) {
                if(!_user.locations) _user.locations=[];
                _user.locations.forEach(function (obj) { obj.isSelect_bool = false });
                _user.locations.push(location);
                var newObject = {
                    $set: {
                        locations: _user.locations
                    }
                };
                return user.update(uid, newObject, cb);
            }
            return cb(false);
        });
    },
    removeById: function (uid, locationid, cb) {
        user.getUserById(uid, function (_user) {
            if (_user && _user.locations) {
                var removeLocation = _user.locations.Find(function (obj) {return obj.locationId_str == locationid });
                var locations = _user.locations.FindAll(function (obj) {return obj.locationId_str != locationid });
                if (removeLocation.isSelect_bool && locations.length >= 1) {
                    locations[0].isSelect_bool = true;
                }
                var newObject = {
                    $set: {
                        locations: locations
                    }
                };
                return user.update(uid, newObject, cb);
            }
            return cb(false);
        });
    },
    updateSelect: function (uid, locationid, cb) {
        user.getUserById(uid, function (_user) {
            if (_user && _user.locations) {
                _user.locations.forEach(function (obj) { obj.isSelect_bool = false });
                var updateLocation = _user.locations.Find(function (obj) {return obj.locationId_str == locationid });
                if (updateLocation) {
                    updateLocation.isSelect_bool = true;
                } else if (_user.locations.length > 0) {
                    _user.locations[0].isSelect_bool = true;
                } else {
                    return cb(false);
                }
                var newObject = {
                    $set: {
                        locations: _user.locations
                    }
                };
                return user.update(uid, newObject, cb);
            }
            return cb(false);
        });
    }
};

var updateSelect = function (param) {
    var uid = param.uid,
        lid = ObjectId(param.id);
    var query = {
        userId_str: uid
    };
    var newObject = {
        $set: {
            isSelect_bool: false
        }
    }
    db.location_data.update(query, newObject, false, true);
    var query = {
        _id: lid
    };
    newObject = {
        $set: {
            isSelect_bool: true
        }
    };
    db.location_data.update(query, newObject);
}

module.exports = app.handlers;

/*
Pattern
Consider the following example that maps publisher and book relationships. The example illustrates the advantage of referencing over embedding to avoid repetition of the publisher information.

Embedding the publisher document inside the book document would lead to repetition of the publisher data, as the following documents show:

{
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English",
    publisher: {
        name: "O'Reilly Media",
        founded: 1980,
        location: "CA"
    }
}

{
    title: "50 Tips and Tricks for MongoDB Developer",
    author: "Kristina Chodorow",
    published_date: ISODate("2011-05-06"),
    pages: 68,
    language: "English",
    publisher: {
        name: "O'Reilly Media",
        founded: 1980,
        location: "CA"
    }
}*/
//To avoid repetition of the publisher data, use references and keep the publisher information in a separate collection from the book collection.

//When using references, the growth of the relationships determine where to store the reference. If the number of books per publisher is small with limited growth, storing the book reference inside the publisher document may sometimes be useful. Otherwise, if the number of books per publisher is unbounded, this data model would lead to mutable, growing arrays, as in the following example:
/*
{
    name: "O'Reilly Media",
    founded: 1980,
    location: "CA",
    books: [12346789, 234567890, ...]
}

{
    _id: 123456789,
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English"
}

{
    _id: 234567890,
    title: "50 Tips and Tricks for MongoDB Developer",
    author: "Kristina Chodorow",
    published_date: ISODate("2011-05-06"),
    pages: 68,
    language: "English"
}
//To avoid mutable, growing arrays, store the publisher reference inside the book document:

{
    _id: "oreilly",
    name: "O'Reilly Media",
    founded: 1980,
    location: "CA"
}

{
    _id: 123456789,
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English",
    publisher_id: "oreilly"
}

{
    _id: 234567890,
    title: "50 Tips and Tricks for MongoDB Developer",
    author: "Kristina Chodorow",
    published_date: ISODate("2011-05-06"),
    pages: 68,
    language: "English",
    publisher_id: "oreilly"
}*/