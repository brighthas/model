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

Config Model
============
```js
User
 .attr("name")
 .attr("age")
 .attr("history",{type:"array"});
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

// if have error , then can't change other value.
user.age = 16 ;  
console.log(user.age) ; // no 16.

// so first clear errors.
user.errors = [];
user.age = 16; 
console.log(user.age); // 16

```

toJSON | reborn
===============

var jsonObj = user.toJSON();

var user2 = User.reborn(jsonObj);
console.log(user.name === user2.name); // true

user2.name = "brighthas";
console.log(user.name === user2.name); // false


Type
====

if no assign type , default type="string" .

Two types : `value type` and `complex type`.

#### Value type

`string` | `array` | `json` | `boolean` | `number` | `date` | `regexp`

when get value , the value is clone .

```js
var T = createModel("T",ts:{type:"json"});

var t = T();

t.userInfo = {name:"leo"};

var u1 = t.userInfo;
var u2 = t.userInfo;

console.log(u1 === u2); // false

```

#### Complex type

complex type can be `Model` or object including Type.prototype.toJSON & Type.reborn function.

when get value , the value is original value.

```js

var User = Model("User",
	"name",
	"age",
	history,{type:"array"});


var T = createModel("T",user:{type:User}); // User is Model.

var t = T();

t.user = User({name:"leo",age:21});

var u1 = t.user; // the value is original value.
var u2 = t.user; // the value is original value.

console.log(u1 === u2); // true , 

```

or

```js

function User(name,age,hisitory){
	this.name = name;
	this.age = age;
	this.history = hisitory || [];
}

User.prototype.toJSON = function(){
	return {
		name:this.name,
		age:this.age,
		history:this.history
	}
}

User.reborn = function(jsonObj){
	return new User(jsonObj.name,jsonObj.age,jsonObj.history);
}


//////////////////////////////////////////


var T = createModel("T",user:{type:User});

var t = T();

t.user = User("leo",21);

var u1 = t.user; // the value is original value.
var u2 = t.user; // the value is original value.

console.log(u1 === u2); // true , 

```










