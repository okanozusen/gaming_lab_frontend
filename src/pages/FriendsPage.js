import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ Import Auth Context
import "../styles/FriendsPage.css";

const API_FRIENDS = "https://gaming-lab.onrender.com/api/friends"; // ✅ Fixed route

function FriendsPage() {
    const { user } = useAuth(); // ✅ Get user from context
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (user) fetchFriends();
    }, [user]); // ✅ Fetch only when user exists

    async function fetchFriends() {
        if (!user || !user.username) return; // ✅ Ensure user exists

        try {
            console.log(`Fetching from: ${API_FRIENDS}/list?username=${user.username}`);

            const response = await fetch(`${API_FRIENDS}/list?username=${user.username}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            console.log("✅ Friends List Received:", data);
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
                            <Link to={`/users/${friend.username}`} className="friend-link">
                                <img src={friend.profile_pic || "https://placehold.co/50"} alt="Profile" className="friend-profile-pic" />
                                {friend.username}
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No friends yet. Add some from posts!</p>
                )}
            </ul>
        </div>
    );
}

export default FriendsPage;
