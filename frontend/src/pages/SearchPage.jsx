import SearchBar from "../components/SearchBar";
import Data from "../CourseNames.json";
// import ProtectedContent from "../components/ProtectedContent"; 
import Header from "../components/Header";

import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export default function SearchPage() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <SearchBar placeholder="Enter a course name..." data={Data} />;

      {/* <main>
        <ProtectedContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </main> */}
    </>
  );
}
