'use client';

import IdoAuth from '@/api/IdoAuth';
import { emailSchema } from '@/lib/zod/auth';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setLoading(true);

    // Validate email using the Zod schema
    const parsedBody = emailSchema.safeParse({ email: data.email });

    // If validation fails, set the error message and return
    if (!parsedBody.success) {
      setError('email', {
        type: 'manual',
        message: parsedBody.error.errors[0].message,
      });
      setLoading(false);
      return;
    }

    // Call the API to send a password reset email
    try {
      const response = await IdoAuth.forgetPassword({
        email: parsedBody.data.email,
      });

      if (response.status === 200) {
        // If the email was sent successfully
        toast.success(
          response.data.message || 'Password reset email sent! Check your inbox.',
          {
            position: 'bottom-right',
          }
        );
      } else {
        toast.error(
          response.data.message || 'Email not found or failed to send reset email.',
          {
            position: 'bottom-right',
          }
        );
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        // Handle specific errors
        if (err.response?.status === 400 && Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach((error: any) => {
            if (error.path === 'email') {
              setError('email', {
                type: 'manual',
                message: error.message,
              });
            }
          });
        } else {
          toast.error(err.response?.data.message || 'Something went wrong.', {
            position: 'bottom-right',
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Unexpected error occurred.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='p-6 bg-white shadow-md rounded w-96'>
        <h2 className='text-xl font-bold mb-4'>Forgot Password</h2>

        {errors.email && (
          <p className='text-red-500'>{errors.email.message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type='email'
            className='border p-2 w-full mb-2'
            placeholder='Enter your email'
            {...register('email', {
              required: 'Email is required',
            })}
          />
          <button
            className='bg-gray-500 text-white p-2 rounded-md mt-4 w-full'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
