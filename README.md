model
=====

model

Create Model
============

```js
var createModel = require("brighthas-model");
var User = Model("User",
	"name",
	"age",
	history,{type:"array"});
```

Add method
==========

```js

User.method("getUserInfo",function(){

	return "Name : " + this.name + "\n Age : " + this.age;

});


```

create Model object
===================

```js
var user = new User({ name:"leo" , age:20 , history: [] });

user.begin(); // begin update
user.name = "brighthas";
user.age = 30;
user.end(); // end update  , then may emit 'changed' event. 

```

update model
============

```js

user.begin(); // begin update
user.name = "brighthas";
user.age = 30;
user.end(); // end update  , then may emit 'changed' event. 

console.log(this.hasError());  // true / false
console.log(this.errors);  //  [] is no error .

```

or

```js
user.begin();
user.set({name:"leo",age:25});
user.end(); // end update  , then may emit 'changed' event. 
console.log(this.hasError());  // true / false
console.log(this.errors);  //  [] is no error .
```

or no use begin() & end()

```js

user.name = 222 ;
console.log(this.hasError());  // true 

// if have error , then can't change other field.
user.age = 16 ;  
console.log(user.age) ; // old value , no 16.

// so clearError()
user.clearError();
user.age = 16; 
console.log(user.age); // 16

```











