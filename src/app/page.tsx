import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
      <p className="text-lg mb-8">Please sign in to continue.</p>
      <Link href="/signin" className="text-blue-500 hover:underline mb-4">
        Go to Sign In Page
      </Link>
    </div>
  );
};

export default HomePage;