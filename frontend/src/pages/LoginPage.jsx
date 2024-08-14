import Login from "../components/Login";
import Logout from "../components/Logout";
import Header from "../components/Header";

import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export default function LoginPage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Header />
      
      <main>
        {isLoggedIn ? (
            <Logout setIsLoggedIn={setIsLoggedIn} />
        ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </main>
    </>
  );
}
