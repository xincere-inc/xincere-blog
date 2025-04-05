'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">403 - Unauthorized</h1>
      <p className="mt-4">You don’t have permission to access this page.</p>
      <button
        onClick={handleReturnHome}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Home
      </button>
    </div>
  );
}
