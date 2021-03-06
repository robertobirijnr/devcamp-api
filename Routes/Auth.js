 const express = require('express')
 const {
     protect
 } = require('../middleware/auth')
 const {
     register,
     login,
     getMe,
     forgotPassword,
     resetPassword,
     updateProfile,
     updatePassword,
     logout
 } = require('../Controllers/auth');

 const router = express.Router()

 router.route('/register').post(register)
 router.route('/login').post(login)
 router.route('/logout').get(logout)
 router.route('/me').get(protect, getMe)
 router.route('/updateprofile').put(protect, updateProfile)
 router.route('/updatepassword').put(protect, updatePassword)
 router.post('/forgotpassword', forgotPassword)
 router.put('/resetpassword/:resettoken', resetPassword)

 module.exports = router;