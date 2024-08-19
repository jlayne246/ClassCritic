import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Dropdown.css';

const Dropdown = ({ email, setIsLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  {console.log(email)}

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

//   const toggleDropdown = () => {
//     setOpen(!open);
//   };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="dropdown-email">
        {email}
      </div>
      {dropdownOpen && (
        <div className="dropdown-menu">
          {/* <a href="/profile">Profile</a>
          <a href="/settings">Settings</a> */}
          <ul>
            <li>
                <a href="/home" onClick={handleLogout}>
                Logout
                </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
