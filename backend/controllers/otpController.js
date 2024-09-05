const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const Credentials = require('../models/credentialModel');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const CLIENT_ID = '1097695032083-9sd3foeeml9d6glqkmofmnlnuqqo619u.apps.googleusercontent.com'; //ID
const CLIENT_SECRET = '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';    //secret
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'; //used to get the oauth refresh tokens.
const REFRESH_TOKEN = '1//04VzxCpVhtygWCgYIARAAGAQSNwF-L9IrGMNXijwSTdNGG69vDtnop-DpURokwpCG8Rvx9RjYAbccS5TZ4_2rFptwVn96ANBosAQ';

//SET UP TO GENERATE ACCESS TOKEN FROM GOOGLE
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
async function sendEmail(userEmail, otp){
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
            text: "Please enter the one time password:" + otp + "on the registration page you were redirected to." ,
        };
        const email = await transporter.sendMail(mailOptions);
        return email;
    }
    catch(error){
        console.error("It broken:",error);
    }
};

const sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      // Check if user is already present
      const checkUserPresent = await Credentials.findOne({ email });
      // If user found with provided email
      if (checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: 'User is already registered',
        });
      }
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let result = await OTP.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await OTP.findOne({ otp: otp });
      }
      const otpPayload = { email, otp };
      const otpBody = await OTP.create(otpPayload);
      const SentVerificationEmail = await sendEmail(email, otp);
      console.log(SentVerificationEmail);
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ success: false, error: error.message });
    }
  };


module.exports = {
    sendOTP
};