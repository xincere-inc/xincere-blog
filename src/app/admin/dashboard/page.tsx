'use client';

import SingOut from '@/components/buttons/Singout';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <>
      <div>Welcome to dashboard - {user?.firstName}</div>
      <br />
      <Link href="/change-password">Change-password</Link>
      <br />
      <SingOut />
    </>
  );
}
