var is = require("istype"),types = require("../types");

module.exports = function(Model){
	Model.validators.push(function readonly(obj,keys){
		
		if(obj.hasError()) return;
		
		keys.forEach(function(key){
			if(Model.attrs[key].readonly){
				if(typeof obj.oattrs[key] !== "undefined"){
					obj.error(key,key + " 's readonly.");
				}
			}
		})
		
	})
}