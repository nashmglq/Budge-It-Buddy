import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API = axios.create({
    baseURL: "http://localhost:5001", // backend URL
  });

  const registerUser = async (name, email, password1, password2) => {
    const res = await API.post("/auth/register", { name, email, password1, password2 });
    return res.data;
  };

  const loginUser = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setUser({ email, token: res.data.success.token });
    localStorage.setItem("token", res.data.success.token);
    return res.data;
  };

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};
