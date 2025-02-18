import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ Import Auth Context
import "../styles/Navbar.css";

const DEFAULT_PROFILE_PIC = "https://picsum.photos/50"; 

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();  // ✅ Get user & logout from AuthContext

    function handleLogout() {
        logout(); // ✅ Updates context & localStorage
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Gaming Lab</Link>
            <ul className="nav-links">
                {user ? (
                    <>
                        <li><Link to="/genres">Game Genres</Link></li>
                        <li><Link to="/posts">Posts</Link></li>
                        <li><Link to="/friends">Friends</Link></li>
                        <li><Link to="/users">User Page</Link></li>
                        <li><button onClick={handleLogout} className="logout-btn">Log Out</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>

            {user && (
                <div className="user-info">
                    <img src={user?.profilePic || DEFAULT_PROFILE_PIC} alt="Profile" className="nav-profile-pic" />
                    <span className="nav-username">{user.username}</span>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
