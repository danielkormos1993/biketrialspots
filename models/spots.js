var mongoose = require("mongoose");

var spotsSchema = new mongoose.Schema({
   
   title:String,
   location:{
       address:String,
       lat:Number,
       lng:Number
   },
   image:String,
   description:String,
   author:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "users"
      }
   
});

module.exports = mongoose.model("spots", spotsSchema);