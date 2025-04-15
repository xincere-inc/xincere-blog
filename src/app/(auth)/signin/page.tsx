import SigninForm from '@/features/signin/SigninForm';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
const SigninPage = () => {
  return (
    <div
      className="min-h-screen bg-white bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/bg.jpg)' }}
    >
      {/* Main Container */}
      <ToastContainer />
      <div className="flex items-center justify-center self-center p-4 sm:p-14">
        <div className="flex w-full max-w-screen-lg overflow-hidden rounded-lg bg-white shadow-lg shadow-cyan-300">
          <div className="flex-1 bg-white p-4 sm:p-10">
            <div className="flex items-center justify-between">
              <h2 className="mb-10 text-left text-3xl font-bold text-blue-600">
                Signin
              </h2>
            </div>
            <SigninForm />
            <div className="mt-2 flex justify-center sm:mt-4">
              <p className="text-sm font-medium">
                Dont have an account?{' '}
                <Link
                  href={'/register'}
                  className="cursor-pointer text-blue-500"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
          {/* right side - image */}
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

export default SigninPage;
