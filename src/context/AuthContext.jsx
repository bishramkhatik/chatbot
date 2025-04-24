// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [flash, setFlash] = useState({ message: "", type: "" });

  const login = async ({ email, password }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("✅ Login response:", data);

      if (res.ok && data.user?._id && data.token) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); // ✅ save token
        window.dispatchEvent(new Event("storage"))
        setFlash({ message: "Login successful!", type: "success" });
      }
      
    } catch (err) {
      setFlash({ message: "Server error", type: "error" });
    }

    setTimeout(() => setFlash({ message: "", type: "" }), 3000);
  };

  const signup = async ({ name, email, password }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("✅ Signup response:", data);

      if (res.ok && data.user?._id && data.token) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); // ✅ save token
        window.dispatchEvent(new Event("storage"));
        setFlash({ message: "Signup successful!", type: "success" });
      }
      
    } catch (err) {
      setFlash({ message: "Server error", type: "error" });
    }

    setTimeout(() => setFlash({ message: "", type: "" }), 3000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ remove token
    window.dispatchEvent(new Event("storage"));    setFlash({ message: "Logged out successfully!", type: "success" });
    setTimeout(() => setFlash({ message: "", type: "" }), 3000);
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, flash }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
