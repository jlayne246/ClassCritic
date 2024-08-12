const Credentials = require("../models/credentialModel");
const mongoose = require("mongoose");

//Function to create a new user at register page
const createUser = async(req, res) => {

//Decontructs Json from Json object obtained from API post request
//Sets the following variables below using JSON object with properties of the same nams
    const {
        email,
        password,
    } = req.body;

//Await promise, creating a new database record using the Credentials model
//email and password properties in the record are set with the request object properties above.
//If error returned, respond with json object containing the error
    try{
        const register = await Credentials.create({
            email,
            password,
        });

        res.status(200).json(register);
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

//export functions to be used in routing
module.exports ={
    createUser,
}