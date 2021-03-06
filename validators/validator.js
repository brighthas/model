var is = require("istype"),
    types = require("../types"),
    validator = require("validator");

module.exports = function(Model) {

    Model.validators.push(function(obj, keys) {

        if (obj.hasError()) return;

        keys.forEach(function(key) {

            var option = Model.attrs[key];
            var type = option.type;
            var validator = option.validator;
            var value = obj.attrs[key];
            if (validator && value) {
                if (is.regexp(validator)) {
                    if (!validator.test(value)) {
                        obj.result.error(key, "error");
                    }
                } else {
                    if (!validator(value)) {
                        obj.result.error(key, "error");
                    }
                }

            }

        });


    })

}
