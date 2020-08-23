const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");
const colors = require("colors");
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')

dotenv.config({
  path: "./config/config.env",
});

//connect to database
connectDb();

const app = express();

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())
app.use(fileupload())
//import route files
const bootcamps = require("./Routes/bootCamp");
const courses = require("./Routes/course");
const Authentication = require("./Routes/Auth");
const Admin = require("./Routes/admin");


//mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", Authentication);
app.use("/api/v1/admin", Admin);


app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  //close server
  server.close(() => process.exit(1));
});