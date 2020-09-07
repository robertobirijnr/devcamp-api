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

//Prevent user from submitting more than one review per bootcamp
ReviewSchame.index({
    bootcamp: 1,
    user: 1
}, {
    unique: true
});

//calculate average cost of course

ReviewSchame.statics.getAverageRating = async function (bootcampId) {
    // console.log('calculate avg cost...'.bue)

    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }
    ])
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: (obj[0].averageRating / 10) * 10
        })
    } catch (err) {
        console.error(err);
    }
}

//call getAverageCost after save
ReviewSchame.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp)
})

ReviewSchame.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp)
})



module.exports = mongoose.model('Review', ReviewSchame)