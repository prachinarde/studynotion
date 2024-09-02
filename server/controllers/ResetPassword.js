const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {passwordUpdated}  = require("../mail/templates/passwordUpdate");
// resetPasswordToken-nail sending
exports.resetPasswordToken = async (req, res) => {
    try{
        //get email from req body
    const email = req.body.email;
    //check user for email, email validation
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(403).json({
            success: false,
            message: "Your Email is not registered with us"
        });
    }
    //generate token
    const token = crypto.randomUUID();
     //update user by adding token and expiration time
     const updatedDetails = await User.findOneAndUpdate({
        email:email
     },
    {
        token: token,
        resetPasswordExpires: Date.now() + 5*60*1000,
    }, {new: true});

     //create url
     const url = `http://localhost:3000/update-password/${token}`;

     
     //send mail containing the url
     await mailSender(email,
        "password Reset Link",
         passwordUpdated(email, url)

     );
     //return response
     return res.json({
        success: true,
        message: "Email sent successfully, Please check email and change password"
     })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Somthing went wrong"
        })

    }
    

   }

//resetPassword-changes in db
exports.resetPassword = async (req, res) => {
    try{
        //data ftech
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password!=confirmPassword){
            return res.json({
                success:false,
                message:"Password is not matching",
            });
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token: token});

        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Invalid Token"
            });
        }
        //token time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success: false,
                message: "Token is Expired"
            });

        }
        //hashpassword
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password
        await User.findOneAndUpdate({token: token},
            {password: hashedPassword},
            {new: true},
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Passwrod reset Successfully"
        });



    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Something went wrong while reseting the password, Please try again."
        })

    }
}