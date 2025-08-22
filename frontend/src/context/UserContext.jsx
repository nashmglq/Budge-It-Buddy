import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API = axios.create({
    baseURL: "http://localhost:5001",
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUser({ email, token });
    }
  }, []);

  const registerUser = async (name, email, password1, password2) => {
    const res = await API.post("/auth/register", { name, email, password1, password2 });
    return res.data;
  };

  const loginUser = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const token = res.data.success.token;

    setUser({ email, token });
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    return res.data;
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };


  const getProfile = async () => {
      if (!user?.token) return null;
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return res.data.success;
    };

  // ✅ Update user profile
  const updateProfile = async (name, email, profilePic) => {
    if (!user?.token) return null;
    const res = await API.put(
      "/auth/profile",
      { name, email, profilePic },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    return res.data;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        registerUser,
        loginUser,
        logoutUser,
        getProfile,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
