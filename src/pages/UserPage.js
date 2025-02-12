import React, { useState, useEffect } from "react";
import "../styles/UserPage.css";
import { useAuth } from "../contexts/AuthContext";

const API_USER = "https://gaming-lab.onrender.com/api/users";
const API_POSTS = "https://gaming-lab.onrender.com/api/posts";
const API_MESSAGES = "https://gaming-lab.onrender.com/api/messages";

const DEFAULT_BANNER = "https://picsum.photos/800/250";
const DEFAULT_PROFILE_PIC = "https://picsum.photos/200";

const PLATFORMS = ["PC", "Xbox", "PlayStation", "Nintendo Switch"];
const GENRES = ["Action", "RPG", "Shooter", "Horror", "Adventure", "Sports", "Strategy"];

function UserPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [banner, setBanner] = useState(DEFAULT_BANNER);
    const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [favoriteGenres, setFavoriteGenres] = useState([]);
    const [newUsername, setNewUsername] = useState(user?.username || "");
    const [editMode, setEditMode] = useState(false);
    const [conversations, setConversations] = useState({}); // Messages grouped by sender
    const [selectedSender, setSelectedSender] = useState(null); // Active chat
    const [replyMessage, setReplyMessage] = useState("");


    useEffect(() => {
        if (user && user.username) {
            fetchUserData(user.username);
            fetchUserPosts(user.username);
            fetchUserMessages();
        }
    }, [user]);

    async function fetchUserData(username) {
        try {
            const response = await fetch(`${API_USER}/${username}`);
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
            const response = await fetch(`${API_USER}/${username}/posts`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("🚨 Error fetching user posts:", error.message);
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

            setProfilePic(`data:image/png;base64,${data.profilePic}`);
        } catch (error) {
            console.error("🚨 Error uploading profile picture:", error.message);
        }
    }

    async function handleBannerUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("banner", file);
        formData.append("username", user.username);

        try {
            const response = await fetch(`${API_USER}/upload-banner`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to upload banner");

            setBanner(`data:image/png;base64,${data.banner}`);
        } catch (error) {
            console.error("🚨 Error uploading banner:", error.message);
        }
    }

    async function handleUsernameChange() {
        if (!newUsername.trim() || !user?.username) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_USER}/update-username`, {
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
        } catch (error) {
            console.error("🚨 Error updating username:", error.message);
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

    async function fetchUserMessages() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_MESSAGES}/${user.username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();

            // ✅ Group messages by sender
            const groupedMessages = data.reduce((acc, msg) => {
                if (!acc[msg.sender]) {
                    acc[msg.sender] = [];
                }
                acc[msg.sender].push(msg);
                return acc;
            }, {});

            setConversations(groupedMessages);
        } catch (error) {
            console.error("🚨 Error fetching messages:", error.message);
        }
    }

    async function handleReplyMessage(receiver) {
        if (!replyMessage.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_MESSAGES}/${receiver}/message`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ sender: user.username, message: replyMessage })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Server Response: ${errorData}`);
            }

            setConversations({
                ...conversations,
                [receiver]: [...(conversations[receiver] || []), { sender: user.username, receiver, content: replyMessage }]
            });

            setReplyMessage("");
        } catch (error) {
            console.error("🚨 Error sending reply:", error.message);
        }
    }

    return (
        <div className="page-container">
            <div className="user-page">
                <div className="banner-container" style={{ backgroundImage: `url(${banner})` }}>
                    <label className="edit-banner-btn">
                        Upload Banner
                        <input type="file" accept="image/*" onChange={handleBannerUpload} />
                    </label>
                </div>

                <div className="profile-container">
                    <div className="profile-pic-section">
                        <img src={profilePic} alt="Profile" className="profile-pic" />
                        <label className="edit-profile-btn">
                            Upload Profile Picture
                            <input type="file" accept="image/*" onChange={handleProfilePicUpload} />
                        </label>
                    </div>

                    <div className="username-section">
                        <h2>{newUsername || "Guest"}</h2>
                        {editMode ? (
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        ) : (
                            <button onClick={() => setEditMode(true)}>Edit Profile</button>
                        )}
                        {editMode && (
                            <button onClick={handleUsernameChange}>Save</button>
                        )}
                    </div>
                </div>

                <div className="genre-section">
    <label>Top 5 Favorite Genres:</label>
    <select onChange={(e) => {
        if (favoriteGenres.length < 5 && !favoriteGenres.includes(e.target.value)) {
            setFavoriteGenres([...favoriteGenres, e.target.value]);
        }
    }}>
        <option value="">Select Genre</option>
        {GENRES.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
        ))}
    </select>
    <div className="selected-genres">
        {favoriteGenres.map((genre, index) => (
            <span key={index} className="genre-tag">
                {genre} <button onClick={() => setFavoriteGenres(favoriteGenres.filter(g => g !== genre))}>❌</button>
            </span>
        ))}
    </div>
</div>

                <div className="gaming-preferences">
                    <div className="platform-section">
                        <label>Preferred Platforms:</label>
                        <select onChange={(e) => setSelectedPlatforms([...selectedPlatforms, e.target.value])}>
                            <option value="">Select Platform</option>
                            {PLATFORMS.map((platform, index) => (
                                <option key={index} value={platform}>{platform}</option>
                            ))}
                        </select>
                        <div className="selected-platforms">
                            {selectedPlatforms.map((platform, index) => (
                                <span key={index} className="platform-tag">
                                    {platform} <button onClick={() => setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))}>❌</button>
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

                <h2>{user.username}'s Messages</h2>

{/* ✅ Display list of senders */}
<div className="message-senders">
    {Object.keys(conversations).length > 0 ? (
        Object.keys(conversations).map((sender, index) => (
            <button 
                key={index} 
                className={`sender-button ${selectedSender === sender ? "active" : ""}`} 
                onClick={() => setSelectedSender(sender)}
            >
                {sender}
            </button>
        ))
    ) : (
        <p>No messages yet.</p>
    )}
</div>

{/* ✅ Display chat with selected sender */}
{selectedSender && (
    <div className="chat-container">
        <h3>Chat with {selectedSender}</h3>
        <div className="chat-history">
            {conversations[selectedSender].map((msg, index) => (
                <div key={index} className="message">
                    <strong>{msg.sender}:</strong> {msg.content}
                </div>
            ))}
        </div>

        {/* ✅ Reply input */}
        <div className="reply-section">
            <input 
                type="text"
                placeholder="Reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
            />
            <button onClick={() => handleReplyMessage(selectedSender)}>Send</button>
        </div>
    </div>
)}

            </div>
        </div>
    );
}

export default UserPage;
