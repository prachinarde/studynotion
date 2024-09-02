const Mongoose = require("mongoose");

const sectionSchema = new Mongoose.Schema({
   sectionName:{
    type: String,
   },
   subSection:[
    {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection",
    }
   ],
});
module.exports = Mongoose.model("Section", sectionSchema);