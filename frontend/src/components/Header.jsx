import "./Header.css";
import axios from "axios";
import logo from '../assets/cc-logo.jpeg';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
	//Insert constants or variables
	const handleLogout = async (e) => {
        e.preventDefault(); // Prevent default link behavior
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
	
	return (
		<header className={`header ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
			<nav>
				<div className="nav-logo">
					<a href="/">
						<img src={logo} alt="Logo" />
					</a>
				</div>
				<div className="nav-links">
					<ul>
						<li><a href="/home">Home</a></li>
						{isLoggedIn ? (
						<>
							<li><a href="/home" onClick={handleLogout}>Logout</a></li>
						</>
					) : (
						<>
							<li><a href="/register">Register</a></li>
							<li><a href="/login">Login</a></li>
						</>
					)}
					</ul>
				</div>
			</nav>
		</header>
	);
}

export default Header;