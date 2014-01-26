var createModel = require("../");
var CType = require("./CType");
var should = require("should");
var is = require("istype");


describe("model", function() {

	var Book;

	it("#createModel", function() {
		Book = createModel("Book", "name", {
			required: true
		}, "age", {
			type: "number",
			default: 30
		}, "price", {
			type: "number",
			default: 115.00
		});
	});

	it("#new", function() {
		var book = new Book();
		book.hasError().should.be.true;
		book = new Book({
			name: "hello js"
		})
		book.hasError().should.be.false;
	})

	it("# creating & created event", function() {

		var book, book2, book3;

		Book.on("creating", function(o) {
			book2 = o;
		})

		Book.on("created", function(o) {
			book3 = o;
			var bool = book2 === book3;
			bool.should.be.true;
		})

		book = new Book({
			name: "node.js whit express"
		});

		var bool = book === book2 && book2 === book3;
		bool.should.be.true;
	})

	it("# changing & chaged event", function() {

		var book = new Book({
			name: "node.js whit express"
		});
		book.on('changing', function(attrs) {
			attrs.should.eql({
				name: "first book"
			});
			book.name.should.eql("node.js whit express");
		});
		book.on("changed", function() {
			book.name.should.eql("first book");
		});

		book.name = "first book";

	})

	it("# Model.attr()",function(){
		var User = createModel("User");
		User.attr("name");
		User.attr("age",{type:"number"});
		User.attrs.name.type.should.eql("string");
		User.attrs.age.type.should.eql("number");
	})
	
	it("# Model.method()",function(){
		var User = createModel("User");
		function toJSON(){}
		User.method("toJSON",toJSON);
		
		(User.prototype.toJSON !== toJSON).should.be.true;
	})
	
	it("# readonly",function(){
		var User = createModel("User");
		User.attr("name",{readonly:true});
		
		var user = new User();
		user.name = "leo";
		user.name.should.eql("leo")
		user.name = "brighthas";
		user.name.should.eql("leo")
		user.hasError().should.be.true;
	})

})
