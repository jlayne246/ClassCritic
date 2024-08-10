const mongoose = require("mongoose");
const review = require("../models/reviewModel");

const Schema = mongoose.Schema;

//defines what should be submitted when a user completes a review,
//THIS NEEDS TO BE UPDATED WHEN I ACUTALLY WANT A USER TO SUBMIT A REVIEW
const reviewSchema = new Schema(
  {
    grade: {
      type: String,
      require: true,
    },
    overallQuality: {
      type: String,
      require: true,
    },
    simplicity: {
      type: String,
      require: true,
    },
    courseRelevance: {
      type: String,
      require: true,
    },
    instructionalEffectiveness: {
      type: String,
      require: true,
    },
    writtenReview: {
      type: String,
      require: false,
    },
    username: {
      type: String,
      require: false,
    },
    coursecode: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);
//check models vid
//this may create a "reviews" collection
//based on my understading, i believe i would need to pass the userID and coursecode
module.exports = mongoose.model("review", reviewSchema);
