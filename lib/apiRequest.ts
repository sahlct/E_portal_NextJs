import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";

// You can configure this globally for your test/prod environments
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // 20 seconds
});

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    toast.error(message);
    return Promise.reject(error);
  }
);

/**
 * Universal API Request Function
 * @param {string} url - API endpoint
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method - HTTP method
 * @param {any} body - Request body (JSON or FormData)
 * @param {boolean} isFormData - Pass true if body is FormData
 */
export default async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  isFormData: boolean = false
): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      url,
      method,
      headers: {},
    };

    // handle FormData vs JSON
    if (method !== "GET" && method !== "DELETE") {
      if (isFormData) {
        config.data = body;
        config.headers!["Content-Type"] = "multipart/form-data";
      } else {
        config.data = body;
        config.headers!["Content-Type"] = "application/json";
      }
    }

    const response = await api(config);
    return response.data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw error;
  }
}
