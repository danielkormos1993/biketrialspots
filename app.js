var express         = require("express"),
    mongoose        = require("mongoose"),  
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    spots           = require("./models/spots"),
    seedDB          = require("./seedDB");
    
mongoose.connect("mongodb://localhost/biketrialspots", { useNewUrlParser: true });
var app = express();

// ==================================
// APP CONFIGURATION
// ==================================

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
seedDB();

// ==================================
// ROUTES
// ==================================

app.get("/", function(req, res){
    spots.find({}, function(err, spots){
        if(err){
            console.log(err);
        } else{
            res.render("index", {spots:spots});
        }
    });
});

app.get("/new", function(req, res){
    res.render("new");
});

app.post("/", function(req, res){
    spots.create(req.body.spot, function(err, result){
        if(err){
            console.log(err)
        } else{
            res.redirect("/");
        }
    });
});

app.get("/:id", function(req, res){
    spots.findById(req.params.id, function(err, spot){
        if(err){
            console.log(err);
        } else{
            res.render("spot", {spot: spot});
        }
    });
});

app.delete("/:id", function(req, res){
    spots.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/");
        }
    });
});

// ==================================
// APP LISTEN
// ==================================

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("BikeTrialSpots server has been started...");
});