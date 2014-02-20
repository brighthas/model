var types = require("./types"),
    is = require("istype"),
    bindSubEvent = require("./bindSubEvent");

exports.attr = function(name, option) {

    option = option || {};
    var type = option.type;
    if (type && is.type(type) === "function") {
        if (!(type.prototype.toJSON && type.reborn)) {
            throw new Error("custom type must implement toJSON & reborn");
        }
    } else if (!type) {
        option.type = "string";
    }

    this.attrs[name] = option;
    this.createAttr(name);
    return this;

}

exports.toJSON = function(model, keys) {

    var jsonObj = {};
    keys.forEach(function(k) {
        var v = model[k];
        if (v) {
            if (model.model.isComplexType(k)) {
                jsonObj[k] = v.toJSON()
            } else {
                jsonObj[k] = v;
            }
        } else {
            jsonObj[k] = v;
        }
    });

    return jsonObj;

}

exports.getComplexAttrNames = function() {
    var attrNames = [];
    for (var k in this.attrs) {
        type = this.attrs[k].type;
        if (is.type(type) === "function") {
            attrNames.push(k);
        }
    }
    return attrNames;
}

exports.isComplexType = function(attrName) {
    var type = this.attrs[attrName].type;
    return is.type(type) === "function";
}

exports.createAttr = function(k) {
    Object.defineProperty(this.prototype, k, {
        get: function() {

            var v = this.oattrs[k];

            if (v) {
                var type = this.model.attrs[k].type;
                switch (type) {
                    case "regexp":
                        return new RegExp(v.toString());
                        break;
                    case "date":
                        var time = new Date();
                        time.setTime(v.getTime());
                        return time;
                        break;
                    case "array":
                    case "json":
                        try {
                            return JSON.parse(JSON.stringify(v));
                        } catch (e) {
                            return null;
                        }
                        break;
                    default:
                        return v;
                        break;
                }

            } else {
                return v;
            }
        },
        set: function(v) {
            var o = {};
            o[k] = v;
            this.set(o);
        }
    })
}



exports.method = function(name, fn) {
    if (!this.prototype[name]) {
        this.prototype[name] = fn;
    }
    return this;
}

exports.use = function(plugin) {
    plugin(this);
    return this;
}

exports.validate = function(validator) {
    this.validators.push(validator);
    return this;
}

exports.reborn = function(jsonObj) {

    var attrs = this.attrs;

    var obj = new this();
    var self = this;
    obj._errors.clearError();
    var keys = Object.keys(this.attrs);

    keys.forEach(function(k) {

        var v = jsonObj[k];

        if (types.indexOf(self.attrs[k].type) !== -1) {
            var t = attrs[k].type;
            if (t === "date") {
                var time = new Date();
                time.setTime(v);
                obj.oattrs[k] = time;

            } else if (t === "regexp") {
                obj.oattrs[k] = new RegExp(v);

            } else {
                obj.oattrs[k] = v;
            }
        } else {

            var type = attrs[k] ? attrs[k].type : null;
            if (type) {

                obj.oattrs[k] = type.reborn(v);
            } else {
                obj.oattrs[k] = v;
            }
        }
    });

    bindSubEvent(obj, this.getComplexAttrNames());

    return obj;

}
