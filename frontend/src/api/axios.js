import axios from "axios";

const api = axios.create({
  baseURL: "https://projecthd-skinedu.onrender.com",
 
  // baseURL: "http://localhost:3000",
});

// Helper to set token in headers dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
