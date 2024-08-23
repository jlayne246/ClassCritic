const mongoose = require("mongoose");

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
      type: Number,
      require: true,
    },
    simplicity: {
      type: Number,
      require: true,
    },
    courseRelevance: {
      type: Number,
      require: true,
    },
    instructionalEffectiveness: {
      type: Number,
      require: true,
    },
    writtenReview: {
      type: String,
      require: false,
    },
    username: {
      type: String,
      require: true,
    },
    coursecode: {
      type: String,
      require: false,
    },
    likes: {
      type: [String], // Array of usernames who liked this review
      require: false,
    },
  },
  { timestamps: true }
);

//Export the schema that was created above
module.exports = mongoose.model("review", reviewSchema);
