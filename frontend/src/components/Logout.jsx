import React from 'react';
import axios from 'axios';

const Logout = ({ setIsLoggedIn }) => { // Passes the setLogin function
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/logout', {}, { withCredentials: true }); // Sends a post request to the logout path
            setIsLoggedIn(false); // Sets log in status to false
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
