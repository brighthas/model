var Emitter = require("emitter-component"),
    is = require("istype"),
    statics = require("./static"),

    default_validator = require("./validators/default"),
    readonly_validator = require("./validators/readonly"),
    type_validator = require("./validators/type"),
    required_validator = require("./validators/required"),
    length_validator = require("./validators/length"),
    validator_validator = require("./validators/validator"),

    bindSubEvent = require("./bindSubEvent"),
    proto = require("./proto"),
    ModelClasses = {}, types = require("./types");


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
            this.model.emit("creating", this);
            this.validate();
            if (!this.hasError()) {
                this.oattrs = attrs || {};
                var names = this.model.getComplexAttrNames();
                bindSubEvent(this, names);
                this.model.emit("created", this);
            }
        }
    }

    Emitter(Model);

    Model.modelName = name;
    Model.attrs = {};
    Model.validators = [];
    Model.prototype.model = Model;

    ModelClasses[name] = Model;

    for (var key in statics) {
        Model[key] = statics[key];
    }
    for (var key in proto) {
        Model.prototype[key] = proto[key];
    }

    generateAttr([].slice.call(arguments, 1));

    Model.use(type_validator);
    Model.use(readonly_validator);
    Model.use(default_validator);
    Model.use(required_validator);
    Model.use(length_validator);
    Model.use(validator_validator);

    return Model;

}

createModel.get = function(name) {
    return ModelClasses[name]
}


module.exports = createModel;
