import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";  // ✅ Import Auth Context
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import GamePage from "./pages/GamePage";
import GameDetails from "./pages/GameDetails";
import FriendsPage from "./pages/FriendsPage";
import PostsPage from "./pages/PostPage";
import PostPage from "./pages/PostPage";  // ✅ Import the Post Page
import FriendProfile from "./pages/FriendProfile";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/users" element={<UserPage />} />
                        <Route path="/genres" element={<GamePage />} />
                        <Route path="/game/:id" element={<GameDetails />} />
                        <Route path="/friends" element={<FriendsPage />} />
                        <Route path="/posts" element={<PostsPage />} />
                        <Route path="/post/:id" element={<PostPage />} />  {/* ✅ Add this route */}
                        <Route path="/friends/:username" element={<FriendProfile />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
