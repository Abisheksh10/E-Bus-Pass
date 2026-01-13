// src/services/authService.js
import axiosInstance from "./axiosInstance";

const signup = async (formData) => {
  const res = await axiosInstance.post("/auth/signup", formData);
  return res.data;
};

const login = async (formData) => {
  const res = await axiosInstance.post("/auth/login", formData);
  return res.data;
};

const getProfile = async () => {
  const res = await axiosInstance.get("/auth/profile");
  return res.data;
};

export default {
  signup,
  login,
  getProfile,
};
