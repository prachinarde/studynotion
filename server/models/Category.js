const Mongoose = require("mongoose");

const categorySchema = new Mongoose.Schema({
   name:{
    type: String,
    required: true,
   },
   description:{
    type: String,
   },
   courses:[{
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Course",
   }],
});
module.exports = Mongoose.model("Category", categorySchema );