import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Data from "../CourseNames.json"; //helps get courseCode and title to be displayed in UI

import { useUser } from "../Context/UserContext"; //helps get the user's role and username from session

import StarRating from "../components/StarRating"; //https://www.youtube.com/watch?v=vnftyztz6ss (Star Widgets)
import { Toaster, toast, useSonner } from "sonner"; //https://www.youtube.com/watch?v=8JTrY1dlXCw&t=20s (POP UP Notifications)

import dayjs from "dayjs";

export default function ReviewDetails() {
  // Get the role of the current user, to help determine what will be displayed
  // Get the username of the current user, to be submitted when a review is created
  const { role, username } = useUser();

  /*-------------- START OF CODE USED TO TRACK AND SUBMIT FORM DATA --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  // State object to store course review data for submission to MongoDB
  const [formData, setFormData] = React.useState({
    grade: "",
    overallQuality: 0,
    simplicity: 0,
    courseRelevance: 0,
    instructionalEffectiveness: 0,
    writtenReview: "",
  });

  // Function to reset the form data if request by the user
  const resetRating = () => {
    setFormData({
      grade: "",
      overallQuality: 0,
      simplicity: 0,
      courseRelevance: 0,
      instructionalEffectiveness: 0,
      writtenReview: "",
    });
  };

  //Updates the starRating for the specific review metric "name" passed [E.G (name==simplicity)]
  const handleRatingChange = (newRating, name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newRating,
    }));
  };

  // Updates the `formData` state each time a change is made
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData, //return all the previous object data
        [event.target.name]: event.target.value, //and return the new value of the element which triggered the function
      };
    });
  }
  // Uncomment to view how `formData` changes as user enters input
  /* console.log(formData); */

  // Function called when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault(); //do not reload the page

    // username is stored in session storage when logged in
    // so cancel review submission if no username is found
    if (!username) {
      toast.error("Create Account or Sign In");
      return;
    }

    // Prevent form submission if the grade input is empty or any star ratings are missing
    if (
      formData.grade === "" ||
      formData.overallQuality === 0 ||
      formData.simplicity === 0 ||
      formData.courseRelevance === 0 ||
      formData.instructionalEffectiveness === 0
    ) {
      toast.error("Error: Fill all STRARED review options AND select grade");
      return;
    }

    // Check if user already submitted a review for this course
    // by looking through the `review` state object
    // which contains ALL the reviews loaded from the mongoDB
    const existingReview = reviews?.find(
      (review) => review.username === username
    );

    // If the user previously submitted a review, DELETE IT
    // if statement needs to be updated if user can overwrite (future implementation)
    if (existingReview) {
      toast.error("You can only create one review");
      return;
      // Delete the existing review before creating a new one
      /* const response = await fetch(`/api/review/${existingReview._id}`, {
        method: "DELETE",
      }); */

      /* const response = await fetch("/api/review/" + reviewID + "/vote", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, reviewID }),
      }); */

      //query to update stats table based on existing review
      //deleteReview(existingReview._id);

      /* if (response.ok) {
        toast.success("Success: Old Review Removed!");
      } else {
        toast.error("Error: Old Review Not Removed!");
        return; // Exit function if deletion fails
      } */
    }

    // Add the username field to updatedFormData
    // Add the courseCode from the `courseInfo` which contains the courseCode and title
    // updatedFormData is used instead of formData since formData can not be appended
    const updatedFormData = {
      ...formData,
      username: username, //username var comes from const { role, username } = useUser();
      coursecode: courseInfo.coursecode,
    };

    //Send POST request with the updatedFormData
    const response = await fetch("/api/review", {
      method: "POST",
      body: JSON.stringify(updatedFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // save the response given from mongoDB
    // will be used to update the user's UI with the record that was just sent to the dB
    const json = await response.json();

    // Print error if review data was not successfully saved to mongoDB
    if (!response.ok) {
      console.log(response);
    } else {
      // Reset formData
      setFormData({
        grade: "",
        overallQuality: 0,
        simplicity: 0,
        courseRelevance: 0,
        instructionalEffectiveness: 0,
        writtenReview: "",
      });

      toast.success("Success: Review addedd!");
      // Display new record that was added to the dB within the UI
      setReviews([json, ...reviews]);

      // Remove old review from the UI, if it existed
      if (existingReview) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== existingReview._id)
        );
      }
    }
  };

  //function to remove a review when ADMIN clicks on delete button
  const deleteReview = async (reviewID) => {
    const response = await fetch("api/review/" + reviewID, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("Success: Review Removed!");

      // Update the `reviews` state by removing the old review based on the reviewID
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewID)
      );
    } else {
      toast.error("Error: Review not removed");
    }
  };

  // Function to handle up-vote or down-vote for a review
  const handleVote = async (reviewID, username) => {
    // Do not allow person to like a review, if no one is logged in
    if (!username) {
      toast.error("Create Account or Sign In");
      return;
    }

    // Update the specific review that was liked, by adding the user's username to the "likes" array
    const response = await fetch("/api/review/" + reviewID + "/vote", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, reviewID }),
    });

    if (response.ok) {
      // Update local state to reflect the vote
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewID
            ? {
                ...review,
                likes: review.likes.includes(username)
                  ? review.likes.filter((like) => like !== username)
                  : [...review.likes, username],
              }
            : review
        )
      );
    }
  };

  /*-------------- END OF CODE USED TO TRACK AND SUBMIT FORM DATA --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  /*-------------- START OF CODE USED TO LOAD ALL REVIEW DATA  --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  // will contain all of the info pulled from the "reviews" collection based on courecode
  const [reviews, setReviews] = useState(null);

  // will contain the stats info based on coursecode
  const [stats, setStats] = React.useState({
    averageGrade: "?",
    averageOverallQuality: "?",
    averageSimplicity: "?",
    averageCourseRelevance: "?",
    averageInstructionalEffectiveness: "?",
    totalReviews: "N/A",
    passRate: "?",
  });

  // initial state for the course title and code.
  // Would be wise to make them blank and set it to this on not found but I aint doing all of that
  const [courseInfo, setCourseInfo] = useState({
    coursecode: "How did you get here?",
    title: "Course doesn't exist!",
  });

  useEffect(() => {
    const fetchReviews = async (query) => {
      /*--------------START OF NOTE FOR PRODUCTION PHASE OF CLASS CRITIC --------------*/
      /* https://www.youtube.com/watch?v=N4yUiQiTvwU 
      We must proxy api requests while developing, the proxy was site up in the vite.config
      Eventually, when we launch ClassCritic, the youtube link should help us configure the server for production*/
      /*--------------END OF NOTE FOR PRODUCTION PHASE OF CLASS CRITIC --------------*/

      /*-------------- START OF CODE USED TO LOAD ALL REVIEW DATA  --------------*/
      //Need to be able to pass query to back end
      //Add query to the slug
      const modifiedQuery = query.replace(/.*=/, "/");
      const courseRequest = "/api/review" + modifiedQuery;
      const response = await fetch(courseRequest);

      //IF data fetch was sucessful, the reviews object is populated with the data
      const json = await response.json();
      if (response.ok) {
        setReviews(json);
      }
    };

    const fetchStats = async (query) => {
      // Remove everything before the "=" and replace it with "/"
      // ?course=CODE1234 becomes CODE1234
      const modifiedQuery = query.replace(/.*=/, "/");
      const courseRequest = "/api/stats" + modifiedQuery; //slug + coursecode query (ie ?course=CODE1234)
      const response = await fetch(courseRequest);

      // IF data fetch was sucessful, the `stats` object is populated with the data
      const json = await response.json();
      if (response.ok) {
        setStats(json);
      } else if (!response.ok) {
        console.log("no  response");
      }
    };

    // function finds the corresponding class of the code queried from the CourseNames.json and sets the title and course code to that
    const fetchCourseInfo = (code, courseList) => {
      try {
        const foundCourse = courseList.find(
          (course) => course.coursecode === code
        );
        if (foundCourse) {
          setCourseInfo(foundCourse);
        } else {
          console.log(
            "There is literally no class with that code on this site"
          );
        }
      } catch (error) {
        console.error("OOPSIE in fetchCourseInfo:", error);
      }
    };

    //Gets query of the current url with ?
    const classquery = window.location.search;
    //next 2 lines strip query to just the code
    const url = new URLSearchParams(classquery);
    const courseCode = url.get("course");

    fetchCourseInfo(courseCode, Data);
    fetchReviews(classquery);
    fetchStats(classquery);
  }, []);

  /*-------------- END OF CODE USED TO LOAD ALL REVIEW DATA  --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  //converts quality point in dB to the relevant letter grade, right before the value is rendered
  const calculateLetterGrade = (averageGrade) => {
    if (averageGrade == 0) {
      return "F3";
    }

    const gradeCutoffMap = {
      "A+": 4.33,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      F1: 1.7,
      F2: 1.3,
      F3: 0.0,
    };

    // Round the averageGrade to one decimal place using Math.round()
    const roundedAverageGrade = Math.round(averageGrade * 10) / 10;

    // Iterate through the gradeCutoffMap to find the matching letter grade
    for (const letterGrade in gradeCutoffMap) {
      if (roundedAverageGrade >= gradeCutoffMap[letterGrade]) {
        return letterGrade;
      }
    }

    // If no match is found, return nothing
    return "N/A";
  };

  // converts createdAt time to #of days/months/years ago using dayjs() from the library daysjs
  const calculateTimeAgo = (createdAt) => {
    const createdDate = dayjs(createdAt);
    const daysAgo = dayjs().diff(createdDate, "days");

    if (daysAgo < 30) {
      return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
    } else if (daysAgo < 365) {
      const monthsAgo = Math.floor(daysAgo / 30);
      return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
    } else {
      const yearsAgo = Math.floor(daysAgo / 365);
      return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
    }
  };

  /*-------------- Modal Box Code --------------*/
  //Used to control modal box visibility (false = do  not show)
  const [modal, setModal] = useState(false);

  //Used to set modal box visibility
  const toggleModal = () => {
    setModal(!modal);
  };
  /*-------------- Modal Box Code --------------*/

  return (
    <div className="courseDetailsPage">
      <Toaster richColors position="top-right" />
      <div className="courseOutline">
        <div className="courseInfo">
          <h1 className="courseName">{courseInfo.title}</h1>
          <h2 className="courseCode">{courseInfo.coursecode}</h2>
        </div>
        <div className="reviewDetails">
          {stats && (
            <div className="reviewGradeStats">
              <div className="reviewGradeStat">
                <h3>Average Grade</h3>
                <h4>{calculateLetterGrade(stats.averageGrade)}</h4>
              </div>
              <div className="reviewGradeStat">
                <h3>Total Reviews</h3>
                <h4>{stats.totalReviews}</h4>
              </div>
              <div className="reviewGradeStat">
                <h3>Pass Rate</h3>
                <h4>{stats.passRate}%</h4>
              </div>
            </div>
          )}
          <div className="starReviewsAndWrittenReview">
            {stats && (
              <div className="starReviews">
                <div className="starReview">
                  <h3>Overall Quality</h3>
                  <div className="starIcon">
                    <h4>{stats.averageOverallQuality}/5</h4>
                  </div>
                </div>
                <div className="starReview">
                  <h3>Course Simplicity</h3>
                  <div className="starIcon">
                    <h4>{stats.averageSimplicity}/5</h4>
                  </div>
                </div>
                <div className="starReview">
                  <h3>Course Relevance</h3>
                  <div className="starIcon">
                    <h4>{stats.averageCourseRelevance}/5</h4>
                  </div>
                </div>
                <div className="starReview">
                  <h3>Instructional Effectiveness</h3>
                  <div className="starIcon">
                    <h4>{stats.averageInstructionalEffectiveness}/5</h4>
                  </div>
                </div>
              </div>
            )}
            <div className="writtenReviews">
              {reviews &&
                reviews.map(
                  (review) =>
                    review.writtenReview && ( //if writtenReview exists then display that record
                      <div className="writtenReviewDetails" key={review._id}>
                        <h5>
                          {review.username}
                          <span>{calculateTimeAgo(review.createdAt)}</span>
                        </h5>

                        <p>{review.writtenReview}</p>
                        {role === "admin" && (
                          <span onClick={() => deleteReview(review._id)}>
                            <CloseIcon />
                          </span>
                        )}
                        <div className="voteButton">
                          {/* If username is found in the likes array, diplay filled icon */}
                          {review.likes.includes(username) ? (
                            <ThumbUpIcon
                              id="upvote"
                              onClick={() => handleVote(review._id, username)}
                            />
                          ) : (
                            /* Else display outline of thumbs up icon */ <ThumbUpAltOutlinedIcon
                              id="upvote"
                              onClick={() => handleVote(review._id, username)}
                            />
                          )}
                          {/* Display num of saved username or 0 if likes array is empty */}
                          <span>{review.likes.length || 0}</span>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="submitReviewOutline">
        <form onSubmit={handleSubmit} id="myform">
          <h4>Your Grade:</h4>
          <div className="selectContainer">
            <select
              id="favColor"
              value={formData.grade}
              onChange={handleChange}
              name="grade"
              className="selectBox"
            >
              <option value="">Grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="F1">F1</option>
              <option value="F2">F2</option>
              <option value="F3">F3</option>
            </select>
            <div className="selectSerachIconContainer">
              <i>
                <KeyboardArrowDownIcon />
              </i>
            </div>
          </div>
          <h4>Overall Quality</h4>
          <StarRating
            rating={formData.overallQuality}
            onRating={handleRatingChange}
            name="overallQuality"
            value={formData.overallQuality}
          />

          <h4>Simplicity</h4>
          <StarRating
            rating={formData.simplicity}
            onRating={handleRatingChange}
            name="simplicity"
            value={formData.simplicity}
          />
          <h4>Coure Relevance</h4>
          <StarRating
            rating={formData.courseRelevance}
            onRating={handleRatingChange}
            name="courseRelevance"
            value={formData.courseRelevance}
          />
          <h4>Instructional Effectiveness</h4>
          <StarRating
            rating={formData.instructionalEffectiveness}
            onRating={handleRatingChange}
            name="instructionalEffectiveness"
            value={formData.instructionalEffectiveness}
          />
        </form>
        <button onClick={resetRating}>Reset Ratings</button>
        <button onClick={toggleModal} className="btn-modal">
          Write Review
        </button>
        {modal && (
          <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
              <div className="modalHeader">
                <div className="close-modal">
                  <CloseIcon onClick={toggleModal} />
                </div>
              </div>

              <textarea
                value={formData.writtenReview}
                placeholder="Enter text here..."
                onChange={handleChange}
                name="writtenReview"
              />
            </div>
          </div>
        )}

        <button type="submit " id="submit" form="myform">
          Submit Review
        </button>
      </div>
    </div>
  );
}
