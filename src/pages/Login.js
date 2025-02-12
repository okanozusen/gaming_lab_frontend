import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/Auth.css';

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ✅ Correct API URL
    const API_BASE_URL = process.env.REACT_APP_BASE_URL || "https://gaming-lab.onrender.com";
    const API_LOGIN = `${API_BASE_URL}/api/auth/login`;
    
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch(`${API_LOGIN}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // ✅ Check if response is HTML instead of JSON
            const textResponse = await response.text();
            if (!response.ok) {
                console.error("🚨 Server Error Response:", textResponse);
                throw new Error("Login failed. Please check your credentials.");
            }

            // ✅ Convert text response to JSON
            const data = JSON.parse(textResponse);
            if (!data.user || !data.token) {
                throw new Error("Invalid login response from server.");
            }

            localStorage.setItem("token", data.token);

            // ✅ Define userData correctly
            const userData = { 
                id: data.user.id, 
                username: data.user.username, 
                email: data.user.email, 
                profilePic: data.user.profilePic || "https://picsum.photos/200", 
                banner: data.user.banner || "https://picsum.photos/800/250"
            };

            login(userData, data.token);
            console.log("✅ User stored in context:", userData);
            navigate("/users");
        } catch (error) {
            console.error("🚨 Login Error:", error.message);
            setError(error.message);
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
