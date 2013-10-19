/**
 * Created with JetBrains WebStorm.
 * User: LE
 * Date: 13-9-2
 * Time: 下午9:38
 * To change this template use File | Settings | File Templates.
 */

define(function(require,exports,module){
    var init = {
        init:function(param,data){
            console.log("introduction finish");
			console.log(data);
        }
    }
	module.exports.init=init;
})
