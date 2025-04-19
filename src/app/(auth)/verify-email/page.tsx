'use client';

import IdoAuth from '@/api/IdoAuth';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Extract token from dynamic route params
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token is missing or invalid.');
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await IdoAuth.verifyEmail(token);

        if (response.status === 200) {
          // If email verification is successful
          setSuccess(response.data.message || 'Email verified successfully.');
          toast.success(
            response.data.message || 'Email verified successfully.',
            {
              position: 'bottom-right',
            }
          );
          // Optionally, redirect to login or another page after success
          router.push('/signin');
        } else {
          // If verification fails (e.g., invalid token)
          setError(response.data.message || 'Failed to verify email.');
          toast.error(response.data.message || 'Failed to verify email.', {
            position: 'bottom-right',
          });
        }
      } catch (err: any) {
        // Handle errors in the verification process
        if (err instanceof AxiosError) {
          toast.error(
            err.response?.data.message || 'An unexpected error occurred.',
            { position: 'bottom-right' }
          );
        } else {
          toast.error('An unexpected error occurred.', {
            position: 'bottom-right',
          });
        }
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow-md rounded w-96">
        <h2 className="text-xl font-bold mb-4">Verifying Your Email</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {loading && <p className="text-gray-500">Verifying...</p>}
      </div>
    </div>
  );
}
