import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const getInitialState = () => {
    const isLoggedIn = sessionStorage.getItem("currentLogin");
    return isLoggedIn ? JSON.parse(isLoggedIn) : null
  }

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(getInitialState());

    useEffect(() => {
        sessionStorage.setItem("currentLogin", JSON.stringify(isLoggedIn))
    }, [isLoggedIn])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
