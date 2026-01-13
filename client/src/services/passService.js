// src/services/passService.js
import axiosInstance from "./axiosInstance";

const getUserPasses = async () => {
  const res = await axiosInstance.get("/passes/my");
  return res.data;
};

const bookPass = async (data) => {
  const res = await axiosInstance.post("/passes/book", data);
  return res.data;
};

const renewPass = async (passId) => {
  const res = await axiosInstance.post(`/passes/renew/${passId}`);
  return res.data;
};

export default {
  getUserPasses,
  bookPass,
  renewPass,
};
