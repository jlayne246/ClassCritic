import "./Login.css"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState(''); // Used to set a state variable for the email entered using useState, which will utilise the "setter" to then store the data in the variable
    const [password, setPassword] = useState(''); // Used to set a state variable for the password entered using useState, which will utilise the "setter" to then store the data in the variable
    const [error, setError] = useState(''); // Used to set a state variable for any errors using useState, which will utilise the "setter" to then store the data in the variable
    
    const navigate = useNavigate();

    // An async function used to handle the login data as submitted from the form. It acts as a go between for the frontend form, and the backend.
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents the default state for any events
        try {
            const response = await axios.post('/api/login', { // Would forward the submission data to the backend using a POST request to validate the login.
                email,
                password,
            });

            if (response.data.success) { // If there is a successful login, then the user would be navigated to the home page.
                navigate('/home');
            } else { // Otherwise, it would return an error message
                setError(response.data.message);
            }
        } catch (error) { // This would be the fall back in case there are errors in the initial login process by setting the error message as such.
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-form"> {/* This acts as a container for the login form*/}
            <form onSubmit={handleLogin}> {/* This is the login form itself, which will run handleLogin on submission */}
                <div className="form-group"> {/* This is the div container for the Email part of the form */}
                    <label>Email:</label> {/* This is the label for the email part of the form */}
                    <input 
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter UWI Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /> {/* This is the input field for the Email part of the form. The type would allow for email addresses to appear in a dropdown, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setEmail.*/}
                </div>

                <div className="form-group"> {/* This is the div container for the Email part of the form */}
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)} 
                    /> {/* This is the input field for the Password part of the form. The type would allow for any text entered to be replaced with dots, the name helps with the labelling, the value is the state variable that the data will be stored in, the placeholder provides more information, and the onChange property calls a function that will take in the input field's value and pass it into setPassword.*/}
                </div>

                {error && <p>{error}</p>} {/* Display error message if exists */}
                <button type="submit">Login</button> {/* Button used to submit data */}
            </form>
        </div>
    );
}

export default Login;