var is = require("istype");

module.exports = function(Model){

	Model.validators.push(function(obj,keys){
		
		if(obj.hasError()) return;

        keys.forEach(function(key) {

            var value = obj.attrs[key];
            var convert = Model.attrs[key].convert;

            if (value && convert) {

                var type = Model.attrs[key].type;
                if (["string" , "number", "boolean"].indexOf(type) !== -1 && convert) {
                    var hasError = false;
                    switch (type) {
                        case "string":
                            obj.attrs[key] = obj.attrs[key] + "";
                            break;
                        case "number":
                            var num = parseInt(obj.attrs[key]);
                            if(num + "" === "NaN"){
                                hasError = true;
                            }else{
                                obj.attrs[key] = num;
                            }
                            break;
                        case "boolean":
                            obj.attrs[key] = Boolean(obj.attrs[key]);
                            break;
                    }

                    if (hasError) {
                        obj.result.error(key, key + " 's type error.");
                    }

                }
            }
        })
		
	})
}