import getSession from "@/lib/getSession";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;
  return <div>Welcome to dashboard - {user?.name} </div>;
}
