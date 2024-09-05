const Credentials = require("../models/credentialModel");
const OTP = require("../models/otpModel")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const {google} = require('googleapis');

const jwt = require("jsonwebtoken");

const JWT_SECRET = "151a60307f621da4e322f2e3ff9493c50f62a0b8ad919eeac7b009f60bcd37ca";

const CLIENT_ID = '1097695032083-9sd3foeeml9d6glqkmofmnlnuqqo619u.apps.googleusercontent.com'; //ID
const CLIENT_SECRET = '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';    //secret
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'; //used to get the oauth refresh tokens.
const REFRESH_TOKEN = '1//04VzxCpVhtygWCgYIARAAGAQSNwF-L9IrGMNXijwSTdNGG69vDtnop-DpURokwpCG8Rvx9RjYAbccS5TZ4_2rFptwVn96ANBosAQ';

//SET UP TO GENERATE ACCESS TOKEN FROM GOOGLE
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
async function sendEmail(userEmail){
    try{
        const generatedAccessToken = await oAuth2Client.getAccessToken()//set up for this token.
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type:'OAuth2',
                user:'coursecritic.noreply@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: generatedAccessToken //the thing we got there ^
            }
        });
        const mailOptions = {
            from: "Class Critic <classcritic.noreply@gmail.com>",
            to: userEmail,// set the email here //email,
            // to: "kai00hill@gmail.com",
            subject: "Class Critic Verification",
            text: "This is a test!",
        };
        const email = await transporter.sendMail(mailOptions);
        return email;
    }
    catch(error){
        console.error("It borken:",error);
    }
}

//Function to create a new user at register page
const createUser = async (req, res) => {
    
    //Decontructs Json from Json object obtained from API post request
    //Sets the following variables below using JSON object with properties of the same nams
    //Check for all 
    try {
      const { email, password, role, otp } = req.body;
      // Check if all details are provided
      if (!email || !password || !otp) {
        return res.status(403).json({
          success: false,
          message: 'All fields are required',
        });
      }
      // Check if user already exists
      const existingUser = await Credentials.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }
    const hashPassword = async (password, saltRounds = 10) => {
        try {
            // Use bcrypt to hash the password
            const hash = await bcrypt.hash(password, saltRounds);
            return hash; // Return the hashed password
        } catch (err) {
            console.error("Error hashing password:", err);
            throw err; // Throw error if hashing fails
        }
    };

    const saltRounds = 10; // Cost factor
    const hashPass = await hashPassword(password, saltRounds); //Hashes password

    ////////////////////START OF GENERATE USERNAME///////////////////////////////////////////////
    // Array of short adjectives
    const adjectives = [
        "Quick",
        "Smart",
        "Cool",
        "Brave",
        "Kind",
        "Fun",
        "Nice",
        "Cool",
        "Happy",
        "Wild",
    ];

    const animals = [
        "Pelican",
        "Dove",
        "Pigeon",
        "Egret",
        "Bird",
        "Duck",
        "Robin",
        "Parrot",
        "Sparrow",
        "MockingJay",
    ];

    // Get the current date and time
    const now = new Date();

    // Format the date as mm/yy
    const formattedDate = `${now.getMonth() + 1}${now.getFullYear() % 100}`;

    // Format the time as HHMMSS
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;

    // Combine a random adjective, animal, formatted date, and formatted time
    const username = `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
    }${
        animals[Math.floor(Math.random() * animals.length)]
    }${formattedDate}${formattedTime}`;
    ////////////////////END OF GENERATE USERNAME///////////////////////////////////////////////

    //Await promise, creating a new database record using the Credentials model
    //email and password properties in the record are set with the request object properties above.
    //If error returned, respond with json object containing the error
  try {

    console.log(hashPass);
    // password = hashPass;

    // console.log("Username: " + username);

    const register = await Credentials.create({
      email,
      password: hashPass,
      role: "user",
      username: username,
    }); // Creates credentials with email and hashed password and save role as user
    const SentVerificationEmail = await sendEmail(email);
    console.log('make it happen');
    console.log(SentVerificationEmail);
    // res.status(200).json({ message: 'Verification email sent' });
      res.status(200).json({
        success: true,
        message: 'User registered successfully',
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } catch (error){
    res.status(400).json({success: false, message: 'Critical error when making new user credentials!'});
  }
};

const validateUser = async (req, res) => {
  const { email, password, username, remember } = req.body;

  // console.log(email, password, remember);

  try {
    // const loginCondition = {email: email, password: password};

    const userCheck = { email: email };

    const validate = await Credentials.findOne(userCheck);

    // console.log("Mongo Record: " + validate);

    if (validate) {
      // return true;
      const isPasswordValid = await bcrypt.compare(password, validate.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            userId: validate._id,
            emailAddr: validate.email,
            role: validate.role,
            username: validate.username,
          },
          JWT_SECRET
        );
        // Insert => username: validate.username
        // Future note: Consider adding roles to make admin differentiation easier and username

        // console.log("Token: " + token);

        // localStorage.setItem("rememberStatus", remember);

        req.session.token = token;

        res.cookie("token", token, {
          httpOnly: false, // Set to true if you only want the server to access the cookie
          secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS
          sameSite: "Lax",
        });

        return res.json({ success: true, token });
      } else {
        return res.json({ success: false, message: "Wrong Password." });
      }
    } else {
      return res.json({ success: false, message: "User not found." });
    }

    //res.status(200).json(validate);
  } catch (error) {
    console.log(error.message);
    // return res.json({success: false, message: "Login Failed. Try Again."});
    res.status(400).json({ error: error.message });
  }
};

//export functions to be used in routing
module.exports = {
  createUser,
  validateUser,
};
