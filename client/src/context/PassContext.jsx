import React, { createContext, useState, useEffect } from "react";
import passService from "../services/passService";

export const PassContext = createContext();

export const PassProvider = ({ children }) => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user passes from backend
  const fetchPasses = async () => {
    try {
      const res = await passService.getUserPasses();
      setPasses(res);
    } catch (err) {
      console.error("Error loading passes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Call on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchPasses();
    else setLoading(false);
  }, []);

  return (
    <PassContext.Provider value={{ passes, loading, fetchPasses }}>
      {children}
    </PassContext.Provider>
  );
};
