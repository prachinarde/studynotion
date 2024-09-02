const Mongoose = require("mongoose");

const ratingAndReviewSchema = new Mongoose.Schema({
    user:{
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating:{
        type: Number,
        required: true,

    },
    review:{
        type: String,
        required: true,
    },
    course:{
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        index: true,
    }
   
});
module.exports = Mongoose.model("RatingAndReviews", ratingAndReviewSchema  );