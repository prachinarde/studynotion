const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async(req, res, next)=> {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",

            });
        }
        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            })
        }
        next();
    
    
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }

}

//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType!== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only"
            });
        }
        next();

    }catch{
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })

    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType!== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only"
            });
        }
        next();

    }catch{
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })

    }
}
