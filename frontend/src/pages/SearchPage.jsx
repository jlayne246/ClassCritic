import SearchBar from "../components/SearchBar";
import Data from "../CourseNames.json";
// import ProtectedContent from "../components/ProtectedContent"; 
import Header from "../components/Header";

import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export default function SearchPage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  // Grabs the authentication context from AuthContext, and stores it in the userState above

  return (
    <>
      {/* <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> */}
      {/* Passes the user login state into the header */}
      <SearchBar placeholder="Enter a course name..." data={Data} />;

      {/* <main>
        <ProtectedContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </main> */}
    </>
  );
}
