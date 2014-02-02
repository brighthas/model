var types = require("./types"),
	is = require("istype"),
	bindSubEvent = require("./bindSubEvent");

exports.error = function(attr, msg) {
	this.errors.push({
		attr: attr,
		message: msg
	});
	return this;
};

exports.set = function(attrs) {

	if (this._instant) {
		this.begin();
		this.attrs = attrs;
		this.end();
	} else {
		for (var k in attrs) {
			this.attrs[k] = attrs[k];
		}
	}

	return this;
};

exports.toJSON = function() {

	var jsonObj = {};
	var attrs = this.model.attrs;

	for (var k in attrs) {
		var type = attrs[k].type;
		var v = this[k];
		if (v) {
			if (this.model.isComplexType(k)) {
				jsonObj[k] = v.toJSON()
			}else{
				// DOTo
				if(type === "date"){
					jsonObj[k] = v.getTime();
				}else if(type === "regexp"){
					jsonObj[k] = v.toString();
				}else{
					jsonObj[k] = v;
				}
			}
		}else{
			jsonObj[k] = v;
		}
	}

	return jsonObj;

}

exports.validate = function(attr_name) {

	var keys = [];
	if (is.type(attr_name) === "array") {
		keys = attr_name;
	} else if (is.type(attr_name) === "string") {
		keys.push(attr_name);
	} else {
		keys = Object.keys(this.model.attrs);
	}

	var self = this;
	var fns = this.model.validators;
	fns.forEach(function(fn) {
		fn(self, keys);
	});
};

exports.begin = function() {
	this._instant = false;
	this.errors = [];
}

exports.end = function() {

	this.model.emit("changing", this, this.attrs);
	this.emit("changing", this.attrs);
	this.validate(Object.keys(this.attrs));
	
	if (!this.hasError()) {
		this._instant = true;
		var data = this.attrs;
		var names = [];
		for (var k in data) {
			var v = this.oattrs[k] = data[k];
			if (this.model.isComplexType(k)) {
				names.push(k);
			}
		}

		bindSubEvent(this, names);
		this.model.emit("changed", this, this.attrs);
		this.emit("changed", this.attrs);
	}
	
	this.attrs = {};
	this._instant = true;
	
	
}

exports.hasError = function() {
	return 0 < this.errors.length;
}
