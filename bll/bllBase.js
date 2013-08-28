/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-8-21
 * Time: 下午9:09
 * To change this template use File | Settings | File Templates.
 */

var mongo = require("../lib/mongoClient.js");

var bll = function(){
    this.handlers={};
}


bll.prototype.db = mongo;

module.exports = bll;