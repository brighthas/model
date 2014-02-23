var is = require("istype"),types = require("../types");

module.exports = function(Model){

	// required validator
	Model.validators.push(function required(obj,keys){
		
		if(obj.hasError()) return;
		
		keys.forEach(function(key){
			if(Model.attrs[key].required){
				var value = obj.attrs[key];
				var type = is.type(value);
				if(type === "null" || type === "undefined"){
					obj.result.error(key,key + " 's value is unrequired.");
				}
			}
		})
		
	})
	
}