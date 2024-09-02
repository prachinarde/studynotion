const Mongoose = require("mongoose");

const subSectionSchema = new Mongoose.Schema({
   title:{
    type: String,

   },
   timeDuration:{
    type: String,
   },
   description: {
    type: String,
   },
   videoUrl:{
    type: String,
   }
});
module.exports = Mongoose.model("SubSection", subSectionSchema );