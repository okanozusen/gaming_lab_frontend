import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/FriendsPage.css";

const API_FRIENDS = "https://gaming-lab.onrender.com/api/friends/list"; // ✅ Fixed route

function FriendsPage() {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, []);

    async function fetchFriends() {
        try {
            console.log("Fetching from:", API_FRIENDS); // ✅ Debug log

            const response = await fetch(API_FRIENDS, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ Ensure auth token is sent
                }
            });

            const text = await response.text();
            console.log("Raw Response:", text);

            const data = JSON.parse(text);
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
                                <img src={friend.profilePic || "https://placehold.co/50"} alt="Profile" className="friend-profile-pic" />
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
