var createModel = require("./");

var User = createModel("User")
.attr("name",{min:2,max:6})
.attr("age",{type:"number"});

var user = new User({name:"brighthas",age:12});

console.log(user.errors)
console.log(user.toJSON())
