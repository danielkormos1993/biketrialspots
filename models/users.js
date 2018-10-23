var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    facebookID:Number,
    username:String,
    photo:String
});

userSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({facebookID : profile.id},function(err,result){ 
        if(!result){
            userObj.facebookID = profile.id;
            userObj.username = profile.displayName;
            userObj.photo = profile.photos[0].value;
            userObj.save(cb);
        } else{
            cb(err,result);
        }
    });
};

module.exports = mongoose.model("users", userSchema);