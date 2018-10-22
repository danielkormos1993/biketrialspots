var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
mongoose.connect("mongodb://localhost/biketrialspots", { useNewUrlParser: true });

var spotsSchema = new mongoose.Schema({
   title:String,
   location:{
       address:String,
       lat:String,
       lng:String
   },
   image:String,
   description:String,
   contact:String
});

var spots = mongoose.model("spots", spotsSchema);
    
var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

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

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("APP HAS STARTED!!!!!");
});