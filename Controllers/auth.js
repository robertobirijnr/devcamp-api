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

    sendTokenResponse(user, 200, res)
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

    sendTokenResponse(user, 200, res)

    res.status(200).json({
        success: true,
        token
    })
})

//Forgot password 
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404))
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave: false
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

//get token from model, create cookie and send respond
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignJWTtoken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

//get current login user
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})