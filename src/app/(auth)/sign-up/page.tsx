"use client";

import { signUpSchema } from "@/lib/zod/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod schema
    const result = signUpSchema.safeParse(form);

    if (!result.success) {
      // If validation fails, set the error message
      setError(result.error.errors.map((err) => err.message).join(", "));
      return;
    }

    // Clear any previous error messages
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json(); // Parse the response body

    // Handle success or error based on the response
    if (res.ok) {
      setSuccess(data.message || "Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/"); // Redirect after success
      }, 1500);
    } else {
      setError(data.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <h2 className='text-xl font-bold mb-4'>Sign up</h2>

        {error && <p className='text-red-500 mb-2'>{error}</p>}
        {success && <p className='text-green-500 mb-2'>{success}</p>}

        <input
          type='text'
          placeholder='Name'
          className='border p-2 w-full mb-2'
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-2 w-full mb-2'
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-2 w-full mb-4'
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className='bg-gray-500 text-white p-2 rounded-md mt-4 w-full'
          type='submit'>
          Signup
        </button>

        <div className='flex'>
          Already have an account?
          <Link href='/' className='text-blue-500 hover:underline'>
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
