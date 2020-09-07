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
  protect,
  authorize
} = require('../middleware/auth')


//include other resource routers
const courseRouter = require('./course')
const reviewRouter = require('./Review')

const router = express.Router();

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);


//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)


router.route("/")
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;