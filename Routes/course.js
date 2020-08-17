const express = require("express");
const {
    getCourses,
    getSingleCourse,
    createCourse
} = require("../Controllers/course");

const router = express.Router({
    mergeParams: true
});

router.route('/').get(getCourses).post(createCourse)
router.route('/:id')
    .get(getSingleCourse)


module.exports = router;