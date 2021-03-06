var express             = require("express"),
    mongoose            = require("mongoose"),  
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    passport            = require("passport"),
    facebookStrategy    = require("passport-facebook").Strategy,
    flash               = require("connect-flash"),
    users               = require("./models/users"),
    spots               = require("./models/spots");
    
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
var app = express();

// ==================================
// APP CONFIGURATION
// ==================================

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

var FBCALLBACK;

if(process.env.DEVELOPMENT === "true"){
    FBCALLBACK = "https://84dde739bf2b434f9b6bd73b471f35f4.vfs.cloud9.us-east-2.amazonaws.com/auth/facebook/callback";
    var seedDB = require("./seedDB");
    seedDB();
} else {
    FBCALLBACK = "https://biketrialspots.herokuapp.com/auth/facebook/callback";
}

// PASSPORT CONFIG

app.use(require("express-session")({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// LOCAL VARIABLES

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// FACEBOOK STRATEGY

passport.use(new facebookStrategy({
    clientID: "1103233456502553",
    clientSecret: process.env.FBCLIENTSECRET,
    callbackURL: FBCALLBACK, 
    profileFields: ['id', 'displayName', 'picture.type(large)']
}, function(accessToken, refreshToken, profile, done) {
    users.findOrCreate(profile, function(err, user) {
        if (err) { return done(err); }
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

app.post("/", ensureAuthenticated, function(req, res){
    spots.create(req.body.spot, function(err, createdSpot){
        if(err){
            console.log(err)
        } else{
            createdSpot.author.id = req.user._id;
            createdSpot.author.username = req.user.username;
            createdSpot.save();
            req.flash("success","Sikeresen létrehoztál egy pályát/spotot");
            res.redirect("/" + createdSpot._id);
        }
    });
});

app.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Sikeresen kijelentkeztél!");
    res.redirect("/"); 
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

app.delete("/:id", checkSpotOwnership, function(req, res){
    spots.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash("error","Pálya/spot törölve.");
            res.redirect("/");
        }
    });
});

// FB AUTH ROUTES

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
    req.flash("error","Bejelentkezés szükséges!");
    return res.redirect("/");
}

function checkSpotOwnership(req, res, next){
    if(req.isAuthenticated()){
        spots.findById(req.params.id, function(err, spot){
            if(err){
                console.log(err);
            }
           if(spot.author.id.equals(req.user._id)){
               next();
           } else {
               req.flash("error","Nem rendelkezel a szükséges privilégiókkal.");
               res.redirect("/" + req.params.id);
           }
        });
    } else {
        req.flash("error","Bejelentkezés szükséges!");
        res.redirect("/");
    }
}

// ==================================
// APP LISTEN
// ==================================

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("BikeTrialSpots server has been started...");
});