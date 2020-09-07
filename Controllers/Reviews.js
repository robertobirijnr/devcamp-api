const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncAwait");
const Reviews = require("../models/Review")


exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Reviews.find({
            bootcamp: req.params.bootcampId
        })

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults)
    }



})