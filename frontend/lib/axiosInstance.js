import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://ideamagix-project-1.onrender.com/api"
    : "http://localhost:5500/api");

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
