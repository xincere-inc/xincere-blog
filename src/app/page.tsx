"use client";

import { signInSchema } from "@/lib/zod/auth/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with Zod schema
    const result = signInSchema.safeParse({ email, password });

    if (!result.success) {
      // If validation fails, set the error message
      setError(result.error.errors.map((err) => err.message).join(", "));
      return;
    }

    // Clear any previous error messages
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      console.log(res);
      setError("Invalid email or password");
      return;
    }
    setSuccess("Sign In successful! Redirecting...");

    setTimeout(() => {
      router.push("/dashboard"); // Redirect to protected page
    }, 1500);
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <h2 className='text-xl font-bold mb-4'>Sign In</h2>
        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500 mb-2'>{success}</p>}

        <input
          type='email'
          className='border p-2 w-full mb-2'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          className='border p-2 w-full mb-4'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='flex'>
          <Link
            href='/forget-password'
            className='text-blue-500 hover:underline'>
            Forgot password?
          </Link>
        </div>
        <button
          className='bg-gray-500 text-white p-2 rounded-md mt-4 w-full'
          type='submit'>
          Login
        </button>
        <div className='flex'>
          Already have an account?
          <Link href='/sign-up' className='text-blue-500 hover:underline'>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
