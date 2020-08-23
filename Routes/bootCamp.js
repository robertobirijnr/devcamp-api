const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../Controllers/bootCamp");


const Bootcamp = require('../models/bootCamp');
const advancedResults = require('../middleware/AdvancedResults');
const {
  protect
} = require('../middleware/auth')


//include other resource routers
const courseRouter = require('./course')

const router = express.Router();

router
  .route('/:id/photo')
  .put(protect, bootcampPhotoUpload);


//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)


router.route("/")
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;