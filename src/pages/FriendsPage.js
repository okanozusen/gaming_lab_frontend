import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/FriendsPage.css";

const API_FRIENDS = `${process.env.REACT_APP_BASE_URL}/api/friends`;

function FriendsPage() {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, []);

    async function fetchFriends() {
        try {
            const response = await fetch(API_FRIENDS);
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            console.error("🚨 Error fetching friends:", error.message);
            setFriends([]);
        }
    }

    return (
        <div className="friends-page">
            <h1>Friends List</h1>
            <ul className="friends-list">
                {friends.length > 0 ? (
                    friends.map((friend, index) => (
                        <li key={index}>
                            {/* ✅ Clicking friend links to their profile */}
                            <Link to={`/friends/${friend.username}`} className="friend-link">
                                <img src={friend.profilePic} alt="Profile" className="friend-profile-pic" />
                                {friend.username}
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No friends yet. Add some!</p>
                )}
            </ul>
        </div>
    );
}

export default FriendsPage;
