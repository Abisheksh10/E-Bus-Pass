// src/services/adminService.js
import axiosInstance from "./axiosInstance";

const getPendingPasses = async () => {
  const res = await axiosInstance.get("/admin/pending");
  return res.data;
};

const approvePass = async (passId) => {
  const res = await axiosInstance.put(`/admin/approve/${passId}`);
  return res.data;
};

const declinePass = async (passId) => {
  const res = await axiosInstance.put(`/admin/decline/${passId}`);
  return res.data;
};

export default {
  getPendingPasses,
  approvePass,
  declinePass,
};
