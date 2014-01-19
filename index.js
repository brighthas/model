var Emitter = require("emitter-component")
	,is = require("istype")
	,clone = require("clone")
	,ModelClasses = {}
	,types = ["string","array","number","regexp","data"]

	function isBaseType(v){
		if(v){
			var t = is.type(v);
			if(types.indexOf(t) !== -1){
				return true;
			}else{
				return false;
			}
		}
		return true;
	}

function createModel(name){
	
	
	var args = [].slice.call(arguments,1);
	var attrs = [];
	var currentAttr = null;
	args.forEach(function(arg){
		if(is.type(arg) === "string"){
			currentAttr = {name:arg};
			attrs.push(currentAttr);
		}else{
			currentAttr.option = arg;
		}
	});
	
	Model.attrs = {};
	
	Model.validators = [];
	
	function Model(attrs){
		if(!(this instanceof Model)){
			return new Model(attrs);
		}else{
			Emitter(this);
			this._instant = true;
			this.attrs = attrs || {};
			this.oattrs = {};
			this.errors = [];
			this.model = Model;
			var keys = Object.keys(this.model.attrs);
			if(this.isValid(keys)){
				this.model.emit("create",this);
			}
		}
	}
	
	Emitter(Model);
		
	Model.attr = function(name,option){
		
		option = option || {};
		var type = option.type;
		if(type && is.type(type) === "function"){
			if(!(type.prototype.toJSON && type.reborn)){
				throw new Error("custom type must implement toJSON & reborn");
			}else if(types.indexOf(type) === -1){
				throw new Error("error type.")
			}
		}else{
			option.type = "string";
		}
		
		this.attrs[name] = option;
	}
		
	attrs.forEach(function(attr){
		Model.attr(attr.name,attr.option);
	});
		
		
	Model.method = function(name,fn){
		Model.prototype[name] = fn;
	}
	
	Model.use = function(plugin){
		plugin(this);
		return this;
	}
	
	// add validator for attr
	Model.validate = function(validator){
		this.validators.push(validator);
	}
	
	Model.reborn = function(jsonObj){
		
		var attrs = this.attrs;
		var obj = new Model();
		for(var k in jsonObj){
			
			var v = jsonObj[k];
			
			if(isBaseType(v)){
				obj.attrs[k] = v;
			}else{
				
				var type = attrs[k] ? attrs[k].type : null;
				
				if(type){
					obj.oattrs[k] = type.reborn(v);
				}else{
					obj.oattrs[k] = v;
				}
			}
			
		}		
		return obj;
	}
	
	function createAttr(k){
		Object.defineProperty(Model.prototype,k,{
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
						case "json":
							return clone(v);
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
				this.attrs[k] = v;
				if(this._instant){
					this.validate(k);
				}
			}
		})
	}
		
	for(var k in Model.attrs){
		createAttr(k);
	}
	
	Model.prototype.set = function(attrs){
		
		for (var k in attrs) {
			this.attrs[k] = attrs[k];
		}
		
		if(this._instant) this.validate();
		
		return this;
	}
	
	
	Model.prototype.toJSON = function(){
		
		var jsonObj = {};
		var attrs = this.oattrs;
		var option = Model.attrs[k];
		
		for(var k in attrs){
			var v = attrs[k];
			
			if(isBaseType(v)){
				jsonObj[k] = v;
			}else if(is.type(v) === "date"){
				jsonObj[k] = v.getTime();
			}else if(v.toJSON){
				jsonObj[k] = v.toJSON();
			}else{
				jsonObj[k] = v;
			}
		}
		
		return jsonObj;
		
	}
	
	// [attr_name]
	Model.prototype.validate = function(attr_name){
		
		
		var keys = [];
		
		if(is.type(attr_name) === "array"){
			keys = attr_name;
		}else if(is.type(attr_name) ==="string"){
			keys.push(attr_name);
		}else{
			keys = Object.keys(this.attrs);
		}
		
		var self = this;
		var fns = Model.validators;
		this.errors = [];
		fns.forEach(function(fn){
			fn(self,keys);
		});
		
		if(this.errors.length === 0){
			
			if(attr_name){
				keys.forEach(function(key){
					self.oattrs[key] = self.attrs[key];
				})
			}else{
				for(var k in this.attrs){
					this.oattrs[k] = this.attrs[k];
				}
			}

			this.emit("changed",this.attrs);
		}
		this.attrs = {};
	};
	
	Model.prototype.begin = function(){
		this._instant = false;
	}
	
	Model.prototype.end = function(){
		this.validate();
		this._instant = true;
		return this.errors;
	}
	
	Model.prototype.isValid = function(attr_name){
	  this.validate(attr_name);
	  return 0 == this.errors.length;
	};
	
	Model._name = name;
	
	ModelClasses[name] = Model;
	
	return Model;
	
}

module.exports = createModel;