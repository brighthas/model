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
			console.log(key,value);
            if (validator && value) {
                if (is.regexp(validator)) {
                    if (!validator.test(value)) {
                        obj.error(key, "error");
                    }
                } else {
                    if (!validator(obj)) {
                        obj.error(key, "error");
                    }
                }

            }

        });


    })

}
