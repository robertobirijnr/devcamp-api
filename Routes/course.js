const express = require("express");
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
    .post(createCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse)


module.exports = router;