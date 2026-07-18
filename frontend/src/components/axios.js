import _axios from "axios";

const instance = _axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 2000,
});

instance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) config.headers["X-Admin-Token"] = adminToken;
  return config;
});

export default instance;
