const express = require("express");
const router = express.Router();

//Get functions from otpcontroller
const{
    sendOTP,
} = require("../controllers/otpController")

//Used to create a new user from registration page
router.post("/", sendOTP);



//export all routes as it pertains to login and registration
module.exports = router;