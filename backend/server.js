const express = require("express");

const app = express();

//purpose of mongoose is to create a schema
const mongoose = require("mongoose");

//get all the created routes from this file
const reviewDetails = require("./routes/reviewDetails");

//passes data attached in body to the req object
app.use(express.json());
//middleware being used to log the path and type of request
app.use((req, res, next) => {
  console.log(req.path, req.method, req.originalUrl);
  next();
});

//localhost:4000/api/review/
app.use("/api/review",reviewDetails);

//connecting to the LOCAL mongodb
//https://youtu.be/s0anSjEeua8?si=0a8KFFrCu0mIbT1G&t=435
//Watch link when connecting to ATLAS instead of local db
mongoose
  .connect("mongodb://localhost:27017/classcritic")
  .then(() => {
    //only listen for requests once conneted to the db
    app.listen(4000, () => {
      console.log("conencted to local mongoDB & listening on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
