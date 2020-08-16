const Bootcamp = require("../models/bootCamp");
const ErrorResponse = require('../utils/errorResponse')

exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({
            total: bootcamp.length,
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        next(err)
    }
};

exports.getBootcamp = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(
            err
        )
    }
};

exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        next(err)
    }
};

exports.updateBootcamp = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err)
    }
};

exports.deleteBootcamp = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err)
    }
};