// Import required modules and models
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
const mongoose = require("mongoose");

// Function to capture payment
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;

    // Validate courses input
    if (!courses || courses.length === 0) {
        return res.status(400).json({ success: false, message: "Please Provide Course ID(s)" });
    }

    try {
        let total_amount = 0;

        // Loop through each course and calculate the total amount
        for (const course_id of courses) {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the Course" });
            }
            
            // Check if the student is already enrolled
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            total_amount += course.price;
        }

        // Create Razorpay order
        const options = {
            amount: total_amount * 100, // Razorpay amount is in paise
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
        };

        const paymentResponse = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            data: paymentResponse,
        });

    } catch (error) {
        console.error("Error in capturing payment:", error);
        return res.status(500).json({ success: false, message: "Could not initiate order." });
    }
};

// Function to verify payment
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    // Validate input data
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(400).json({ success: false, message: "Payment Failed: Missing required information" });
    }

    try {
        // Verify signature
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment Verification Failed" });
        }

        // Enroll students in courses
        await enrollStudents(courses, userId);

        return res.status(200).json({ success: true, message: "Payment Verified and Students Enrolled" });

    } catch (error) {
        console.error("Error in verifying payment:", error);
        return res.status(500).json({ success: false, message: "Payment Verification Failed" });
    }
};

// Function to send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    // Validate input data
    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the details" });
    }

    try {
        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        );

        return res.status(200).json({ success: true, message: "Payment success email sent" });

    } catch (error) {
        console.error("Error in sending payment success email:", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};

// Helper function to enroll students in courses
const enrollStudents = async (courses, userId) => {
    for (const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                throw new Error("Course not found");
            }

            console.log("Updated course: ", enrolledCourse);

            // Create course progress entry
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            // Update user with enrolled course and progress
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            console.log("Enrolled student: ", enrolledStudent);

            // Send enrollment email
            await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            );

            console.log("Enrollment email sent successfully");

        } catch (error) {
            console.error("Error in enrolling student:", error);
            throw new Error(`Failed to enroll in course ${courseId}: ${error.message}`);
        }
    }
};
