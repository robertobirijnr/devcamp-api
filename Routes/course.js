const express = require("express");
const {
    getCourses
} = require("../Controllers/course");

const router = express.Router({
    mergeParams: true
});

router.route('/').get(getCourses)


module.exports = router;