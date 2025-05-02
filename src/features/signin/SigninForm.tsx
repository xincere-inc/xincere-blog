'use client';
import InputField from '@/components/inputs/InputField';
import PasswordField from '@/components/inputs/PasswordField';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const SigninForm = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        password: formData.password,
        redirect: false,
      });

      console.log(res);

      if (!res?.error) {
        // Redirect to dashboard or any other page
        router.push('/dashboard');
      } else {
        toast.error('Failed! check your credentials', {
          position: 'bottom-right',
          autoClose: 2000, // Auto-close after 2 seconds
        });
      }
    } catch (err: Error | any) {
      console.error('Login error:', err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        id="email"
        label="Email"
        type="text"
        placeholder="Enter your email"
        register={register('email', {
          required: 'Email is required',
        })}
        error={errors.email}
      />
      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter password"
        register={register('password', {
          required: 'Password is required',
        })}
        error={errors.password}
        value={watch('password', '')}
      />
      <Link href={'/forget-password'} className="inline-block cursor-pointer">
        <p className="text-center text-sm font-medium text-blue-500">
          Forgot Password?
        </p>
      </Link>
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Signing...' : 'Signin'}
      </button>
    </form>
  );
};

export default SigninForm;
