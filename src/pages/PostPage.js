import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/PostsPage.css";

const API_POSTS = "http://localhost:5000/api/posts";
const API_GAMES = "http://localhost:5000/api/games";
const API_FRIENDS = "http://localhost:5000/api/friends";

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

            // ✅ Track friends per user
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
    
        if (!user?.username) {
            console.error("🚨 User is not logged in!");
            return;
        }
    
        if (!newPost.trim()) {
            console.error("🚨 Cannot submit an empty post!");
            return;
        }
    
        if (!selectedGame) {
            console.error("🚨 No game selected!");
            return;
        }
    
        const post = {
            username: user.username,
            profilePic: user?.profilePic || "https://placehold.co/50",
            content: newPost.trim(),
            game_id: selectedGame?.id || null,
            game_name: selectedGame?.name || "Unknown Game",
        };
    
        console.log("📤 Sending Post Data:", post);
    
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
            if (!response.ok) {
                console.error("🚨 Server Error:", responseData);
                throw new Error(responseData.error || "Failed to create post");
            }
    
            console.log("✅ Post submitted successfully!");
    
            // ✅ Re-fetch posts to ensure it appears on refresh
            fetchPosts();
    
            // ✅ Prepend new post at the top
            setPosts((prevPosts) => [responseData, ...prevPosts]);  // Add new post at the top of the list
    
            // ✅ Reset form
            setNewPost("");
            setSelectedGame(null);
            setGameSuggestions([]);
        } catch (error) {
            console.error("🚨 Error posting:", error.message);
        }
    }
    
    async function handleReplySubmit(e, postId) {
        e.preventDefault();
        if (!replyContent[postId]?.trim() || !user) return;
    
        const replyData = {
            username: user.username || "Guest",
            content: replyContent[postId].trim(),
        };
    
        console.log("📤 Sending Reply:", replyData);
    
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
    
            if (!response.ok) {
                console.error("🚨 Server Error:", responseData);
                throw new Error(responseData.error || "Failed to post reply");
            }
    
            // ✅ Ensure replies exist and add new reply correctly
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, replies: [responseData, ...(post.replies || [])] } // Prepend new reply at the top of the list
                        : post
                )
            );
    
            setReplyContent((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("🚨 Error posting reply:", error.message);
        }
    }
        
    async function fetchPosts() {
        try {
            const response = await fetch(API_POSTS);
            const data = await response.json();
            setPosts(Array.isArray(data) ? data : []);
      
            // ✅ Track friends per user
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
    
    async function handleReplySubmit(e, postId) {
        e.preventDefault();
        if (!replyContent[postId]?.trim() || !user) return;
    
        const replyData = {
            username: user.username || "Guest",
            content: replyContent[postId].trim(),
        };
    
        console.log("📤 Sending Reply:", replyData);
    
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
    
            if (!response.ok) {
                console.error("🚨 Server Error:", responseData);
                throw new Error(responseData.error || "Failed to post reply");
            }
    
            // ✅ Ensure replies exist and add new reply correctly
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
    
    async function handleGameSearch(e) {
        const query = e.target.value.trim();
        setNewPost(query);

        if (query.length < 2) {
            setGameSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${API_GAMES}/search?search=${query}`);
            const data = await response.json();
            setGameSuggestions(data.slice(0, 5));
        } catch (error) {
            console.error("🚨 Error fetching game suggestions:", error.message);
            setGameSuggestions([]);
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
            {/* ✅ Add Back the Form for Creating Posts */}
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
                                <h3 className="game-title" onClick={() => post.game_id ? navigate(`/game/${post.game_id}`) : null}>
                                    {post.game_name ? post.game_name : "Unknown Game"}
                                </h3>
                            </div>
                        </div>
                        <p>{post.content}</p>

                        <div className="replies">
    {Array.isArray(post.replies) && post.replies.length > 0 ? (
        post.replies.map((reply, index) => (
            <div key={index} className="reply">
                <strong>
                    {reply.username ? reply.username : post.username === "Guest" ? "Guest" : "Unknown User"}:
                </strong> 
                {reply.content ? reply.content : "(No Content)"} 

                {/* ✅ Only show "Add Friend" button for other users (not yourself) */}
                {reply.username && reply.username !== user?.username && (
                    <button 
                        className="friend-btn" 
                        style={{ float: "right" }} // ✅ Keeps button on the right
                        onClick={() => handleAddFriend(reply.username)}
                    >
                        {friends[reply.username] ? "Friend Added" : "+ Add Friend"}
                    </button>
                )}
            </div>
        ))
    ) : (
        <p>No replies yet.</p>
    )}
</div>



                        {user && (
                            <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="reply-form">
                                <textarea
                                    value={replyContent[post.id] || ""}
                                    onChange={(e) =>
                                        setReplyContent({ ...replyContent, [post.id]: e.target.value })
                                    }
                                    placeholder="Write a reply..."
                                />
                                <button type="submit">Reply</button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostsPage;
