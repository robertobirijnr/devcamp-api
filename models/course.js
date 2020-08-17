const mongoose = require('mongoose');


const CourseSchame = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition fees']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }

})

//calculate average cost of course

CourseSchame.statics.getAverageCost = async function (bootcampId) {
    console.log('calculate avg cost...'.bue)

    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {
                    $avg: '$tuition'
                }
            }
        }
    ])
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (err) {
        console.error(err);
    }
}

//call getAverageCost after save
CourseSchame.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp)
})

CourseSchame.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchame)