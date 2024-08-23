const express = require("express");
const router = express.Router();

//get the functions from the reviewController
const {
  createReview,
  getReviews,
  getReview,
  deleteReview,
  updateReview,
  handleVote,
} = require("../controllers/reviewController");

//To return all the relevant reviews based on the courseCode passed in the url
router.get("/:id", getReviews);

//Used to determine if a user has submitted a review
router.get("/:id/user", getReview);

//This would be used to post a review
router.post("/", createReview);

//This would be eventually used to delete a review
router.delete("/:id", deleteReview);

router.patch("/:id/vote", handleVote);

//This would be eventually used to update a review, IDK YET
router.patch("/:id", updateReview);

//Instead of bloating the file as shown below, all the function are created in the controller file
//then imported
/* router.patch("/:id", (req, res) => {
    res.json({ mssg: "Update a review" });
  }); */

module.exports = router;
