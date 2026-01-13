// src/services/driverService.js
import axiosInstance from "./axiosInstance";

const getRoutes = async () => {
  const res = await axiosInstance.get("/driver/routes");
  return res.data;
};

const getActivePasses = async () => {
  const res = await axiosInstance.get("/driver/active");
  return res.data;
};

const validatePass = async (passId) => {
  const res = await axiosInstance.post(`/driver/validate/${passId}`);
  return res.data;
};

export default {
  getRoutes,
  getActivePasses,
  validatePass,
};
