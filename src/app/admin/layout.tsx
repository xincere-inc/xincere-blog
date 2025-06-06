import AdminLayout from '@/components/admin/AdminLayout';
import { Providers } from '@/components/provider';
import SessionChecker from '@/components/session-checker/SessionChecker';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import '../globals.css';

export const metadata: Metadata = {
  title: 'XBlog',
  description: 'Admin Panel for the application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <SessionChecker />

        <AntdRegistry>
          <AdminLayout>{children}</AdminLayout>
        </AntdRegistry>
      </Providers>
      <ToastContainer />
    </>
  );
}
