const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    coursecode: {
      type: String,
      required: true,
    },
    averageGrade: {
      type: Number,
      default: "",
    },
    averageOverallQuality: {
      type: Number,
      default: null,
    },
    averageSimplicity: {
      type: Number,
      default: null,
    },
    averageCourseRelevance: {
      type: Number,
      default: null,
    },
    averageInstructionalEffectiveness: {
      type: Number,
      default: null,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    numPassed: {
      type: Number,
      default: 0,
    },
    passRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("stat", statsSchema);
