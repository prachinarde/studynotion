const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const Profile = require("../models/Profile");
const passwordUpdated = require("../mail/templates/passwordUpdate")
require("dotenv").config();
//sendOTP

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
      //  console.log("OTP generated:", otp);

        // Ensure unique OTP
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        // Create OTP entry in the database
        const otpPayload = { email, otp };
        await OTP.create(otpPayload);

        // Send OTP email
        const emailResponse = await mailSender(email, "Your OTP Code", emailTemplate(otp));
        if (!emailResponse) {
            throw new Error("Failed to send OTP email");
        }
         
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//signup
exports.signUp = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;
        
        // Check if all details are there or not
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        if (!response.length) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "The OTP not found for the email",
            });
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine approval status based on accountType
        let approved = accountType !== "Instructor";

        // Create the additional profile for user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};



//Login

exports.login = async (req, res)=>{
    try{
        //get data from req body
        const {email, password} = req.body;

          //data validation
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Enter all Feilds"
            })
        }

      
        //cgeck user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(403).json({
                success: false,
                message: "User is not registered, Please Signup first",
            })
        }
        // check password
       
        if(await bcrypt.compare(password, user.password)){
            //generate JWT
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            })
            user.token = token;
            user.password = undefined;
               //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            })
        }else{
            return res.status(403).json({
                success: false,
                message: "Password is incorrect",
            })
        }

      
       

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Log in failure, please try again"
        })
    }
}

//changePassword
exports.changePassword = async (req, res) => {
    try {
      const userDetails = await User.findById(req.user.id);
  
      const { oldPassword, newPassword } = req.body;
  
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      );
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" });
      }
  
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      );
  
     
  
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Error occurred while updating password:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      });
    }
  };