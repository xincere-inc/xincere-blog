'use client';

import ApiAuth from '@/api/ApiAuth';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    setLoading(true);

    // Clear previous errors
    clearErrors();

    // Token validation
    if (!token) {
      setError('password', {
        type: 'manual',
        message: 'Invalid or missing token.',
      });
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await ApiAuth.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (response.status === 200) {
        // If password reset is successful
        toast.success(response.data.message || 'Password reset successfully.', {
          position: 'bottom-right',
        });
        router.push('/signin');
      } else {
        // Handle failure response
        toast.error(response.data.message || 'Failed to reset password.', {
          position: 'bottom-right',
        });
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message || 'An unexpected error occurred.',
          {
            position: 'bottom-right',
          }
        );
      } else {
        toast.error('Unexpected error occurred.', {
          position: 'bottom-right',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow-md rounded w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="password"
            className="border p-2 w-full mb-2"
            placeholder="Enter new password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
          />
          <input
            type="password"
            className="border p-2 w-full mb-2"
            placeholder="Confirm new password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
          />
          <button
            className="bg-gray-500 text-white p-2 rounded-md mt-4 w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
