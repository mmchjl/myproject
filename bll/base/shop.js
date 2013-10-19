var struct = {
    _id: "objectId",
    userId_str: "string",
    name_str: "string",
    descritpion_str: "string",
    tags: "array",
    createTime_date: "datetime",
    managerId_str: "string"
};

var base = require("../bllBase"),
    user = require("./user");

var app = new base(),
    db = app.db,
    error = utility.handleException;

var COLLECTION = "shop_data";

app.handlers = {
   registShop:function(param,cb){
       var newObject = {
           collection:COLLECTION,
           newObject:param
       };
       db.insert(newObject,function(err,data){
           if(err){
               error(err);
               return cb(false);
           }
           cb(true);
       });
       cb(true);
   },
   getShops:function(param,cb){
       var pageIndex = param.pageIndex||1,
           pageSize=param.pageSize|| 4,
           query=param.query||{};
       var opt={
           collection:COLLECTION,
           query:query,
           pageIndex:pageIndex,
           pageSize:pageSize
       };
       db.query(opt,function(err,data){
           if(err){
               error(err);
           }
           return cb(data);
       })
   }
};

module.exports = app.handlers;