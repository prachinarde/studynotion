const Mongoose = require("mongoose");

const courseSchema = new Mongoose.Schema({
  courseName:{
    type:String,
  },
  courseDescription:{
    type: String,
  },
  instructor:{
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  whatYouWillLearn:{
         type: String,
  },
  courseContent:[
   { type: Mongoose.Schema.Types.ObjectId,
    ref: "Section",}
  ],
  ratingAndReviews: [
    {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReviews",
    }
  ],
  price:{
    type: Number,
  },
  thumbnail:{
    type: String,
  },
  category:{
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tag:{
    type: [String],
    required: true,

  },
  studentsEnrolled:[{
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }

});
module.exports = Mongoose.model("Course", courseSchema );