const Mongoose = require("mongoose");

const courseProgress = new Mongoose.Schema({
    courseID:{
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedVideos:[
        {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ],


});
module.exports = Mongoose.model("CourseProgress", courseProgress );