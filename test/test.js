var createModel = require("../");
var CType = require("./CType");
var should = require("should");
var is = require("istype");


function isBaseType(t){
	if(t==="array" || t==="number" || t === "boolean" ||  t==="string" ||  t==="regexp"){
		return true;
	}else{
		return false;
	}
}


describe("model",function(){
	var Test;
	
	it("#create",function(){
		Test = createModel("Test","ct",{type:CType});
		Test.use(function(Model){
			Model.validat(function type(obj,names){
				names.forEach(function(name){
					var option = Model.attrs[name] || {};
					var type = option.type;
					var v = obj.attrs[name];
					if(type){
						if(isBaseType(type)){
							
						}else{
							
						}
					}
				});
			});
		})
	})
	
	it("#new",function(){
		
		var o  = new Test();
		o.ct = new CType("leo",32);
		o.ct.add(new CType("brighthas",20))
		
		var jsonObj = o.toJSON();
		
		var newo = Test.reborn(jsonObj);
		
		newo.ct.add(new CType("new name",12));
		
	})
	
})