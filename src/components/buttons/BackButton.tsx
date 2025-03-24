"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button
      onClick={handleClick}
      className='bg-gray-500 text-white p-2 rounded-md mt-4'>
      Go Back
    </button>
  );
};

export default BackButton;
