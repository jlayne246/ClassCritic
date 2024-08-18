import "./Header.css";
import axios from "axios";
import logoWhite from "../assets/ClassCritic-White.png";
import logoBlack from "../assets/ClassCritic-Black.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import ToggleComponent from "./Toggle";

const Header = ({ isLoggedIn, setIsLoggedIn, isDark, setIsDark }) => {
  //Insert constants or variables
  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //helps determine whether to display menu on small screens
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle state on click
  };

  return (
    <header className={`header ${isLoggedIn ? "logged-in" : "logged-out"}`}>
      <nav>
        <div className="logoAndtext">
          <a href="home">
            <img src={isDark ? logoWhite : logoBlack} alt="" />
          </a>
          <h4>
            CLASS.<span>CRITIC</span>
          </h4>
        </div>

        <div className="navbarLinkContainer">
          <ul id="navbar" className={isOpen ? "active" : ""}>
            <li>
              <a href="/home">Home</a>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <a href="/home" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/register">Register</a>
                </li>
                <li>
                  <a href="/login">Login</a>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="toggle-comp">
          <ToggleComponent
            isChecked={isDark}
            handleChange={() => setIsDark(!isDark)}
          />
        </div>

        <div id="mobile" onClick={toggleMenu}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
      </nav>
    </header>
  );
};

export default Header;
