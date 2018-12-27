var express=require("express");
var app=express();
var mongoose=require("mongoose");
var BodyParser=require("body-parser");
var methodOverride=require("method-override");

mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(BodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var blogSchema=mongoose.Schema({
	name:String,
	image:String,
	body:String,
	created:{type:Date, default:Date.now }
});

var Blog = mongoose.model("blog",blogSchema);

app.get("/",function (req,res) {
	res.redirect("/blogs");
});

app.get("/blogs",function (req,res) {
	Blog.find({},function (err,blog) {
		if(err)
			console.log(err);
		else
			res.render("index",{blogs:blog});
	});
});

app.get("/blogs/new",function (req,res) {
	 res.render("new");
});

app.post("/blogs",function (req,res) {
	Blog.create(req.body.blog,function (err,blog) {
		if(err)
			res.render("new");
		else
			res.redirect("/blogs")
	});
});

app.get("/blogs/:id",function (req,res) {
	Blog.findById(req.params.id,function (err,blog) {
		if(err)
			console.log(err)
		else
			res.render("show",{blog:blog});
	});
});

app.get("/blogs/:id/edit",function (req,res) {
	Blog.findById(req.params.id,function (err,blog) {
		if(err)
			console.log(err);
		else
			res.render("edit",{blog:blog});
	});
});

app.put("/blogs/:id",function (req,res) {
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function (err,blog) {
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs/"+req.params.id);
	});
});

app.delete("/blogs/:id",function (req,res) {
	Blog.findByIdAndRemove(req.params.id,function (err) {
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
});
app.listen(3000);