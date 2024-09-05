const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
    {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
  }
);

  module.exports = mongoose.model("otps", otpSchema);