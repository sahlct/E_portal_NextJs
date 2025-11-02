"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setToken, getToken, loginUser } from "@/lib/api/auth";
import { sendOtp, verifyOtp, resetPassword } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"login" | "forgot" | "otp" | "reset">(
    "login"
  );

  const router = useRouter();

  // ----------------------------
  // LOGIN HANDLER
  // ----------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res?.token) {
        setToken(res.token);
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/admin/protected/dashboard");
        }, 300);
      } else {
        toast.error("Invalid login credentials");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // SEND OTP HANDLER
  // ----------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp({ email });
      toast.success("OTP sent successfully!");
      setStage("otp");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // VERIFY OTP HANDLER
  // ----------------------------
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //   setError("");
    setLoading(true);
    try {
      const otpValue = otp.join("");
      const res = await verifyOtp({ email, otp: otpValue });

      // ✅ FIXED logic
      if (res.message?.toLowerCase().includes("otp verified")) {
        if (res.token) setToken(res.token); // <-- correct key
        setStage("reset");
        toast.success("OTP verified successfully!");
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (err: any) {
      // setError(err.message || "Invalid OTP");
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // RESET PASSWORD HANDLER
  // ----------------------------
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        newPassword
      )
    ) {
      toast.error(
        "Password must include letters, numbers, and special characters"
      );
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) throw new Error("Missing token");

      const res = await resetPassword({ email, password: newPassword });

      toast.success("Password reset successful!");

      // ✅ Ensure token still exists or re-set it if new one returned
      if (res?.token) {
        setToken(res.token);
      }

      const finalToken = getToken();
      if (finalToken) {
        router.push("/admin/protected/dashboard");
      } else {
        toast.error("Session expired. Please log in again.");
        router.push("/admin/auth");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // OTP FIELD HANDLER
  // ----------------------------
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3 && value) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/images/bg-pattern.jpg')] relative">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          {stage === "login"
            ? "Welcome Back"
            : stage === "forgot"
            ? "Forgot Password"
            : stage === "otp"
            ? "Verify OTP"
            : "Reset Password"}
        </h2>

        {stage === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setStage("forgot")}
                className="text-sm text-blue-300 hover:text-blue-200"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {stage === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-200 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setStage("login")}
                className="text-sm text-blue-300 hover:text-blue-200"
              >
                Back to Login
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div className="flex justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength={1}
                  className="w-14 h-14 text-center bg-white/20 border border-white/30 rounded-lg text-xl text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {stage === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-200 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
