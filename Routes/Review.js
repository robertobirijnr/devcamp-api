const express = require("express");
const {
    protect,
    authorize
} = require('../middleware/auth')
const advancedResults = require('../middleware/AdvancedResults')

const {
    getReviews
} = require("../Controllers/Reviews");
const Review = require("../models/Review");

const router = express.Router({
    mergeParams: true
});

router.route('/')
    .get(advancedResults(Review, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getReviews
    )


module.exports = router;