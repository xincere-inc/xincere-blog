"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      email,
      password,
    });
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={handleSubmit} className='p-6 bg-white shadow-md rounded'>
        <h2 className='text-xl font-bold mb-4'>Login</h2>
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
        <button
          className='bg-blue-500 text-white p-2 rounded w-full'
          type='submit'>
          Login
        </button>
      </form>
    </div>
  );
}
