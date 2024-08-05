const Review = require("../models/reviewModel");
const mongoose = require("mongoose");

//ONLY PAY ATTENTION TO getReviews()
//since thats the only function i know works for sure right now
//GET ALL REVIEWS
const getReviews = async (req, res) => {
  //find all of the review records and return them in acending order
  const reviews = await Review.find({}).sort({ createdAt: -1 });

  res.status(200).json(reviews);
};

//function to get a single review (probly wont be used)
const getReview = async (req, res) => {
  //this is how you get the id from the url
  const { id } = req.params;

  //if it doesnt pass the long ass objectID naturally created by mongo OR
  //the id simply does not exist then tell them it doesnt exist
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such review" });
  }

  //new mongoose.Types.ObjectId(id) used to convert the id into a valid objectID
  const review = await Review.findById(new mongoose.Types.ObjectId(id));

  //if review id not found, exit the code with the error
  if (!review) {
    return res.status(404).json({ error: "This review does not exist" });
  }

  res.status(200).json(review);
};
//function used to create a review
const createReview = async (req, res) => {
  //destructure from json
  const {
    grade,
    overallQuality,
    simplicity,
    courseRelevance,
    instructionalEffectiveness,
  } = req.body;
  //this adds a review to the db
  //NEED TO UPDATE THIS TO REFLECT WHAT I ACTUALLY WANT SAVED, SUCH AS COURSECODE, USERID
  try {
    const review = await Review.create({
      grade,
      overallQuality,
      simplicity,
      courseRelevance,
      instructionalEffectiveness,
    });
    //if it works then send back a 200 stat as well as what was submitted
    res.status(200).json(review);
  } catch (error) {
    //else send back a 400 and display the error message
    res.status(400).json({ error: error.message });
  }
};

//to delete a review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such review" });
  }

  //find and delete the review based on the id passed
  const review = await Review.findOneAndDelete({ _id: id });

  //if review id not found, exit the code with the error
  if (!review) {
    return res.status(404).json({
      error: "This review does not exist and therefore cannot be deleted",
    });
  }

  //show the review that was just deleted
  res.status(200).json(review);
};

//update a review
const updateReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such review" });
  }

  const review = await Review.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!review) {
    return res.status(404).json({
      error: "This review does not exist and therefore cannot be updated",
    });
  }

  res.status(200).json(review);
};

//this is where you export the functions to be used in another file
module.exports = {
  createReview,
  getReviews,
  getReview,
  deleteReview,
  updateReview,
};
