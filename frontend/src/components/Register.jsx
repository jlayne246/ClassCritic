import React from "react";
import { useState } from "react";
import { Router, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { Toaster, toast } from "sonner"; //https://www.youtube.com/watch?v=8JTrY1dlXCw&t=20s (POP UP Notifications)

export default function Register() {
  const [email, setEmail] = useState(""); // Used to set a state variable for the email entered using useState, which will utilise the "setter" to then store the data in the variable email.
  const [password, setPassword] = useState(""); // Used to set a state variable for the password entered using useState, which will utilise the "setter" to then store the data in the variable passowrd.
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [msg, setMsg] = useState("");
  const redirect = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warning("ERROR: Your passwords do not match");
      return; // Exit function if passwords don't match
    }

    try {
      const response = await axios.post("/api/register", {email, password, otp});
      if (response.data.success){
        redirect("/login")
      } else{
        setMsg(response.data.message)
      }
    } catch (error) {
      setMsg("error occured trying to register this user");
    }
  };
  const handleInput = (e) => {
    if (e.target.name == "uwi_email") {
      if (!e.target.value.endsWith("@mycavehill.uwi.edu")) {
        toast.warning("You must use your @mycavehill.uwi.edu email address");
        e.target.value = null;
        return;
      } else {
        setEmail(e.target.value);
      }
    }
    if (e.target.name == "password") {
      if (e.target.value == "") {
        e.target.placeholder = "Enter password";
        e.target.value = null;
      } else if (e.target.name === "password") {
        setPassword(e.target.value);
      }
    }
    if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    }
    if (e.target.name == "OTP"){
      setOTP(e.target.value);
    }
  };

  return (
    <div className="wrapper">
      <Toaster richColors position="top-right" />
      <div className="register-form">
        {/* This acts as a container for the registration form*/}
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          {/* This is the login form itself, which will run handleLogin on submission */}
          <div className="form-group">
            {/* This is the div container for the Email part of the form */}
            {/* This is the label for the email part of the form */}
            <input
              type="email"
              name="uwi_email"
              placeholder="@mycavehill.uwi.edu"
              onBlur={handleInput}
              required
            />
            {/* This is the input field for the Email part of the form. The type would allow for email addresses to appear in a dropdown, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setEmail.*/}
            <i>
              <PersonIcon />
            </i>
          </div>
          <div className="form-group">
            {/* This is the div container for the Email part of the form */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              onBlur={handleInput}
            />

            {/* This is the input field for the Password part of the form. The type would allow for any text entered to be replaced with dots, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setPassword.*/}
            <i>
              <LockIcon />
            </i>
          </div>
          <div className="form-group">
            {/* This is the div container for the Email part of the form */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onBlur={handleInput}
            />

            {/* This is the input field for the Password part of the form. The type would allow for any text entered to be replaced with dots, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setPassword.*/}
            <i>
              <LockIcon />
            </i>
          </div>
          <div className="form-group">
            {/* This is the div container for the Email part of the form */}
            <input
              type="text"
              name="OTP"
              placeholder="Enter verification code here"
              onBlur={handleInput}
            />

            {/* This is the input field for the Password part of the form. The type would allow for any text entered to be replaced with dots, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setPassword.*/}
            <i>
              <LockIcon />
            </i>
          </div>
          <p>{msg.replace(/['"]+/g, "")}</p>{" "}
          {/* Display error message if exists */}
          <button type="submit" className="registerButton">
            Register
          </button>
          <div className="loginLink">
            <p>
              Have an account? <a href="login">Log in</a>
            </p>
          </div>
          {/* Button used to submit data */}
        </form>
      </div>
    </div>
  );
}
