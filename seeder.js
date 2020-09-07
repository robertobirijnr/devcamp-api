const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')


dotenv.config({
    path: './config/config.env'
});

const Bootcamp = require('./models/bootCamp');
const Course = require('./models/course')
const User = require('./models/user')
const Review = require('./models/Review')


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const bootCamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'))


const importData = async () => {
    try {
        await Bootcamp.create(bootCamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.create()
        await Review.deleteMany()
        console.log('Data Deleted...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}


if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}