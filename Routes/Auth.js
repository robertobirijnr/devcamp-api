 const express = require('express')

 const {
     register
 } = require('../Controllers/auth');

 const router = express.Router()

 router.route('/register').post(register)

 module.exports = router;