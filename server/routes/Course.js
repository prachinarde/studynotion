const express = require("express");
const router = express.Router();

const { createCourse,  getAllCourses, getCoursesDetails, deleteCourse, getInstructorCourses, getFullCourseDetails, editCourse } = require("../controllers/Course");

const { createCategory, showAllCategories, categoryPageDetails, deleteCategory} = require("../controllers/Category");

const { createSection, updateSection, deleteSection } = require("../controllers/Section");

const { updateSubSection, createSubSection, deleteSubSection} = require("../controllers/Subsection");

const { createRating, getAverageRating, getAllRatingReview } = require("../controllers/RtingAndReview");

const { updateCourseProgress } = require("../controllers/courseProgress");

const { isInstructor, auth, isStudent, isAdmin } = require("../middleware/auth");



router.post("/createCourse", auth, isInstructor, createCourse);

router.post("/editCourse", auth, isInstructor, editCourse);

router.post("/addSection", auth, isInstructor, createSection);

router.post("/updateSection", auth, isInstructor, updateSection);

router.post("/deleteSection", auth, isInstructor, deleteSection);

router.post("/updateSubSection", auth, isInstructor, updateSubSection);

router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/addSubSection", auth, isInstructor,  createSubSection);
//router.post("/getAllSubSection", auth, isInstructor, getAllSubsections);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

router.get("/getAllCourses", getAllCourses);

router.post("/getCourseDetails", getCoursesDetails);

router.post("/getFullCourseDetails", auth, getFullCourseDetails);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

router.delete("/deleteCourse", deleteCourse);

// Category routes (Only by Admin)

router.post("/createCategory", auth, isAdmin, createCategory);

router.get("/showAllCategories", showAllCategories);


router.post("/getCategoryPageDetails", categoryPageDetails);

router.delete("/deleteCategory", auth, isAdmin, deleteCategory)

//rating and review

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
