 const express = require('express')
 const {
     protect
 } = require('../middleware/auth')
 const {
     register,
     login,
     getMe,
     forgotPassword,
     resetPassword
 } = require('../Controllers/auth');

 const router = express.Router()

 router.route('/register').post(register)
 router.route('/login').post(login)
 router.route('/me').get(protect, getMe)
 router.post('/forgotpassword', forgotPassword)
 router.put('/resetpassword/:resettoken', resetPassword)

 module.exports = router;