import axios from "axios";

const api = axios.create({
  baseURL: "https://confluence-clone-backend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Request Interceptor: Token", token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
