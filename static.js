var types = require("./types"),
is = require("istype"),
bindSubEvent = require("./bindSubEvent");

exports.attr = function(name,option){
	
	option = option || {};
	var type = option.type;
	if(type && is.type(type) === "function"){
		if(!(type.prototype.toJSON && type.reborn)){		
			throw new Error("custom type must implement toJSON & reborn");
		}
	}else if(!type){
		option.type = "string";
	}
	
	this.attrs[name] = option;
	
	this.createAttr(name);
	
	return this;
	
}

exports.getComplexAttrNames = function(){
	var attrNames = [];
	for(var k in this.attrs){
		type = this.attrs[k].type;
		if(is.type(type) === "function"){
			attrNames.push(k);
		}
	}
	return attrNames;
}

exports.isComplexType = function(attrName){
	var type = this.attrs[attrName].type;
	return is.type(type) === "function";
}

exports.createAttr = function(k){
	Object.defineProperty(this.prototype,k,{
		get:function(){

			var v = this.oattrs[k];
			
			if(v){
				var type = this.model.attrs[k].type;					
				switch(type){
					case "regexp":
						return new RegExp(v.toString());
						break;
					case "date":
						return new Date().setTime(v.getTime());
						break;
					case "array":
					case "json":
						try{
							return JSON.parse(JSON.stringify(v));
						}catch(e){
							return null;
						}
						break;
					default:
						return v;
						break;
				}
				
			}else{
				return v;
			}
		},
		set:function(v){
			var o = {};
			o[k] = v;
			this.set(o);
		}
	})
}


exports.method = function(name,fn){
	if(!this.prototype[name]){
		this.prototype[name] = fn;
	}
	return this;
}

exports.use = function(plugin){
	plugin(this);
	return this;
}

exports.validate = function(validator){
	this.validators.push(validator);
}

exports.reborn = function(jsonObj){
	
	var attrs = this.attrs;
	
	var obj = new this();
	for(var k in jsonObj){
		
		var v = jsonObj[k];
		
		if(types.indexOf(attrs[k].type) !== -1){
			obj.oattrs[k] = v;
		}else{
			
			var type = attrs[k] ? attrs[k].type : null;
			
			if(type){
				obj.oattrs[k] = type.reborn(v);
			}else{
				obj.oattrs[k] = v;
			}
		}		
	}		
	
	bindSubEvent(obj,this.getComplexAttrNames());

	return obj;
}