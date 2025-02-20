import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                fetchUserProfile(parsedUser.username); // ✅ Fetch latest profile pic on load
            } catch (error) {
                console.error("🚨 Error parsing user data:", error);
                setUser(null);
            }
        }
    }, []);

    // ✅ Fetch latest user profile from the backend
    const fetchUserProfile = async (username) => {
        if (!username) return;

        try {
            const response = await fetch(`https://gaming-lab.onrender.com/api/users/${username}`);
            if (!response.ok) throw new Error("Failed to fetch user profile");

            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Persist latest user info
        } catch (error) {
            console.error("🚨 Error fetching user profile:", error.message);
        }
    };

    const login = (userData, token) => {
        if (!userData || !userData.username) {
            console.error("🚨 Login error: userData is missing fields", userData);
            return;
        }
        if (!token) {
            console.error("🚨 Login error: Token is missing!");
            return;
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        console.log("✅ Login successful - User and token saved!", userData, token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
