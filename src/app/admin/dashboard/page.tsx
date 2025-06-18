import SingOut from '@/components/buttons/Singout';
import getSession from '@/lib/auth/getSession';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;
  return (
    <>
      <div>Welcome to dashboard - {user?.firstName} </div>
      <br />
      <Link href="/change-password">Change-password</Link>
      <br />

      <SingOut />
    </>
  );
}
