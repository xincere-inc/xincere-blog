"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data?.message || "Password reset successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(data?.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='p-6 bg-white shadow-md rounded w-96'>
        <h2 className='text-xl font-bold mb-4'>Reset Password</h2>

        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500'>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type='password'
            className='border p-2 w-full mb-2'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type='password'
            className='border p-2 w-full mb-2'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className='bg-gray-500 text-white p-2 rounded-md mt-4 w-full'
            type='submit'>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
