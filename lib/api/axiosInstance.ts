// import axios from "axios";
// import { getToken, removeToken } from "./auth";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       removeToken();
//       console.warn("Token expired or invalid. Redirecting to login...");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
