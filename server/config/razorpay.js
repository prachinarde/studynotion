// Import Razorpay and dotenv
const Razorpay = require("razorpay");
require("dotenv").config();

// Initialize Razorpay instance
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY.trim(), // Trimming spaces just in case
    key_secret: process.env.RAZORPAY_SECRET.trim(),
});

