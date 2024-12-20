import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import PersonIcon from "@mui/icons-material/Person";

export default function Verify() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const redirect = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/verify", {email});
            if (response.data.success){
                redirect("/register")
            } else {
                setMsg(response.data.message);
            }
        } catch (error) {
            setMsg("Failed to send verification code. Please try again.");
            console.log(error);
            toast.warning("This user already exists!");
                return;
        }

    };

    const handleInput = (e) =>{
        if (e.target.name == "uwi_email") {
            if (!e.target.value.endsWith("@mycavehill.uwi.edu")) {
              toast.warning("You must use your @mycavehill.uwi.edu email address");
              e.target.value = null;
              return;
            } else {
              setEmail(e.target.value);
            }
          }
    };

    return (
    <div className="wrapper">
      <Toaster richColors position="top-right" />
      <div className="register-form">
        {/* This acts as a container for the registration form*/}
        <form onSubmit={handleVerify}>
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
            <button type="submit" className="registerButton">
                Verify
            </button>
            </form>
        </div>
    </div>

    )


}