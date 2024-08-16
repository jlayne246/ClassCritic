import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const getInitialState = () => {
    const isLoggedIn = sessionStorage.getItem("currentLogin");
    return isLoggedIn ? JSON.parse(isLoggedIn) : null
  }
//   Retrieves the current login state from session storage and returns it if there is a login

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(getInitialState());
    // Grabs the current login state from the getInitialState function and stores it in the isLoggedIn state

    useEffect(() => {
        sessionStorage.setItem("currentLogin", JSON.stringify(isLoggedIn))
    }, [isLoggedIn])
// This function performs a side effect by setting the login status in sessionStorage right after render

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}> 
            {children}
        </AuthContext.Provider>
        // Takes the isLoggedIn state and updates authContext, and then uses AuthContext to pass on the log in context to children component, App
    );
};

export default AuthProvider;
