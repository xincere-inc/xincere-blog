"use client";

import BackButton from "@/components/buttons/BackButton";
import { emailSchema } from "@/lib/zod/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email using the Zod schema
    const parsedBody = emailSchema.safeParse({ email });

    // If validation fails, set the error message and return
    if (!parsedBody.success) {
      setError(parsedBody.error.errors[0].message);
      return;
    }

    // Call the API to check if the email exists
    try {
      const response = await fetch(`/api/auth/verify-email-request`, {
        method: "POST",
        body: JSON.stringify(parsedBody.data),
      });

      const data = await response.json();

      if (response.ok) {
        // If email exists, send the verification email
        setSuccess(data?.message || "Verification email sent! Redirecting...");
        setTimeout(() => {
          router.push("/sign-in"); // Redirect to the sign-in page
        }, 1500);
      } else {
        // If email doesn't exist, redirect to sign-up page
        setError(data?.error || "Email not found. Redirecting to sign-up...");
        setTimeout(() => {
          router.push("/sign-up");
        }, 1500);
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='p-6 bg-white shadow-md rounded w-96'>
        <BackButton />
        <h2 className='text-xl font-bold mb-4'>Email Verification</h2>

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
          <button
            className='bg-blue-500 text-white p-2 rounded w-full'
            type='submit'>
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
