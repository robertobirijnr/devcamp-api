const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncAwait");
const Reviews = require("../models/Review")
const Bootcamps = require('../models/bootCamp')


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

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Reviews.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(
            new ErrorResponse(`No review found with the id of ${req.params.id}`, 404),

        )
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamps.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `No bootcamp with the id of ${req.params.bootcampId}`, 404
            )
        )
    }
    const review = await Reviews.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    })
})

exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(
                `No Review with the id of ${req.params.id}`, 404
            )
        )
    }

    //make sure review belongs to user
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `Not authorized to perform this task`, 401
            )
        )
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    })
})

exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(
                `No Review with the id of ${req.params.id}`, 404
            )
        )
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to perform this action'), 401)
    }

    await review.remove();

    res.status(200).json({
        success: true,
        data: {}
    })

})