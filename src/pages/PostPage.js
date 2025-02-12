import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/PostsPage.css";

const API_POSTS = "https://gaming-lab.onrender.com/api/posts";
const API_GAMES = "https://gaming-lab.onrender.com/api/games";
const API_FRIENDS = "https://gaming-lab.onrender.com/api/friends";

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
            if (!response.ok) throw new Error("Failed to fetch posts");

            const data = await response.json();
            setPosts(Array.isArray(data) ? data : []);

            // Track friends per user
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
            game_id: selectedGame.id, // ✅ Ensure game_id is passed correctly
            game_name: selectedGame.name || "Unknown Game", // ✅ Ensure game_name is always set
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
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create post");
            }
    
            const responseData = await response.json();
            console.log("✅ Post submitted successfully!", responseData);
    
            // ✅ Update state: Add new post at the top and reset inputs
            setPosts((prevPosts) => [responseData, ...prevPosts]);
            setNewPost("");
            setSelectedGame(null);
            setGameSuggestions([]);
    
            // ✅ Re-fetch posts to ensure latest data is shown
            fetchPosts();
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
            const response = await fetch(`${API_GAMES}?search=${encodeURIComponent(query)}&page=1`);
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
                        ? { ...post, replies: [responseData, ...(post.replies || [])] }
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
            {user ? (
                <form onSubmit={handlePostSubmit} className="post-form">
                    <div className="post-header">
                        <div className="left">
                            <img src={user.profilePic || "https://placehold.co/50"} alt="User" className="profile-pic" />
                            <strong>{user.username}</strong>
                        </div>

                        <div className="center">
                            {selectedGame ? (
                                <h3 className="game-title" onClick={() => navigate(`/game/${selectedGame.id}`)}>
                                    {selectedGame.name}
                                </h3>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Search for a game..."
                                    value={newPost}
                                    onChange={handleGameSearch}
                                    className="game-search"
                                />
                            )}

                            {gameSuggestions.length > 0 && (
                                <div className="game-suggestions">
                                    {gameSuggestions.map((game) => (
                                        <div
                                            key={game.id}
                                            onClick={() => {
                                                setSelectedGame(game);
                                                setNewPost("");
                                                setGameSuggestions([]);
                                            }}
                                            className="suggestion"
                                        >
                                            {game.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Write your thoughts..."
                        disabled={!selectedGame}
                    />

                    <button type="submit" disabled={!selectedGame || !newPost.trim()}>
                        Post
                    </button>
                </form>
            ) : (
                <p>Please log in to post.</p>
            )}

            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <div className="post-header">
                            <div className="left">
                                <img src={post.profilePic || "https://placehold.co/50"} alt="User" className="profile-pic" />
                                <strong>{post.username}</strong>
                            </div>
                            <div className="center">
                                <h3 
                                    className="game-title"
                                    style={{ cursor: post.game_id ? "pointer" : "default", color: post.game_id ? "#007bff" : "black" }} 
                                    onClick={() => post.game_id && navigate(`/game/${post.game_id}`)}
                                >
                                    {post.game_name || "Unknown Game"}
                                </h3>
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
