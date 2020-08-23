const express = require("express");
const {
    protect,
    authorize
} = require('../middleware/auth')

const {
    getCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../Controllers/course");

const router = express.Router({
    mergeParams: true
});

router.route('/')
    .get(getCourses)
    .post(protect, authorize('publisher', 'admin'), createCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)


module.exports = router;