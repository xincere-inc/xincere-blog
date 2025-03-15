"use client";

import { signOut } from "@/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  // Destructure the `data` from `useSession`
  const { data: session } = useSession();

  // Access the user from the session
  const user = session?.user;

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      {/* Display user information if logged in */}
      {user ? (
        <div className='text-center'>
          <h1>Hello Next App</h1>
          <p>Welcome, {user.name || user.email}!</p>
          <button onClick={() => signOut({ redirectTo: "/sign-in" })}>
            Sign out
          </button>
        </div>
      ) : (
        <div className='text-center'>
          <h1>Hello Next App</h1>
          <p>Welcome - You are not logged in.</p>
          <Link href='/sign-in'>Signin</Link>
          <Link href='/sign-up'>Signup</Link>
        </div>
      )}
    </div>
  );
}
