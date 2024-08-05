import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useEffect, useState } from "react";

export default function CourseDetails() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      /* https://www.youtube.com/watch?v=N4yUiQiTvwU 
      you must proxy api requests while developing, i already set it up in the vite.config
      the utube link gives an indepth explanation, but i literally on look at the 1st 30secs of the vid*/
      const response = await fetch("/api/review");

      const json = await response.json();
      if (response.ok) {
        setReviews(json);
      }
    };
    fetchReviews();
  }, []);
  return (
    <div className="courseDetailsPage">
      <div className="courseOutline">
        <div className="courseInfo">
          <h1 className="courseName">Computing in the Analogue Age</h1>
          <h2 className="courseCode">COMP2344</h2>
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
