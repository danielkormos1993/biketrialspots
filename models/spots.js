var mongoose = require("mongoose");

var spotsSchema = new mongoose.Schema({
   
   title:String,
   location:{
       address:String,
       lat:Number,
       lng:Number
   },
   image:String,
   description:String
   
});

module.export = mongoose.model("spots", spotsSchema);