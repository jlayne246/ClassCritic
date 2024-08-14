import React from 'react';
import axios from 'axios';

const Logout = ({ setIsLoggedIn }) => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
