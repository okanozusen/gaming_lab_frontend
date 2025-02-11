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

    const isValidPassword = (password) => {
        return /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Log to check the data being sent
            console.log("🔍 Sending Registration Request:", formData);
            
            // Use the environment variable to determine the API base URL
            const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorMsg = await response.json();
                throw new Error(errorMsg.message || "Registration failed");
            }
    
            const data = await response.json();
            console.log("✅ Registration Success:", data);
            navigate("/login");
        } catch (error) {
            console.error("🚨 Registration Error:", error.message);
            setError(error.message);  // Update state to show error message on the UI
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
