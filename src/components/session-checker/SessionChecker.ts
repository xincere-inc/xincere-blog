'use client'; // Mark this as a client component

import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionChecker() {
  const { data: session } = useSession(); // Get session data on the client side

  useEffect(() => {
    const checkSession = async () => {
      if (
        session?.expires &&
        Date.now() > new Date(session.expires).getTime()
      ) {
        await signOut({ callbackUrl: '/' }); // Await the sign-out operation
      }
    };

    checkSession();
  }, [session]);

  return null; // This component doesn't render anything
}
