const Bootcamp = require('../models/bootCamp')

exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find()
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}



exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
};

exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
};

exports.updateBootcamp = (req, res, next) => {};

exports.deleteBootcamp = (req, res, next) => {};