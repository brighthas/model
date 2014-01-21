var Emitter = require("emitter-component")

function CType(name,age){
	this.name = name;
	this.age = age;
	this.subs = [];
}

Emitter(CType.prototype);


CType.prototype.toJSON = function(){
	var o = {
		name:this.name,
		age:this.age,
		subs:[]
	};
	

    this.subs.forEach(function(sub){
    	o.subs.push(sub.toJSON());
    });
	
	return o;
	
}

CType.prototype.add = function(sub){
	this.subs.push(sub);
}

CType.reborn = function(json){
	var o = new CType(json.name,json.age);
	
	json.subs.forEach(function(sub){
		o.subs.push(CType.reborn(sub));
	});
	
	return o;
}

module.exports = CType;