import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/PostsPage.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://gaming-lab.onrender.com";
const API_POSTS = `${API_BASE_URL}/api/posts`;
const API_GAMES = `${API_BASE_URL}/api/games`;
const API_FRIENDS = `${API_BASE_URL}/api/friends`;

function PostsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameSuggestions, setGameSuggestions] = useState([]);
    const [replyContent, setReplyContent] = useState({});
    const [friends, setFriends] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const response = await fetch(API_POSTS);
            const data = await response.json();
            setPosts(Array.isArray(data) ? data : []);

            const friendMap = {};
            data.forEach(post => {
                post.replies?.forEach(reply => {
                    friendMap[reply.username] = reply.isFriend || false;
                });
            });

            setFriends(friendMap);
        } catch (error) {
            console.error("🚨 Error fetching posts:", error.message);
        }
    }

    async function handlePostSubmit(e) {
        e.preventDefault();
        if (!user?.username || !newPost.trim() || !selectedGame) {
            console.error("🚨 Missing post details!");
            return;
        }

        const post = {
            username: user.username,
            profilePic: user?.profilePic || "https://placehold.co/50",
            content: newPost.trim(),
            game_id: selectedGame?.id || null,
            game_name: selectedGame?.name || "Unknown Game",
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(API_POSTS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(post),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || "Failed to create post");

            console.log("✅ Post submitted successfully!");
            fetchPosts();
            setPosts((prevPosts) => [responseData, ...prevPosts]);
            setNewPost("");
            setSelectedGame(null);
            setGameSuggestions([]);
        } catch (error) {
            console.error("🚨 Error posting:", error.message);
        }
    }

    async function handleGameSearch(e) {
        const query = e.target.value.trim();
        setNewPost(query);

        if (query.length < 2) {
            setGameSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${API_GAMES}/search?search=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Server responded with an error");

            const data = await response.json();
            setGameSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
        } catch (error) {
            console.error("🚨 Error fetching game suggestions:", error.message);
            setGameSuggestions([]);
        }
    }

    async function handleReplySubmit(e, postId) {
        e.preventDefault();
        if (!replyContent[postId]?.trim() || !user) return;

        const replyData = {
            username: user.username || "Guest",
            content: replyContent[postId].trim(),
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_POSTS}/${postId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(replyData),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || "Failed to post reply");

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, replies: [...(post.replies || []), responseData] }
                        : post
                )
            );
            setReplyContent((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("🚨 Error posting reply:", error.message);
        }
    }

    async function handleAddFriend(friendUsername) {
        if (!user || !friendUsername || friends[friendUsername] || friendUsername === user.username) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_FRIENDS}/add-friend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentUser: user.username,
                    friendUsername,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setFriends(prev => ({ ...prev, [friendUsername]: true }));
            }
        } catch (error) {
            console.error("🚨 Error adding friend:", error.message);
        }
    }

    return (
        <div className="posts-page">
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <div className="post-header">
                            <div className="left">
                                <img src={post.profilePic || "https://placehold.co/50"} alt="User" className="profile-pic" />
                                <strong>{post.username}</strong>
                                {post.username !== user?.username && (
                                    <button onClick={() => handleAddFriend(post.username)}>
                                        {friends[post.username] ? "Friend Added" : "+ Add Friend"}
                                    </button>
                                )}
                            </div>
                        </div>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostsPage;
