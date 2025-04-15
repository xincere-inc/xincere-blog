'use client';

import RegisterForm from '@/features/register/RegisterForm';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';

const Register = () => {
  return (
    <div
      className="min-h-screen bg-white bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/bg.jpg")' }}
    >
      <ToastContainer />
      <div className="flex items-center justify-center self-center p-4 sm:p-14">
        <div className="flex w-full max-w-screen-lg rounded-lg bg-white shadow-lg shadow-cyan-300">
          <div className="flex-1 bg-white p-4 sm:p-10">
            <div className="flex items-center justify-between">
              <h2 className="mb-6 text-left text-3xl font-bold text-blue-600 sm:mb-10">
                Register
              </h2>
            </div>
            <RegisterForm />
            <div className="mt-4 flex justify-center">
              <div className="text-sm font-medium">
                Already have an account?{' '}
                <Link href={'/signin'} className="cursor-pointer text-blue-500">
                  Signin
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden flex-1 items-center justify-center bg-blue-600 md:flex">
            <Image
              src="/images/signin-bg.png"
              alt="Login"
              className="object-contain"
              height={600}
              width={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
