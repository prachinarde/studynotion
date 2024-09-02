const Mongoose = require("mongoose");

const profileSchema = new Mongoose.Schema({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber:{
        type: Number,
        trim: true,
    }
    

});
module.exports = Mongoose.model("Profile", profileSchema);