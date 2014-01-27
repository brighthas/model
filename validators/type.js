var is = require("istype"),types = require("../types");

module.exports = function(Model){

	
	// type validator
	Model.validators.push(function type(obj,keys){
		
		if(obj.hasError()) return;
		
		keys.forEach(function(key){
			var value = obj.attrs[key];
			if(value){
				
				
				var type = Model.attrs[key].type;
				if(typeof type === "function"){
					if(value instanceof type){}
					else{
						obj.error(key,key + " 's type error.");
					}
				}else if(types.indexOf(type) !==-1){
					
					var hasError = false;
					switch(type){
					case "string":
						if(!is.string(value)){
							hasError = true;
						}
						break;
					case "array":
						if(!is.array(value)){
							hasError = true;
						}else{
							obj.attrs[key] == JSON.parse(JSON.stringify(value));
						}
						break;
					case "number":
						if(!is.number(value)){
							hasError = true;
						}
						break;
					case "regexp":
						if(!is.regexp(value)){
							hasError = true;
						}
						break
					case "data":
						if(!is.date(value)){
							hasError = true;
						}
						break;
						
					case "json":
						
						try{
							obj.attrs[key] == JSON.parse(JSON.stringify(value));
						}catch(e){
							hasError = true;
						}
						
						break;
						
					}
					
					if(hasError){
						obj.error(key,key + " 's type error.");
					}
					
				}
			}
		})
	});

	
}