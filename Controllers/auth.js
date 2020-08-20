const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncAwait");
const User = require('../models/user')


exports.register = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    const token = user.getSignJWTtoken();

    res.status(200).json({
        success: true,
        token
    })
})

exports.login = asyncHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    //validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400))
    }

    //chek for user
    const user = await User.findOne({
        email
    }).select('+password')

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    //check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    const token = user.getSignJWTtoken();

    res.status(200).json({
        success: true,
        token
    })
})