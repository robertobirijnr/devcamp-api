const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncAwait");
const User = require('../models/user')


//get all users 
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

//get single user
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

//create user
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(200).json({
        success: true,
        data: user
    })
})

//update user
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

//delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: {}
    })
})