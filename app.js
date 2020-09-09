var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
// 	Add Mongoose
    mongoose   = require("mongoose")

// Connect Mongoose to our database
// TA updated syntax on mongoose.connect
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
})

// Compile Schema into Model
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Sleepaway Camp",
// 		image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
// 		description: "This camp is way different below the surface, watch your head bro"
// 	},
// 	function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("New Campground")
// 			console.log(campground);
// 		}
// 	})

app.get("/", function(req, res){
	res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
// 	Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index",{campgrounds:allCampgrounds});
		}
	})
})

// CREATE - add new campground to database
app.post("/campgrounds", function(req,res){
// 	get data from form and add to array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampGround = {name: name, image: image, description: desc};
// 	Create New Campground and save to DB
	Campground.create(newCampGround, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// 	redirect back to campgrounds page
	res.redirect("/campgrounds")
		}
	})
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs")
})

// SHOW - Shows more info about campground
app.get("/campgrounds/:id", function(req, res){
// 	Find Campground with matching ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			// 	render show template with chosen campground
	res.render("show", {campground: foundCampground});
		}
	})

})

// Tell Express to listen for requests (start server)
app.listen(3000, function() { 
  console.log('Yo dog, yelpcamp server has started'); 
});