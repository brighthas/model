module.exports = function bindSubEvent(self, names) {

	names.forEach(function(k) {

		var v = self[k];
		if (v) {
			function listener() {
				if (self[k] === v) {
					var o = {};
					o[k] = v;
					self.model.emit("changed", self, o);
					self.emit("changed", o);
				} else {
					v.off("changed", listener);
				}
			}

			v.on("changed", listener);
		}


	})
}
