import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            console.log("🔍 Sending Registration Request:", formData);
            
            // ✅ Corrected API URL for registering users
            const API_BASE_URL = process.env.REACT_APP_BASE_URL || "https://gaming-lab.onrender.com";
const API_REGISTER = `${API_BASE_URL}/api/auth/register`;

const response = await fetch(API_REGISTER, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            // ✅ Check if response is HTML instead of JSON
            const textResponse = await response.text();
            if (!response.ok) {
                console.error("🚨 Server Error Response:", textResponse);
                throw new Error("Registration failed. Please try again.");
            }

            // ✅ Convert text response to JSON
            const data = JSON.parse(textResponse);
            console.log("✅ Registration Success:", data);
            navigate("/login");
        } catch (error) {
            console.error("🚨 Registration Error:", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                {error && <p className="error">{error}</p>}
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
    );
}

export default Register;
