const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description "],

        maxlength: [500, "Name can not be more than 500 characters"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use valid url with http or https",
        ],
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number can not be longer than 20"],
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter valid email",
        ],
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],

            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Other",
        ],
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must me be atleast 1'],
        max: [10, 'Rating must be atmost 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGurantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

//create bootcamp slug from name
BootcampSchema.pre("save", function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});

//GEOCODE AND CREATE LOCATION FIELD
BootcampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode

    }
    //donot save address in DB
    this.address = undefined
    next()
})

//casecade delete courses when bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
    await this.model('Course').deleteMany({
        bootcamp: this._id
    })
    next();
});

//Reverse Populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})

module.exports = mongoose.model("Bootcamp", BootcampSchema);