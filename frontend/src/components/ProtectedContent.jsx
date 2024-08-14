import React, { useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';

function ProtectedContent() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    // This function can be used to fetch protected data if needed
    const fetchProtectedData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/protected', { withCredentials: true });
            console.log(response.data.message); // Example: Use this data as needed
        } catch (error) {
            console.error('Failed to fetch protected data:', error);
            setIsLoggedIn(false); // If token verification fails, log the user out
        }
    };

    // Fetch protected data when the component mounts if the user is logged in
    React.useEffect(() => {
        if (isLoggedIn) {
            fetchProtectedData();
        }
    }, [isLoggedIn]);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <h2>Protected Content</h2>
                    <p>This is protected and only accessible when logged in.</p>
                </div>
            ) : (
                <p>Please log in to access protected content.</p>
            )}
        </div>
    );
}

export default ProtectedContent;
