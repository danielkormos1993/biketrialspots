var express             = require("express"),
    mongoose            = require("mongoose"),  
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    passport            = require("passport"),
    facebookStrategy    = require("passport-facebook").Strategy,
    users               = require("./models/users"),
    spots               = require("./models/spots"),
    seedDB              = require("./seedDB");
    
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

// PASSPORT CONFIG

app.use(require("express-session")({
    secret: "echocontrol",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

passport.use(new facebookStrategy({
    clientID: "1103233456502553",
    clientSecret: "61586964d1b69eeaaa5d4cb808c6fdc3",
    callbackURL: "https://84dde739bf2b434f9b6bd73b471f35f4.vfs.cloud9.us-east-2.amazonaws.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)']
}, function(accessToken, refreshToken, profile, done) {

        users.findOrCreate(profile, function(err, user) {

             if (err) 
                { return done(err); }

            done(null, user);

        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    users.findById(id, function(err, user) {
        done(err, user);
    });
});

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

app.get("/new", ensureAuthenticated, function(req, res){
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

app.get("/logout", function(req, res){

    req.logout();
    res.redirect('back'); 

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

app.delete("/:id", ensureAuthenticated, function(req, res){
    spots.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/");
        }
    });
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', 
    { successRedirect: '/',
      failureRedirect: '/login' })
);

// ==================================
// MIDDLEWARES
// ==================================

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    return res.redirect('back');
}

// ==================================
// APP LISTEN
// ==================================

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("BikeTrialSpots server has been started...");
});