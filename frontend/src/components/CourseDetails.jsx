import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useEffect, useState } from "react";
import Data from "../CourseNames.json";

export default function CourseDetails() {
  const [reviews, setReviews] = useState(null);

  //initial state for the course title and code.
  //Would be wise to make them blank and set it to this on not found but I aint doing all of that
  const [courseInfo, setCourseInfo] = useState({
    coursecode:"How did you get here?",
    title:"Course doesn't exist!"
  });
  useEffect(() => {
    const fetchReviews = async (query) => {
      //urlParameters contains the 
      /* https://www.youtube.com/watch?v=N4yUiQiTvwU 
      you must proxy api requests while developing, i already set it up in the vite.config
      the utube link gives an indepth explanation, but i literally on look at the 1st 30secs of the vid*/
      
      //Need to be able to pass query to back end
      //Add query to the slug
      const courseRequest = "/api/review"+query; //slug + coursecode query (ie ?course=CODE1234)
      const response = await fetch(courseRequest);

      const json = await response.json();
      if (response.ok) {
        setReviews(json);
      }
    };

    //This function finds the corresponding class of the code queried from the CourseNames.json and sets the title and course code to that
    const fetchCourseInfo = (code,courseList)=>{
      try{
        const foundCourse = courseList.find(course=> course.coursecode === code);
        if (foundCourse){
          setCourseInfo(foundCourse);
          console.log("Course that was set:", foundCourse);
        }
        else{
          console.log("There is literally no class with that code on this site");
        }
      }
      catch(error){
        console.error('OOPSIE in fetchCourseInfo:',error);
      }
    };

    //Gets query of the current url with ?
    const classquery = window.location.search;
    //next 2 lines strip query to just the code
    const url = new URLSearchParams(classquery);
    const courseCode = url.get('course');

    fetchCourseInfo(courseCode,Data);
    fetchReviews(classquery);
  }, []);
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
                <div>
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
              <div className="starReview">
                <h3>Course Simplicity</h3>
                <div>
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
              <div className="starReview">
                <h3>Course Relevance</h3>
                <div>
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
              <div className="starReview">
                <h3>Instructional Effectiveness</h3>
                <div>
                  <StarIcon /> <StarIcon /> <StarIcon /> <StarBorderIcon />
                  <StarBorderIcon />
                </div>
              </div>
            </div>
            <div className="writtenReviews">
              {reviews &&
                reviews.map((review) => {
                  return (
                    <div className="writtenReviewDetails" key={review._id}>
                      <h5>{review.username}</h5>
                      <p>{review.writtenReview}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div className="submitReviewOutline">
        <h4>Your Grade:</h4>
        <input type="text" placeholder="Input Here" />
        <h4>Overall Quality</h4>
        <span>Rate </span>
        <input type="number" min="1" max="5" />
        <span> out of 5</span>
        <h4>Simplicity</h4>
        <span>Rate </span>
        <input type="number" min="1" max="5" />
        <span> out of 5</span>
        <h4>Coure Relevance</h4>
        <span>Rate </span>
        <input type="number" min="1" max="5" />
        <span> out of 5</span>
        <h4>Instructional Effectiveness</h4>
        <span>Rate </span>
        <input type="number" min="1" max="5" />
        <span> out of 5</span>
        <button>Write Review</button>
        <br></br>
        <button id="submit">Submit Review</button>
      </div>
    </div>
  );
}
