const express = require("express");
const {
    protect,
    authorize
} = require('../middleware/auth')

const advancedResults = require('../middleware/AdvancedResults');

const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require("../Controllers/admin");
const user = require("../models/user");


const router = express.Router({
    mergeParams: true
});

router.use(protect)
router.use(authorize('admin'))

router
    .route('/')
    .get(advancedResults(user), getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router;