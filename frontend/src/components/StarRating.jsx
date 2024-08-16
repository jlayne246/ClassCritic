import React from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useEffect, useState } from "react";

const Rate = ({ count, rating, color, onRating, name }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getColor = (index) => {
    if (hoverRating >= index) {
      return color.filled;
    } else if (!hoverRating && rating >= index) {
      return color.filled;
    } else if (rating === 0) {
      // Check for unfilled star when rating is 0
      return color.unfilled; // Use unfilled color if rating is 0 and not hovering
    }
    return color.unfilled; // Default to unfilled color otherwise
  };

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => (
        <span key={idx} className="cursor-pointer">
          {rating === 0 && !hoverRating && idx > rating ? ( // Use StarBorderIcon for unfilled stars when rating is 0
            <StarBorderIcon
              icon="starBorder"
              onClick={() => onRating(idx, name)} // Pass both index and name
              style={{ color: getColor(idx) }}
              onMouseEnter={() => setHoverRating(idx)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ) : (
            <StarIcon
              icon="star"
              onClick={() => onRating(idx, name)} // Pass both index and name
              style={{ color: getColor(idx) }}
              onMouseEnter={() => setHoverRating(idx)}
              onMouseLeave={() => setHoverRating(0)}
            />
          )}
        </span>
      ));
  }, [count, rating, hoverRating]);

  return <div className="starReviewContainer">{starRating}</div>;
};

export default Rate;

Rate.propTypes = {
  count: PropTypes.number,
  rating: PropTypes.number,
  onRating: PropTypes.func.isRequired, // onRating should be required
  color: PropTypes.shape({
    filled: PropTypes.string,
    unfilled: PropTypes.string,
  }),
  name: PropTypes.string.isRequired, // name should be required
};

Rate.defaultProps = {
  count: 5,
  rating: 0,
  color: { filled: "#63ade5", unfilled: "DCDCDC" },
};
