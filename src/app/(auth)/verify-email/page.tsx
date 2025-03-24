"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Extract token from dynamic route params
  const searchParam = useSearchParams();

  const token = searchParam.get("token");

  console.log(token);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Make the API call to verify the email
        const response = await fetch(
          `/api/auth/verify-email?token=${token as string}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSuccess(
            data.message || "Email successfully verified! Redirecting..."
          );
          setTimeout(() => {
            router.push("/sign-in"); // Redirect to sign-in after verification
          }, 1500);
        } else {
          setError(data.error || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error during email verification:", error);
        setError("An unexpected error occurred.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='p-6 bg-white shadow-md rounded w-96'>
        <h2 className='text-xl font-bold mb-4'>Verifying Your Email</h2>
        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500'>{success}</p>}
      </div>
    </div>
  );
}
