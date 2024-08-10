import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";


export default function Register(){
    const [email, setEmail] = useState(''); // Used to set a state variable for the email entered using useState, which will utilise the "setter" to then store the data in the variable email.
    const [password, setPassword] = useState(''); // Used to set a state variable for the password entered using useState, which will utilise the "setter" to then store the data in the variable passowrd.
    const [msg, setMsg] = useState('')
    const redirect = useNavigate(); 

    const handleRegister = async(e) =>{
        e.preventDefault();
        console.log("submit " + email + "," + password);
        try{
            const response = await fetch('/api/register', {method: 'POST', mode: 'cors', email, password})
            .then((response) => response.json())
            .then((result) => {console.warn(result); 
            setMsg(result);
            })
            e.target.reset();
        }
        catch (err) {
            console.error(err);
          
        }
    }

    const handleInput = (e) => { 
    if (e.target.name == "uwi_email") {
        if (!(e.target.value.endsWith("@mycavehill.uwi.edu"))) {
          console.warn("Invalid email entered");
          e.target.value = " ";
          e.target.className = "inputError";
          return;
        } else {e.target.className = " ";
            setEmail(e.target.value);
            }
    }
    if (e.target.name == "password") {
        if (e.target.value = ""){
            console.warn("Please enter password");
            e.target.classname = "inputError";
            e.target.value = " ";
        } else  {e.target.className = " ";
            setPassword(e.target.value);
            }
    }
  }

  return (
    <div className="wrapper">
      <div className="register-form">
        {" "}
        {/* This acts as a container for the registration form*/}
        <form onSubmit={handleRegister}>
          <h1>Register</h1>{" "}
          {/* This is the login form itself, which will run handleLogin on submission */}
          <div className="form-group">
            {" "}
            {/* This is the div container for the Email part of the form */}
            {/* This is the label for the email part of the form */}
            <input
              type="email"
              name="uwi_email"
              placeholder=" Email Address ending in @mycavehill.uwi.edu"
              onBlur={handleInput}
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
              placeholder="Password"
              onBlur={handleInput}
            />{" "}
            {/* This is the input field for the Password part of the form. The type would allow for any text entered to be replaced with dots, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setPassword.*/}
            <i>
              <LockIcon />
            </i>
          </div>
          {msg && <p>{msg}</p>} {/* Display error message if exists */}
          <button type="submit" className="registerButton">
            Register
          </button>{" "}
          <div className="loginLink">
            <p>
              Have an account? <a>Log in</a>
            </p>
          </div>
          {/* Button used to submit data */}
        </form>
      </div>
    </div>
  );
}