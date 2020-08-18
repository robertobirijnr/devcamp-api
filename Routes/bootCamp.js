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


//include other resource routers
const courseRouter = require('./course')

const router = express.Router();

router
  .route('/:id/photo')
  .put(bootcampPhotoUpload);


//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius)


router.route("/")
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;