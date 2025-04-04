"use client";

import { signOut } from "next-auth/react";

const SingOut = () => {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className='bg-gray-500 text-white p-2 rounded-md mt-4'>
      Sign out
    </button>
  );
};

export default SingOut;
