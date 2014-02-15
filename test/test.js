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

    it("# Model.attr()", function() {
        var User = createModel("User");
        User.attr("name");
        User.attr("age", {
            type: "number"
        });
        User.attrs.name.type.should.eql("string");
        User.attrs.age.type.should.eql("number");
    })

    it("# Model.method()", function() {
        var User = createModel("User");

        function toJSON() {}
        User.method("toJSON", toJSON);

        (User.prototype.toJSON !== toJSON).should.be.true;
    })

    it("# readonly", function() {
        var User = createModel("User");
        User.attr("name", {
            readonly: true
        });

        var user = new User();
        user.name = "leo";
        user.name.should.eql("leo")
        user.name = "brighthas";
        user.name.should.eql("leo")
        user.hasError().should.be.true;
    })

    it("#string length validator", function() {
        var User = createModel("User");
        User.attr("name", {
            len: 6
        });
        var user = new User;
        user.name = "bright";

        user.name.should.eql("bright");
        user.name = "brighthas";
        user.name.should.eql("bright");


    })

    it("# string min and max", function() {

        var User = createModel("User");
        User.attr("name", {
            min: 3,
            max: 6
        });
        var user = new User;
        user.name = "bright";
        user.name.should.eql("bright");
        user.name = "bb";
        user.name.should.eql("bright");

    })

    it("#number size validator", function() {

        var User = createModel("User");
        User.attr("age", {
            size: 6,
            message: "hahah",
            type: "number"
        });

        var user = new User;
        user.age = 6;

        user.age.should.eql(6);
        user.age = 222;
        //		console.log(user.errors)
        user.age.should.eql(6);

    })

    it("#number min / max validator", function() {

        var User = createModel("User");
        User.attr("age", {
            min: 3,
            max: 6,
            type: "number"
        });

        var user = new User;
        user.age = 6;

        user.age.should.eql(6);
        user.age = 7;
        user.age.should.eql(6);

    })

    it("array length validator", function() {

        var User = createModel("User");
        User.attr("arr", {
            len: 6,
            type: "array"
        });

        var user = new User;
        user.arr = Array(6);

        user.arr.length.should.eql(6);
        user.arr = [12];

        user.arr.length.should.eql(6);
    })

    it("array length min / max validator", function() {

        var User = createModel("User");
        User.attr("arr", {
            min: 2,
            max: 6,
            type: "array"
        });

        var user = new User;
        user.arr = Array(6);

        user.arr.length.should.eql(6);
        user.arr = Array(7);

        user.arr.length.should.eql(6);

    })

    it("email type", function() {
        var User = createModel("User");
        User.attr("email", {
            type: "email",
            message: "have error !!!"
        });

        var user = new User;

        user.hasError().should.eql(false);

        user.email = "aaaa";

        user.hasError().should.eql(true);
        user.errors["email"][0].should.eql("have error !!!");

        user.email = "abcd@kk.com";

        user.hasError().should.eql(false);

    })

    it("validator option", function() {
        var User = createModel("User");
        User
            .attr("name", {
                validator: /abc/
            })
            .attr("age", {
                type: "number",
                validator: function(v) {
                    return v < 12;
                }
            })


        var user = new User;
        user.hasError().should.eql(false);

        user.name = "hahaha";
        user.hasError().should.eql(true);

        user.name = "aaabcddd";
        user.hasError().should.eql(false);

        user.age = 12;
        user.hasError().should.eql(true);

        user.age = 11;
        user.hasError().should.eql(false);



    })

})
