const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncAwait");
const User = require('../models/user')


exports.register = asyncHandler(async (req, res, next) => {
   const {name,email,password,role} = req.body;

   const user = await User.create({
       name,email,password,role
   })

   res.status(200).json({success:true})
})