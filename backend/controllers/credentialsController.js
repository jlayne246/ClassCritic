const Credentials = require("../models/credentialModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")

const jwt = require('jsonwebtoken');

const JWT_SECRET = '151a60307f621da4e322f2e3ff9493c50f62a0b8ad919eeac7b009f60bcd37ca';

//Function to create a new user at register page
const createUser = async(req, res) => {

//Decontructs Json from Json object obtained from API post request
//Sets the following variables below using JSON object with properties of the same nams
    const {
        email,
        password,
    } = req.body;

    const hashPassword = async (password, saltRounds = 10) => {
        try {
          // Use bcrypt to hash the password
          const hash = await bcrypt.hash(password, saltRounds);
          return hash; // Return the hashed password
        } catch (err) {
          console.error('Error hashing password:', err);
          throw err; // Throw error if hashing fails
        }
    };

    const saltRounds = 10; // Cost factor
    const hashPass = await hashPassword(password, saltRounds); //Hashes password

    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: "apikey",
            pass: "",
        },
    });
    const mailOptions = {
        from: 'no-reply@example.com',
        to: email,
        subject: 'Course Critic Verification',
        html: '<p>This is a test!</p>',
    };
//Await promise, creating a new database record using the Credentials model
//email and password properties in the record are set with the request object properties above.
//If error returned, respond with json object containing the error
    try{
        console.log(hashPass);
        // password = hashPass;

        const register = await Credentials.create({
            email,
            password: hashPass,
        }); // Creates credentials with email and hashed password
        await transporter.sendMail(mailOptions);
        res.status(200).json(register);
        res.status(200).json({ message: 'Verification email sent' });
    } catch(error) {
        res.status(400).json({error: error.message})
    }
    
}

const validateUser = async (req, res) => {
    const {
        email,
        password,
        remember,
    } = req.body;

    // console.log(email, password, remember);

    try {
        // const loginCondition = {email: email, password: password};

        const userCheck = {email: email};

        const validate = await Credentials.findOne(userCheck);

        if (validate) {
            // return true;
            const isPasswordValid = await bcrypt.compare(password, validate.password);

            if (isPasswordValid) {
                const token = jwt.sign({ userId: validate._id, emailAddr: validate.email }, JWT_SECRET);
                // Future note: Consider adding roles to make admin differentiation easier

                // console.log(token);

                // localStorage.setItem("rememberStatus", remember);

                req.session.token = token;

                return res.json({success: true, token});
            } else {
                return res.json({success: false, message: "Wrong Password."});
            }
        } else {
            return res.json({success: false, message: "User not found."});
        }

        //res.status(200).json(validate);
    } catch (error) {
        console.log(error.message);
        // return res.json({success: false, message: "Login Failed. Try Again."});
        res.status(400).json({error: error.message})
    }

}

//export functions to be used in routing
module.exports ={
    createUser,
    validateUser,
}