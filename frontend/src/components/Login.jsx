import "./Login.css";

import React, { useState } from "react";
// import { AuthContext } from './AuthContext';
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  // Receives login state in function
  // const [email, setEmail] = useUser(); // Used to set a state variable for the email entered using useState, which will utilise the "setter" to then store the data in the variable
  const [password, setPassword] = useState(""); // Used to set a state variable for the password entered using useState, which will utilise the "setter" to then store the data in the variable
  const [remember, setChecked] = useState(""); // Used to set a state variable for the password entered using useState, which will utilise the "setter" to then store the data in the variable
  const [error, setError] = useState(""); // Used to set a state variable for any errors using useState, which will utilise the "setter" to then store the data in the variable
  const { email, setEmail, setRole, setUsername } = useUser();

  const navigate = useNavigate();

  // An async function used to handle the login data as submitted from the form. It acts as a go between for the frontend form, and the backend.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default state for any events
    try {
      const response = await axios.post("/api/login", {
        // Would forward the submission data to the backend using a POST request to validate the login.
        email,
        password,
        remember,
      });

      if (response.data.success) {
        // If there is a successful login, then the login state is set true, and the user would be navigated to the home page.
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        // console.log(JSON.stringify(decodedToken));
        setEmail(decodeURIComponent(decodedToken.emailAddr));
        setRole(decodeURIComponent(decodedToken.role));
        // setUsername(decodeURIComponent(decodedToken.username));
        document.cookie = `token=${token}; path=/`;
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        // Otherwise, then the login state is set false, and it would return an error message
        setIsLoggedIn(false);
        setError(response.data.message);
      }
    } catch (error) {
      // This would be the fall back in case there are errors in the initial login process by setting the login state to false, and error message as such.
      setIsLoggedIn(false);
      setError("Login failed. Please try again.");
    }
  };

  function handleChange(e) {
    setChecked(e.target.checked);
  }

  return (
    <div className="wrapper">
      <div className="login-form">
        {" "}
        {/* This acts as a container for the login form*/}
        <form onSubmit={handleLogin}>
          <h1>Login</h1>{" "}
          {/* This is the login form itself, which will run handleLogin on submission */}
          <div className="form-group">
            {" "}
            {/* This is the div container for the Email part of the form */}
            {/* This is the label for the email part of the form */}
            <input
              type="email"
              name="email"
              value={email}
              placeholder="@mycavehill.uwi.edu"
              onChange={(e) => setEmail(e.target.value)}
              required
            />{" "}
            {/* This is the input field for the Email part of the form. The type would allow for email addresses to appear in a dropdown, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setEmail.*/}
            <i>
              <PersonIcon />
            </i>
          </div>
          <div className="form-group">
            {" "}
            {/* This is the div container for the Email part of the form */}
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            {/* This is the input field for the Password part of the form. The type would allow for any text entered to be replaced with dots, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setPassword.*/}
            <i>
              <LockIcon />
            </i>
          </div>
          {error && <p className="error">{error}</p>}{" "}
          {/* Display error message if exists */}
          <div className="rememberForgot">
            <label>
              <input
                type="checkbox"
                value={remember}
                name="remember"
                onChange={handleChange}
              />
              Remember Me
            </label>
            <a href="">Forgot Password?</a>
          </div>
          <button type="submit" className="loginButton">
            Sign In
          </button>{" "}
          <div className="registerLink">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
          {/* Button used to submit data */}
        </form>
      </div>
    </div>
  );
};

export default Login;
