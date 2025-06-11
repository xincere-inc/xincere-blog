'use client';
import ApiAuth from '@/api/ApiAuth';
import PasswordField from '@/components/inputs/PasswordField';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<ChangePasswordForm> = async (data) => {
    setLoading(true);

    try {
      const res = await ApiAuth.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (res.status === 200) {
        toast.success(res.data.message || 'Password updated.', {
          position: 'bottom-right',
        });
        router.push('/dashboard');
      } else {
        toast.error(res.data.message || 'Failed to update password.', {
          position: 'bottom-right',
        });
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 400 &&
          Array.isArray(err.response.data.errors)
        ) {
          err.response.data.errors.forEach((error: any) => {
            if (
              ['oldPassword', 'newPassword', 'confirmPassword'].includes(
                error.path
              )
            ) {
              setError(error.path as keyof ChangePasswordForm, {
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
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 bg-white rounded shadow"
      >
        <h2 className="mb-4 text-xl font-bold text-center">Change Password</h2>

        <PasswordField
          id="oldPassword"
          label="Old Password"
          placeholder="Enter old password"
          register={register('oldPassword', {
            required: 'Old password is required',
          })}
          error={errors.oldPassword}
          value={watch('oldPassword')}
          isPassword
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="Enter new password"
          register={register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.newPassword}
          value={watch('newPassword')}
          isPassword
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter new password"
          register={register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === getValues('newPassword') || 'Passwords do not match',
          })}
          error={errors.confirmPassword}
          value={watch('confirmPassword')}
          isPassword
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-4 text-white bg-gray-600 rounded hover:bg-gray-700"
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
