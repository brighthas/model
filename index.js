var Emitter = require("emitter-component"),
	is = require("istype"),
	statics = require("./static"),
	bindSubEvent = require("./bindSubEvent"),
	proto = require("./proto"),
	ModelClasses = {}, types = require("./types");

function isBaseType(v) {
	if (v) {
		var t = is.type(v);
		if (types.indexOf(t) !== -1) {
			return true;
		} else {
			return false;
		}
	}
	return true;
}


function createModel(name) {

	function generateAttr(args) {
		var attrs = [];
		var currentAttr = null;

		args.forEach(function(arg) {
			if (is.type(arg) === "string") {
				currentAttr = {
					name: arg
				};
				attrs.push(currentAttr);
			} else {
				currentAttr.option = arg;
			}
		});
		
		attrs.forEach(function(attr) {
			Model.attr(attr.name, attr.option);
		});
	}

	function Model(attrs) {
		if (!(this instanceof Model)) {
			return new Model(attrs);
		} else {
			Emitter(this);
			this._instant = true;
			this.attrs = attrs || {};
			this.oattrs = {};
			this.errors = [];
			var keys = Object.keys(this.model.attrs);
			this.validate();
			if (!this.hasError()) {				
				var names = this.model.getComplexAttrNames();
				bindSubEvent(self,names);
				this.model.emit("create", this);
			}
		}
	}

	Emitter(Model);

	Model.modelName = name;
	Model.attrs = {};
	Model.validators = [];
	Model.prototype.model = Model;

	ModelClasses[name] = Model;

    for (var key in statics) { Model[key] = statics[key]; }
    for (var key in proto) { Model.prototype[key] = proto[key]; }
	
	generateAttr([].slice.call(arguments, 1));
	return Model;

}

createModel.get = function(name) {
	return ModelClasses[name]
}

module.exports = createModel;
