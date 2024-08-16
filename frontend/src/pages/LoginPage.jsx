import Login from "../components/Login";
// import Logout from "../components/Logout";
import Header from "../components/Header";

import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export default function LoginPage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  // Grabs the authentication context from AuthContext, and stores it in the userState above

  // const navigate = useNavigate();

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      {/* Passes the user login state into the header */}
      
      <main>
        {isLoggedIn ? (
          // Ternary operator which takes user state
          <Navigate to="/home" />
            // Navigates to home if logged in
        ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
            // Passes login state setter into the login component, and loads it if logged out
        )}
      </main>
    </>
  );
}
