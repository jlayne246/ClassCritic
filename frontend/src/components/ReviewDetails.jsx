import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useEffect, useState } from "react";
import Data from "../CourseNames.json";

export default function CourseDetails() {
  /*-------------- START OF CODE USED TO TRACK AND SUBMIT FORM DATA --------------*/
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  //refresh page
  //figure out how to refrence, based on a id

  //formData object containing json to be inserted into MongoDB
  const [formData, setFormData] = React.useState({
    grade: "",
    overallQuality: "",
    simplicity: "",
    courseRelevance: "",
    instructionalEffectiveness: "",
    writtenReview: "",
  });

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

    //Get the courseCode from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get("course");
    //console.log(courseCode);

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
      /*  body: JSON.stringify(formData), */
      body: JSON.stringify(updatedFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //I may end up removing this line, it may not be necessary
    const json = await response.json();

    //Reset formData if the POST request was sucessful
    if (response.ok) {
      console.log("A review has been added to the db using the front-end");
      setFormData({
        grade: "",
        overallQuality: "",
        simplicity: "",
        courseRelevance: "",
        instructionalEffectiveness: "",
        writtenReview: "",
      });
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
  const [modal, setModal] = useState(true);

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
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
              <div className="starReview">
                <h3>Course Simplicity</h3>
                <div className="starIcon">
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
              <div className="starReview">
                <h3>Course Relevance</h3>
                <div className="starIcon">
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
              <div className="starReview">
                <h3>Instructional Effectiveness</h3>
                <div className="starIcon">
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
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
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="submitReviewOutline">
        <form onSubmit={handleSubmit}>
          <h4>Your Grade:</h4>
          <input
            type="text"
            placeholder="Input Here"
            onChange={handleChange}
            name="grade"
            value={formData.grade}
          />
          <h4>Overall Quality</h4>
          <span>Rate </span>
          <input
            type="number"
            className="reviewStatInput"
            min="1"
            max="5"
            onChange={handleChange}
            name="overallQuality"
            value={formData.overallQuality}
          />
          <span> out of 5</span>
          <h4>Simplicity</h4>
          <span>Rate </span>
          <input
            type="number"
            className="reviewStatInput"
            min="1"
            max="5"
            onChange={handleChange}
            name="simplicity"
            value={formData.simplicity}
          />
          <span> out of 5</span>
          <h4>Coure Relevance</h4>
          <span>Rate </span>
          <input
            type="number"
            className="reviewStatInput"
            min="1"
            max="5"
            onChange={handleChange}
            name="courseRelevance"
            value={formData.courseRelevance}
          />
          <span> out of 5</span>
          <h4>Instructional Effectiveness</h4>
          <span>Rate </span>
          <input
            type="number"
            className="reviewStatInput"
            min="1"
            max="5"
            onChange={handleChange}
            name="instructionalEffectiveness"
            value={formData.instructionalEffectiveness}
          />
          <span> out of 5</span>

          <button type="submit " id="submit">
            Submit Review
          </button>
        </form>
        <button onClick={toggleModal} className="btn-modal">
          Write Review
        </button>
        {modal && (
          <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
              <h2>Written Review</h2>
              <textarea
                value={formData.writtenReview}
                placeholder="Enter your written review here!"
                onChange={handleChange}
                name="writtenReview"
              />
              <button className="close-modal" onClick={toggleModal}>
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
