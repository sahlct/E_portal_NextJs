import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ======================
// AUTH API FUNCTIONS
// ======================

// ---------- LOGIN ----------
export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // Store token immediately if received
    if (response.data?.token) setToken(response.data.token);

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

// ---------- SEND OTP ----------
export async function sendOtp(payload: { email: string }) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/mail-verify`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Send OTP error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
}

// ---------- VERIFY OTP ----------
export async function verifyOtp(payload: { email: string; otp: string }) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/otp-verify`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    // ✅ Store token if available in OTP verify response
    if (response.data?.token) setToken(response.data.token);

    return response.data;
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Invalid OTP");
  }
}

// ---------- RESET PASSWORD ----------
export async function resetPassword(payload: { email: string; password: string }) {
  try {
    const token = getToken(); // ✅ Use stored token
    if (!token) throw new Error("No valid token found");

    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ If API returns a new token, store it again
    if (response.data?.token) setToken(response.data.token);

    // ✅ Otherwise keep existing token (don’t remove it)
    return response.data;
  } catch (error: any) {
    console.error("Reset password error:", error.response?.data || error.message);

    // ❌ Only remove token if explicitly unauthorized
    if (error.response?.status === 401) {
      removeToken();
    }

    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
}


// ======================
// TOKEN HELPERS
// ======================
// /lib/api/auth.ts
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

// ---------- VERIFY TOKEN VALIDITY ----------
export const isTokenValid = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await axios.get(`${BASE_URL}/api/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.valid) {
      return true;
    } else {
      removeToken();
      return false;
    }
  } catch (error: any) {
    console.error("Token validation failed:", error.response?.data || error.message);
    removeToken();
    return false;
  }
};

// ---------- GET USER DETAILS FROM VALID TOKEN ----------
export const getAuthenticatedUser = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await axios.get(`${BASE_URL}/api/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.valid) {
      return response.data.user;
    } else {
      removeToken();
      return null;
    }
  } catch (error: any) {
    removeToken();
    return null;
  }
};
