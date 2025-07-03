import { useState } from "react";
import api from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setOtpSent(true);
    setStep(2);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/auth/verify-otp", { email, token:otp });
    if (data.success) setStep(3);
    else alert("Invalid OTP");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await api.post("/auth/reset-password", { email, token:otp, newPassword });
    alert("Password reset successful!");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Forgot Password
      </h2>
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
          >
            Send OTP
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
          >
            Verify OTP
          </button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
