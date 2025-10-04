import axios from "axios";

const API = axios.create({
  baseURL: "https://amak.pythonanywhere.com/api/forms/", 
});

// JWT token if using authentication
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
