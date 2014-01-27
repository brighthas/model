var is = require("istype"),types = require("../types");

module.exports = function(Model){

	
	// length validator
	Model.validators.push(function type(obj,keys){
		
		
		if(obj.hasError()) return;
				
		keys.forEach(function(key){
			
			var option = Model.attrs[key];
			var type = option.type;
			
			var value = obj.attrs[key];
			if(value){

			if(types.indexOf(type) !==-1){
					var hasError = false;
					var len = option.len;
					var size = option.size;
					var min = option.min;
					var max = option.max;
					
					switch(type){
						
					case "string":
						
						if(typeof len !== "undefined"){
							if(value.length !== len ){
								obj.error(key,key + "'s length isn't "+len);
							}
						}else{
							if(typeof min !== "undefined"){
								if(value.length < min){
									obj.error(key,key + "'s length must  >= "+min);
								}
							}
							
							if(typeof max !== "undefined"){
								if(value.length > max){
									obj.error(key,key + "'s length must  <= "+max);
								}
							}
						}
						
						break;
						
					case "array":
						
						if(typeof len !== "undefined"){
							if(value.length !== len ){
								obj.error(key,key + "'s length isn't "+len);
							}
						}else{
							if(typeof min !== "undefined"){
								if(value.length < min){
									obj.error(key,key + "s length  >= "+min);
								}
							}
							
							if(typeof max !== "undefined"){
								if(value.length > max){
									obj.error(key,key + "'s length must  <= "+max);
								}
							}
						}
						
						break;
						
					case "number":
						
						if(typeof size !== "undefined"){
							if(value !== size ){
								obj.error(key,key + " must == "+size);
							}
						}else{
							
							if(typeof min !== "undefined"){
								if(value < min){
									obj.error(key,key + "must  >= "+min);
								}
							}
							
							if(typeof max !== "undefined"){
								if(value > max){
									obj.error(key,key + "must  <= "+max);
								}
							}
						}
						
						break;
						
					}
					
				}
			}
		})
	});

	
}