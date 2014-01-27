module.exports = function defaultValue(Model){
		
	Model.on("creating",function(model){
		var keys = Object.keys(Model.attrs);
		keys.forEach(function(key){
			if(Model.attrs[key].hasOwnProperty("default")){
				model.attrs[key] = Model.attrs[key]["default"];
			}
		});
	});
	
}