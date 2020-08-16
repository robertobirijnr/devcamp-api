const Bootcamp = require("../models/bootCamp");
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncAwait')

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find();
    res.status(200).json({
        total: bootcamp.length,
        success: true,
        data: bootcamp,
    });

})
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of${req.params.id}`, 404)
        )
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });

})

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp,
    });

})

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootCamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of${req.params.id}`, 404)
        )
    }
    res.status(200).json({
        success: true,
        data: bootCamp,
    });

})
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of${req.params.id}`, 404)
        )
    }
    res.status(200).json({
        success: true,
        data: {}
    })

})