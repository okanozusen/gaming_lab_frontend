import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // ✅ Add `setUser` here

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("🚨 Error parsing user data:", error);
            }
        }
    }, []);

    const login = (userData, token) => {
        if (!userData || !userData.username) {
            console.error("🚨 Login error: userData is missing fields", userData);
            return;
        }
        if (!token) {
            console.error("🚨 Login error: Token is missing!");
            return;
        }

        setUser(userData);  // ✅ Now `setUser` is defined correctly
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
        <AuthContext.Provider value={{ user, setUser, login, logout }}>  {/* ✅ Make sure `setUser` is provided */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
