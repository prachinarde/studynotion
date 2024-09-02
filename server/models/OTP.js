const Mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new Mongoose.Schema({
     email:{
        type: String,
        required: true,

     },
     otp:{
        type: String,
        required: true,
     },
     createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60,
     }
});

// a function to send mail
async function sendVerificationEmail(email, otp){
   try{

      const mailResponse = await mailSender(email, "Verifictaion Email from StudyNotion", otp);
      console.log("Email sent Successfully", mailResponse);

   }catch(error){
      console.log("error occured while sending mail: ", error);
      throw error;
   }
}
OTPSchema.pre("save", async function(next){
   await sendVerificationEmail(this.enail, this.otp);
   next();

} )

module.exports = Mongoose.model("OTP", OTPSchema);