import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import SearchPage from "./pages/SearchPage";
import ReviewPage from "./pages/ReviewPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import useLocalStorage from "use-local-storage";

import "./App.css";
import Header from "./components/Header";

export default function App() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [isDark, setIsDark] = useLocalStorage("isDark", false);

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <BrowserRouter>
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isDark={isDark}
          setIsDark={setIsDark}
        />
        <Routes>
          <Route
            index
            element={
              <SearchPage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route
            path="/home"
            element={
              <SearchPage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>{" "}
      </BrowserRouter>
    </div>
  );
}
