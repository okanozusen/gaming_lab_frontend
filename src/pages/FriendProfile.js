import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import "../styles/FriendProfile.css";

const API_FRIENDS = "https://gaming-lab.onrender.com/api/friends";

function FriendProfile() {
    const { user } = useAuth();
    const { username } = useParams();
    const [profilePic, setProfilePic] = useState("https://picsum.photos/200");
    const [banner, setBanner] = useState("https://picsum.photos/800/250");
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        fetchFriendProfile();
        fetchFriendMessages();
    }, [username]);

    async function fetchFriendProfile() {
        try {
            const response = await fetch(`${API_FRIENDS}/${username}`);
            const data = await response.json();
    
            setProfilePic(data.profilePic || profilePic);
            setBanner(data.banner || banner);
            setPlatforms(Array.isArray(data.platforms) ? data.platforms : []); // ✅ Ensure it's always an array
            setGenres(Array.isArray(data.genres) ? data.genres : []); // ✅ Ensure it's always an array
            setPosts(Array.isArray(data.posts) ? data.posts : []); // ✅ Ensure it's always an array
        } catch (error) {
            console.error("🚨 Error fetching friend profile:", error.message);
        }
    }
    

    async function fetchFriendMessages() {
        try {
            const response = await fetch(`${API_FRIENDS}/${username}/messages`);
            const data = await response.json();
            setChatHistory(data);
        } catch (error) {
            console.error("🚨 Error fetching messages:", error.message);
        }
    }

    async function sendMessage() {
        if (!message.trim() || !user) return;

        try {
            const response = await fetch(`${API_FRIENDS}/${username}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sender: user.username, message }),
            });

            const data = await response.json();
            if (data.success) {
                setChatHistory([...chatHistory, { sender: user.username, content: message }]);
                setMessage("");
            }
        } catch (error) {
            console.error("🚨 Error sending message:", error.message);
        }
    }

    return (
        <div className="friend-profile-page">
            <div className="friend-banner-container" style={{ backgroundImage: `url(${banner})` }}>
                <h2 className="friend-username">{username}</h2>
            </div>

            <div className="friend-profile-container">
                <img src={profilePic} alt="Profile" className="friend-profile-pic" />
                <h2 className="friend-username">{username}</h2>

                <div className="friend-platforms">
    <h3>Gaming Platforms</h3>
    {platforms.length > 0 ? (
        <ul>
            {platforms.map((platform, index) => (
                <li key={index} className="platform-tag">{platform}</li>
            ))}
        </ul>
    ) : (
        <p>No platforms selected.</p>
    )}
</div>

<div className="friend-genres">
    <h3>Favorite Genres</h3>
    {genres.length > 0 ? (
        <ul>
            {genres.map((genre, index) => (
                <li key={index} className="genre-tag">{genre}</li>
            ))}
        </ul>
    ) : (
        <p>No favorite genres selected.</p>
    )}
</div>
            </div>

            <h2>{username}'s Recent Posts</h2>
<div className="friend-posts-container">
    {posts.length > 0 ? (
        posts.map((post) => (
            <div key={post.id} className="friend-post">
                <strong>{post.username}</strong> <span className="game-title">({post.game?.name || "Unknown Game"})</span>
                <p>{post.content}</p>
            </div>
        ))
    ) : (
        <p>No posts yet.</p>
    )}
</div>

            <h2>Message {username}</h2>
            <div className="message-container">
                <div className="chat-history">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.sender}:</strong> {msg.content}
                        </div>
                    ))}
                </div>

                <div className="message-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default FriendProfile;
