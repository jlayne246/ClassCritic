const express = require("express");
const router = express.Router();

//Get functions from credentialscontroller
const{
    validateUser,
} = require("../controllers/credentialsController")

//Used to validate a pre-existing user from login page
router.post("/", validateUser);

//export all routes as it pertains to login and registration
module.exports = router;