import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./Context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Wraps the App component in the AuthContext component which passes on login context throughout the application */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
