"use client";

import { changePasswordSchema } from "@/lib/zod/auth/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod schema
    const result = changePasswordSchema.safeParse(form);

    if (!result.success) {
      // If validation fails, set the error message
      setError(result.error.errors.map((err) => err.message).join(", "));
      return;
    }

    // Clear any previous error messages
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json(); // Parse the response body

    // Check if the response was successful and display messages accordingly
    if (res.ok) {
      setSuccess(data.message || "Password changed successfully!"); // Display success message from the response
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to protected page
      }, 1500);
    } else {
      setError(data.error || "Password change failed. Please try again."); // Display error message from the response
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <h2 className='text-xl font-bold mb-4'>Change Password</h2>

        {error && <p className='text-red-500 mb-2'>{error}</p>}
        {success && <p className='text-green-500 mb-2'>{success}</p>}

        <input
          type='password'
          placeholder='Old Password'
          className='border p-2 w-full mb-2'
          onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
        />
        <input
          type='password'
          placeholder='New Password'
          className='border p-2 w-full mb-2'
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <input
          type='password'
          placeholder='Confirm New Password'
          className='border p-2 w-full mb-4'
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        <button
          className='bg-gray-500 text-white p-2 rounded-md mt-4 w-full'
          type='submit'>
          Change Password
        </button>
      </form>
    </div>
  );
}
