import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";  // ✅ Correct import
import { useNavigate } from "react-router-dom";
import '../styles/Auth.css';

function Login() {
    const { login } = useAuth();  // ✅ Use login from AuthContext
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Use the environment variable for API URL
    const API_LOGIN = process.env.REACT_APP_BASE_URL 
        ? `${process.env.REACT_APP_BASE_URL}/api/auth/login` 
        : "http://localhost:5000/api/auth/login";  // Fallback to localhost in development

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch(API_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Login failed");

            console.log("✅ Login API Response:", data);

            if (!data.user || !data.token) {
                throw new Error("Invalid login response from server.");
            }

            localStorage.setItem("token", data.token);  // ✅ Store token

            // ✅ Define userData correctly using `data.user`
            const userData = { 
                id: data.user.id, 
                username: data.user.username, 
                email: data.user.email, 
                profilePic: data.user.profilePic || "https://picsum.photos/200", 
                banner: data.user.banner || "https://picsum.photos/800/250"
            };

            login(userData, data.token);  // ✅ Update user and store token

            console.log("✅ User stored in context:", userData);
            navigate("/users"); // ✅ Redirect after login
        } catch (error) {
            console.error("🚨 Login Error:", error.message);
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
