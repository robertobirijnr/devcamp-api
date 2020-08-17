const Bootcamp = require("../models/bootCamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncAwait");
const geocoder = require("../utils/geocoder");
const {
    Query
} = require("mongoose");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = {
        ...req.query
    };

    //fields to exclude
    const removeField = ['select,sort,page,limit'];


    //loop over removefields and delete them from reqQuery
    removeField.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(req.query);

    //create operators ($gt,$gte etc)
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    //Finding resources
    query = Bootcamp.find(JSON.parse(queryStr));

    //Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    const page = parseInt(req, query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const bootcamp = await query;

    //pagination results
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }


    res.status(200).json({
        total: bootcamp.length,
        success: true,
        pagination,
        data: bootcamp,

    });
});


exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootCamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: bootCamp,
    });
});
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: {},
    });
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ],
            },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});