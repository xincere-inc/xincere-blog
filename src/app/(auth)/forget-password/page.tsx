"use client";

import BackButton from "@/components/buttons/BackButton";
import { emailSchema } from "@/lib/zod/auth";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email using the Zod schema
    const parsedBody = emailSchema.safeParse({ email });

    // If validation fails, set the error message and return
    if (!parsedBody.success) {
      setError(parsedBody.error.errors[0].message);
      return;
    }

    // Call the API to send a password reset email
    try {
      const response = await fetch(`/api/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedBody.data),
      });

      const data = await response.json();

      if (response.ok) {
        // If the email was sent successfully
        setSuccess(
          data?.message || "Password reset email sent! Check your inbox."
        );
      } else {
        // If an error occurs (e.g., email not found)
        setError(
          data?.error || "Email not found or failed to send reset email."
        );
      }
    } catch (err) {
      console.error("Error sending password reset email:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='p-6 bg-white shadow-md rounded w-96'>
        <BackButton />
        <h2 className='text-xl font-bold mb-4'>Forgot Password</h2>

        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500'>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type='email'
            className='border p-2 w-full mb-2'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className='p-2 rounded w-full' type='submit'>
            Send Password Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}
