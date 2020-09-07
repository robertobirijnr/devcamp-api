const mongoose = require('mongoose');


const ReviewSchame = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add  title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'please rate between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})



module.exports = mongoose.model('Review', ReviewSchame)