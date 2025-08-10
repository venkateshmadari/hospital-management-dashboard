import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
