const Review = require("../models/reviewModel");
const Stats = require("../models/statsModel");
const mongoose = require("mongoose");

//ONLY PAY ATTENTION TO getReviews() and createReview()
//since thats the only function i know works for sure right now
//GET ALL REVIEWS
const getReviews = async (req, res) => {
  //wrapping everything in try incase of any errors
  try {
    //getting code from the query passed from front-end
    //url/review?course=CODE getting the CODE part
    const code = req.query.course;
    console.log(code);

    if (!code) {
      //catching for if ?course isnt provided
      console.log("No course code provided");
    } else {
      //get the reviews which match this id
      const filter = {};
      filter.coursecode = code;
      const reviews = await Review.find(filter).sort({ createdAt: -1 });

      //find all of the review records and return them in acending order
      //const ALLreviews = await Review.find({}).sort({ createdAt: -1 });
      res.status(200).json(reviews);
    }
  } catch (error) {
    console.error("OOPS:", error);
  }
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
/* const createReview = async (req, res) => {

  const {
    grade,
    overallQuality,
    simplicity,
    courseRelevance,
    instructionalEffectiveness,
    writtenReview,
    username,
    coursecode,
  } = req.body;
  try {
    const review = await Review.create({
      grade,
      overallQuality,
      simplicity,
      courseRelevance,
      instructionalEffectiveness,
      writtenReview,
      username,
      coursecode,
    });
    
    res.status(200).json(review);
  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
}; */

/*-------------- START OF CODE USED TO SUBMIT FORM DATA --------------*/
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//Destructure the json data recieved
//Create a review document
//Call calculateReviewMetrics() creates or updates relevant document within stats collection
const createReview = async (req, res) => {
  try {
    const {
      grade,
      overallQuality,
      simplicity,
      courseRelevance,
      instructionalEffectiveness,
      writtenReview,
      username,
      coursecode,
    } = req.body;

    const newReview = await Review.create({
      grade,
      overallQuality,
      simplicity,
      courseRelevance,
      instructionalEffectiveness,
      writtenReview,
      username,
      coursecode,
    });

    // Calculate average for each metric after creating the review
    await calculateReviewMetrics(coursecode, newReview);

    res.status(200).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Function to calculate and update review metrics
const calculateReviewMetrics = async (coursecode, newReview) => {
  try {
    // Find the stats document for the corresponding coursecode
    let stats = await Stats.findOne({ coursecode });

    console.log(stats);

    // If stats document doesn't exist, create a new one
    if (!stats) {
      stats = new Stats({ coursecode });
    }

    // Calculate new average for each metric
    const totalReviews = stats.totalReviews ? stats.totalReviews + 1 : 1;
    stats.averageGrade =
      (stats.averageGrade * (totalReviews - 1) + newReview.grade) /
      totalReviews;
    stats.averageOverallQuality =
      (stats.averageOverallQuality * (totalReviews - 1) +
        newReview.overallQuality) /
      totalReviews;
    stats.averageSimplicity =
      (stats.averageSimplicity * (totalReviews - 1) + newReview.simplicity) /
      totalReviews;
    stats.averageCourseRelevance =
      (stats.averageCourseRelevance * (totalReviews - 1) +
        newReview.courseRelevance) /
      totalReviews;
    stats.averageInstructionalEffectiveness =
      (stats.averageInstructionalEffectiveness * (totalReviews - 1) +
        newReview.instructionalEffectiveness) /
      totalReviews;
    stats.totalReviews = totalReviews;

    // Save the updated stats document
    await stats.save();
  } catch (error) {
    console.error(error);
    // Handle errors appropriately, consider logging or retry logic
  }
};
/*-------------- END OF CODE USED TO SUBMIT FORM DATA --------------*/
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

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
