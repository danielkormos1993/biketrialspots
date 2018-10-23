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
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "users"},
      username:String   
   }
   
});

module.exports = mongoose.model("spots", spotsSchema);