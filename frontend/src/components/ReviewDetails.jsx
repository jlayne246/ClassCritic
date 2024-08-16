//add toast
//add functionality to calculate grades

import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Data from "../CourseNames.json";
//https://www.youtube.com/watch?v=vnftyztz6ss
import StarRating from "../components/StarRating";

export default function ReviewDetails() {
  const handleRatingChange = (newRating, name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newRating,
    }));
  };

  //Any error sent from dB is stored in formErrorOrSuccess and displayed in Ui
  const [formErrorOrSuccess, setErrorOrSuccess] = useState(null);

  /*-------------- START OF CODE USED TO TRACK AND SUBMIT FORM DATA --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  //figure out how to refrence, based on a id

  //formData object containing json to be inserted into MongoDB
  const [formData, setFormData] = React.useState({
    grade: "",
    overallQuality: 0,
    simplicity: 0,
    courseRelevance: 0,
    instructionalEffectiveness: 0,
    writtenReview: "",
  });

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

  //Each time a change is made to any input field, update what is stored in formData
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData, //return all the previous object data
        [event.target.name]: event.target.value, //and return the new value of the input box that was altered
      };
    });
  }

  //Uncomment to view what is stored in formData as it is updated by user input
  /* console.log(formData); */

  //Function called when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault(); //do not reload the page

    //Cancel submission if the user has not selected all of the star reviews
    if (
      formData.grade === "" ||
      formData.overallQuality === 0 ||
      formData.simplicity === 0 ||
      formData.courseRelevance === 0 ||
      formData.instructionalEffectiveness === 0
    ) {
      setErrorOrSuccess(
        "Please fill in all required fields before submitting the review."
      );
      return;
    }

    //Get the courseCode from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get("course");

    // Add the userName field to updatedFormData (MUST BE ADJUSTED TO DYNAMICALLY GET THE APPROPRIATE NAME)
    // Add the courseCode from the URL to updatedFormData
    // updatedFormData is used instead of formData since formData can not be appended
    const updatedFormData = {
      ...formData,
      username: "test",
      coursecode: courseCode,
    };

    //Send POST request with the updatedFormData
    const response = await fetch("/api/review", {
      method: "POST",
      body: JSON.stringify(updatedFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //I may end up removing this line, it may not be necessary
    const json = await response.json();

    //Print the error if failed or Reset formData if the POST request was sucessful
    if (!response.ok) {
      setErrorOrSuccess(json.error);
    } else {
      /* console.log("A review has been added to the db using the front-end"); */
      setFormData({
        grade: "",
        overallQuality: 0,
        simplicity: 0,
        courseRelevance: 0,
        instructionalEffectiveness: 0,
        writtenReview: "",
      });

      setErrorOrSuccess("A review was added to the dB");
      //Display the new record that was added to the dB within the UI
      setReviews([...reviews, json]);
    }
  };

  //function to remove a review
  const deleteReview = async (reviewID) => {
    const response = await fetch("api/review/" + reviewID, {
      method: "DELETE",
    });
    console.log(reviewID);

    const json = await response.json();

    if (response.ok) {
      setErrorOrSuccess("A review was deleted from dB");

      // Update the reviews state directly using the review ID
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== reviewID)
      );
    } else {
      setErrorOrSuccess("Failed to remove review");
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

  //reviews will contain all of the info pulled from the "reviews" collection
  const [reviews, setReviews] = useState(null);

  //initial state for the course title and code.
  //Would be wise to make them blank and set it to this on not found but I aint doing all of that
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

      //Need to be able to pass query to back end
      //Add query to the slug
      const courseRequest = "/api/review" + query; //slug + coursecode query (ie ?course=CODE1234)
      const response = await fetch(courseRequest);

      //IF data fetch was sucessful, the reviews object is populated with the data
      const json = await response.json();
      if (response.ok) {
        setReviews(json);
      }
    };

    //This function finds the corresponding class of the code queried from the CourseNames.json and sets the title and course code to that
    const fetchCourseInfo = (code, courseList) => {
      try {
        const foundCourse = courseList.find(
          (course) => course.coursecode === code
        );
        if (foundCourse) {
          setCourseInfo(foundCourse);
          console.log("Course that was set:", foundCourse);
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
  }, []);

  /*-------------- END OF CODE USED TO LOAD ALL REVIEW DATA  --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

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
      <div className="courseOutline">
        <div className="courseInfo">
          <h1 className="courseName">{courseInfo.title}</h1>
          <h2 className="courseCode">{courseInfo.coursecode}</h2>
        </div>
        <div className="reviewDetails">
          <div className="reviewGradeStats">
            <div className="reviewGradeStat">
              <h3>Average Grade</h3>
              <h4>B</h4>
            </div>
            <div className="reviewGradeStat">
              <h3>Median Grade</h3>
              <h4>B+</h4>
            </div>
            <div className="reviewGradeStat">
              <h3>Pass Rate</h3>
              <h4>70%</h4>
            </div>
          </div>
          <div className="starReviewsAndWrittenReview">
            <div className="starReviews">
              <div className="starReview">
                <h3>Overall Quality</h3>
                <div className="starIcon">
                  <h4>5/5</h4>
                </div>
              </div>
              <div className="starReview">
                <h3>Course Simplicity</h3>
                <div className="starIcon">
                  <h4>5/5</h4>
                </div>
              </div>
              <div className="starReview">
                <h3>Course Relevance</h3>
                <div className="starIcon">
                  <h4>5/5</h4>
                </div>
              </div>
              <div className="starReview">
                <h3>Instructional Effectiveness</h3>
                <div className="starIcon">
                  <h4>5/5</h4>
                </div>
              </div>
            </div>
            <div className="writtenReviews">
              {reviews &&
                reviews.map(
                  (review) =>
                    review.writtenReview && ( //if writtenReview exists then display that record
                      <div className="writtenReviewDetails" key={review._id}>
                        <h5>{review.username}</h5>
                        <p>{review.writtenReview}</p>
                        <span onClick={() => deleteReview(review._id)}>
                          <CloseIcon />
                        </span>
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
        <button onClick={toggleModal} className="btn-modal">
          Write Review
        </button>
        <button type="submit " id="submit" form="myform">
          Submit Review
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
        <button onClick={resetRating}>Reset Ratings</button>
        {/*Show error OR success*/}
        {formErrorOrSuccess && (
          <div className="errorOrSuccess">{formErrorOrSuccess}</div>
        )}
      </div>
    </div>
  );
}
