import React, { useState, useEffect, useCallback } from "react";
import "../styles/UserPage.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const API_POSTS = `${process.env.REACT_APP_BASE_URL}/api/posts`;
const API_MESSAGES = `${process.env.REACT_APP_BASE_URL}/api/messages`;
const API_USER = `${process.env.REACT_APP_BASE_URL}/api/users`; // Updated the path here as well


const DEFAULT_BANNER = "https://picsum.photos/800/250";
const DEFAULT_PROFILE_PIC = "https://picsum.photos/200";

const PLATFORMS = ["PC", "Xbox", "PlayStation", "Nintendo Switch"];
const GENRES = ["Action", "RPG", "Shooter", "Horror", "Adventure", "Sports", "Strategy"];

function UserPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [banner, setBanner] = useState(DEFAULT_BANNER);
    const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [newUsername, setNewUsername] = useState(user?.username || "");

    useEffect(() => {
        if (user && user.username) {
            console.log("🔍 Fetching User Data for:", user.username);
            fetchUserData(user.username);
            fetchUserPosts(user.username);
            fetchUserMessages(user.username);
        }
    }, [user]);

    async function fetchUserData(username) {
        try {
            const response = await fetch(`${API_USER}/${username}`);
 // ✅ Fixed API route
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            setProfilePic(data.profile_pic || DEFAULT_PROFILE_PIC);
            setBanner(data.banner || DEFAULT_BANNER);
            setSelectedPlatforms(data.platforms || []);
            setFavoriteGenres(data.genres || []);
        } catch (error) {
            console.error("🚨 Error fetching user data:", error.message);
        }
    }
    
    async function fetchUserPosts(username) {
        try {
            const response = await fetch(`${API_POSTS}/user/${username}`); // Use new API route
            if (!response.ok) throw new Error(`Error: ${response.status}`);
    
            const data = await response.json();
            console.log("✅ User's Recent Posts:", data);
            setPosts(data);
        } catch (error) {
            console.error("🚨 Error fetching user posts:", error.message);
        }
    }
    

    async function fetchUserMessages(username) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/messages?username=${username}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (!response.ok) throw new Error(`Error: ${response.status}`);
    
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("🚨 Error fetching messages:", error.message);
        }
    }
    

    async function handleUsernameChange() {
        if (!newUsername.trim()) {
            console.error("🚨 New username cannot be empty!");
            return;
        }
        if (!user?.username) {
            console.error("🚨 No user is logged in!");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_USER}/api/users/update-username`, {  // ✅ Fixed API path
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldUsername: user.username,
                    newUsername,
                }),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || "Failed to update username");

            const updatedUser = { ...user, username: newUsername };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            console.log("✅ Username updated successfully:", newUsername);
        } catch (error) {
            console.error("🚨 Error updating username:", error.message);
        }
    }

    async function handleProfilePicUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("profilePic", file);
        formData.append("username", user.username);
    
        try {
            const response = await fetch(`${API_USER}/upload-profile-pic`, {
                method: "POST",
                body: formData,
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to upload profile picture");
    
            setProfilePic(`data:image/png;base64,${data.profilePic}`); // Set new image
        } catch (error) {
            console.error("🚨 Error uploading profile picture:", error.message);
        }
    }
    
    async function savePreferences() {
        try {
            const response = await fetch(`${API_USER}/update-preferences`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    platforms: selectedPlatforms,
                    genres: favoriteGenres,
                }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save preferences");
    
            console.log("✅ Preferences saved:", data);
        } catch (error) {
            console.error("🚨 Error saving preferences:", error.message);
        }
    }
    
    function handlePlatformChange(e) {
        const selectedPlatform = e.target.value;
        if (!selectedPlatforms.includes(selectedPlatform)) {
            setSelectedPlatforms([...selectedPlatforms, selectedPlatform]);
        }
    }

    function removePlatform(platform) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    }

    function handleGenreChange(e) {
        const selectedGenre = e.target.value;
        if (favoriteGenres.length < 5 && !favoriteGenres.includes(selectedGenre)) {
            setFavoriteGenres([...favoriteGenres, selectedGenre]);
        }
    }

    function removeGenre(genre) {
        setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
    }

    return (
        <div className="page-container">
            <div className="user-page">
                <div className="banner-container" style={{ backgroundImage: `url(${banner})` }}>
                    <label className="edit-banner-btn">
                        Edit Banner
                        <input type="file" accept="image/*" onChange={handleProfilePicUpload} />
                    </label>

                    <div className="profile-container">
                        <div className="profile-pic-section">
                            <img src={profilePic} alt="Profile" className="profile-pic" />
                            <input
    type="text"
    placeholder="Profile Picture URL"
    value={profilePic}
    onChange={(e) => setProfilePic(e.target.value)} // ✅ Fix
/>

                        </div>

                        <div className="username-section">
                            <h2 className="username-box">{newUsername || "Guest"}</h2>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Change username"
                            />
                            <button onClick={handleUsernameChange}>Save</button>
                        </div>
                    </div>
                </div>

                {/* ✅ Gaming Preferences Restored */}
                <div className="gaming-preferences">
                    <div className="platform-section">
                        <label>Preferred Platforms:</label>
                        <select onChange={handlePlatformChange}>
                            <option value="">Select Platform</option>
                            {PLATFORMS.map((platform, index) => (
                                <option key={index} value={platform}>{platform}</option>
                            ))}
                        </select>
                        <div className="selected-platforms">
                            {selectedPlatforms.map((platform, index) => (
                                <span key={index} className="platform-tag">
                                    {platform} <button onClick={() => removePlatform(platform)}>❌</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="genre-section">
                        <label>Top 5 Favorite Genres:</label>
                        <select onChange={handleGenreChange}>
                            <option value="">Select Genre</option>
                            {GENRES.map((genre, index) => (
                                <option key={index} value={genre}>{genre}</option>
                            ))}
                        </select>
                        <div className="selected-genres">
                            {favoriteGenres.map((genre, index) => (
                                <span key={index} className="genre-tag">
                                    {genre} <button onClick={() => removeGenre(genre)}>❌</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <h2>Recent Posts</h2>
                <div className="posts-container">
                    {posts.map((post) => (
                        <div key={post.id} className="post">
                            <strong>{post.username}</strong> <span className="game-title">({post.game_name})</span>
                            <p>{post.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserPage;
