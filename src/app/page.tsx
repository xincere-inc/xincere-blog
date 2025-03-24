import Link from "next/link";

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <div className='text-center'>
        <h1>Hello Next App</h1>
        <p>Welcome - You are not logged in.</p>
        <br />
        <Link href='/sign-in'>Signin</Link>
        <br />
        <Link href='/sign-up'>Signup</Link>
        <br />
        <Link href='/forget-password'>Forget Password</Link>
        <br />
      </div>
    </div>
  );
}
