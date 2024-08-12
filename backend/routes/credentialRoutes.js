const express = require("express");
const router = express.Router();

//Get functions from credentialscontroller
const{
    createUser,
} = require("../controllers/credentialsController")

//Used to create a new user from registration page
router.post("/", createUser);

module.exports = router;