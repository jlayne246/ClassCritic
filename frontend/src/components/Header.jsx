import "./Header.css";
import axios from "axios";
// import verifyToken from "../../../backend/modules/jwtRetrieve";
// import { jwtDecode } from "jwt-decode";
import logoWhite from "../assets/ClassCritic-White.png";
import logoBlack from "../assets/ClassCritic-Black.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import ToggleComponent from "./Toggle";
import Dropdown from "./Dropdown";
import { useUser } from '../Context/UserContext';
// import { useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn, isDark, setIsDark }) => {
  //Insert constants or variables
  // const email = document.cookie
  //   .split('; ')
  //   .find(row => row.startsWith('user_email='))
  //   ?.split('=')[1];

  // const [email, setEmail] = useState('');

  // useEffect(() => {
  //   // Assume the token is stored in a cookie
  //   const token = document.cookie
  //     .split('; ')
  //     .find(row => row.startsWith('token='))
  //     ?.split('=')[1];

  //   if (token) {
  //     // Decode the token
  //     const decodedToken = jwtDecode(token);

  //     // Extract the email and decode it
  //     const decodedEmail = decodeURIComponent(decodedToken.emailAddr);
  //     // console.log("Decoded: " + JSON.stringify(decodedToken));
  //     setEmail(decodedEmail);
  //   }
  // }, []);

  const { email, username } = useUser();

  // console.log("Header Email: " + email);

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
                  <div className="dropdown">
                    <Dropdown 
                      email={email} //replace with username = {username}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  </div>
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
