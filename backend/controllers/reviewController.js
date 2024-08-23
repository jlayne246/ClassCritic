const Review = require("../models/reviewModel");
const Stats = require("../models/statsModel");
const mongoose = require("mongoose");

// GET ALL REVIEWS FOR A SPECIFIC COURSE
const getReviews = async (req, res) => {
  try {
    // course code is stored within the id field of req.params
    const { id } = req.params;

    if (!id) {
      // catching for if ?course isnt provided
      console.log("No course code provided");
    } else {
      // get the reviews which match this id, sort from most recent
      const filter = {};
      filter.coursecode = id;
      const reviews = await Review.find(filter).sort({ createdAt: -1 });

      // respond with ok status and a json of the results
      res.status(200).json(reviews);
    }
  } catch (error) {
    console.error("Error occured while fetching all course reviews:", error);
  }
};

// Find a single review, using the username as a filter
const getReview = async (req, res) => {
  // this is how you get the username from the url, since the req object would sent it as id:'username-value'
  const { id } = req.params;

  const review = await Review.findOne({ username: id });

  //if review is not found, exit the code with the error
  if (!review) {
    return res.status(404).json({ error: "This review does not exist!" });
  }

  // respond with ok status and a json of the result
  res.status(200).json(review);
};

/*-------------- START OF CODE USED TO SUBMIT FORM DATA --------------*/
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//Call calculateReviewMetrics() creates or updates relevant document within stats collection
const createReview = async (req, res) => {
  try {
    //Destructure the json data that was passed in the req.body
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

    // Create a review document using the data that was passed
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
    console.error("Failed to create the new review " + error);
    res.status(400).json({ error: error.message });
  }
};
// function to change the letter grade to the appropriate quality point
const convertGrade = (averageGrade) => {
  if (averageGrade == null) {
    return 0;
  }

  const gradeMap = {
    "A+": 4.33,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    F1: 1.0,
    F2: 0.7,
    F3: 0.0,
  };

  // Return the conversion value or default to 0 if grade is not found
  return gradeMap[averageGrade.trim()] || 0;
};

const calculateReviewMetrics = async (coursecode, newReview) => {
  try {
    // Find the stats document for the corresponding coursecode
    let stats = await Stats.findOne({ coursecode });

    // convert the letter grade to the relevant quality point
    let convertedLetterGrade = convertGrade(newReview.grade);

    // If stats document doesn't exist, create a new one
    if (!stats) {
      stats = new Stats({ coursecode });
    }

    // Calculate new average for each metric with rounding
    const totalReviews = stats.totalReviews ? stats.totalReviews + 1 : 1;
    stats.averageGrade =
      (stats.averageGrade * (totalReviews - 1) + convertedLetterGrade) /
      totalReviews;
    stats.averageOverallQuality = Math.round(
      (stats.averageOverallQuality * (totalReviews - 1) +
        newReview.overallQuality) /
        totalReviews
    );
    stats.averageSimplicity = Math.round(
      (stats.averageSimplicity * (totalReviews - 1) + newReview.simplicity) /
        totalReviews
    );
    stats.averageCourseRelevance = Math.round(
      (stats.averageCourseRelevance * (totalReviews - 1) +
        newReview.courseRelevance) /
        totalReviews
    );
    stats.averageInstructionalEffectiveness = Math.round(
      (stats.averageInstructionalEffectiveness * (totalReviews - 1) +
        newReview.instructionalEffectiveness) /
        totalReviews
    );
    stats.totalReviews = totalReviews;

    // Track number of people who passed (excluding F1, F2, F3 grades)
    const passingGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-"];
    let numPassed = stats.numPassed || 0; // Initialize numPassed if it doesn't exist
    if (passingGrades.includes(newReview.grade)) {
      numPassed++;
    }

    // Calculate and update pass rate as a percentage
    stats.passRate = Math.round((numPassed / totalReviews) * 100);
    stats.totalReviews = totalReviews;
    stats.numPassed = numPassed;

    // Save the updated stats document
    await stats.save();
  } catch (error) {
    console.error(
      "Something went wong while trying to compute the stats " + error
    );
  }
};
/*-------------- END OF CODE USED TO SUBMIT FORM DATA --------------*/
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// remove one review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such review" });
  }

  // Find the review to be deleted
  const reviewToDelete = await Review.findById(new mongoose.Types.ObjectId(id));

  if (!reviewToDelete) {
    return res.status(404).json({
      error: "This review does not exist and therefore cannot be deleted",
    });
  }

  try {
    // Update the corresponding stats document before deleting the review
    await updateStatsAfterReviewDeletion(
      reviewToDelete.coursecode,
      reviewToDelete
    );

    // Delete the review
    const deletedReview = await Review.findOneAndDelete({ _id: id });

    res.status(200).json(deletedReview);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

const handleVote = async (req, res) => {
  const { username, reviewId } = req.body;

  try {
    const { id } = req.params;
    // Find the review document based on the review objectID
    const review = await Review.findById(new mongoose.Types.ObjectId(id));
    if (!review) {
      throw new Error("Review not found");
    }

    // Create the 'likes' array if it doesn't exist
    if (!review.likes) {
      review.likes = [];
      console.log("array created");
    }

    // If the username is not  found within the "likes" array, add it
    if (!review.likes.includes(username)) {
      review.likes.push(username);
    } else {
      // the username exists within the "likes" array, so we will remove it
      review.likes = review.likes.filter((like) => like !== username);
    }

    // Save the updated review
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    //
  }
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

const updateStatsAfterReviewDeletion = async (coursecode, deletedReview) => {
  // Find the stats document for the corresponding coursecode
  const stats = await Stats.findOne({ coursecode });

  if (!stats) {
    console.error("Stats document not found for coursecode:", coursecode);
    return; // No stats document to update
  }

  // converted from letter to quality point
  let convertedLetterGrade = convertGrade(deletedReview.grade);

  // Decrement total reviews count
  stats.totalReviews--;

  // Recalculate average metrics without the deleted review (consider edge cases like there being only one review)
  if (stats.totalReviews > 0) {
    stats.averageGrade =
      (stats.averageGrade * (stats.totalReviews + 1) - convertedLetterGrade) /
      stats.totalReviews; // Subtract 1 for deleted review

    stats.averageOverallQuality = Math.round(
      (stats.averageOverallQuality * (stats.totalReviews + 1) -
        deletedReview.overallQuality) /
        stats.totalReviews
    );
    stats.averageSimplicity = Math.round(
      (stats.averageSimplicity * (stats.totalReviews + 1) -
        deletedReview.simplicity) /
        stats.totalReviews
    );
    stats.averageCourseRelevance = Math.round(
      (stats.averageCourseRelevance * (stats.totalReviews + 1) -
        deletedReview.courseRelevance) /
        stats.totalReviews
    );
    stats.averageInstructionalEffectiveness = Math.round(
      (stats.averageInstructionalEffectiveness * (stats.totalReviews + 1) -
        deletedReview.instructionalEffectiveness) /
        stats.totalReviews
    );

    // Update pass rate if necessary (assuming deleted review had a passing grade)
    const passingGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-"];
    if (passingGrades.includes(deletedReview.grade) && stats.numPassed > 0) {
      stats.numPassed--;
    }
    stats.passRate = Math.round((stats.numPassed / stats.totalReviews) * 100);
  } else {
    // Handle edge case of deleting the only review (set averages to 0)
    stats.averageGrade = 0;
    stats.averageOverallQuality = 0;
    stats.averageSimplicity = 0;
    stats.averageCourseRelevance = 0;
    stats.averageInstructionalEffectiveness = 0;
    stats.numPassed = 0;
    stats.passRate = 0;
  }

  // Save the updated stats document
  await stats.save();
};

//this is where you export the functions to be used in another file
module.exports = {
  createReview,
  getReviews,
  getReview,
  deleteReview,
  updateReview,
  handleVote,
  updateStatsAfterReviewDeletion,
};
