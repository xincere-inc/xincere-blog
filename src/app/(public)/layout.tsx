import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Providers } from '@/providers/provider';
import { ToastContainer } from 'react-toastify';
import '../globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4">{children}</main>
        <Footer />
      </div>
      <ToastContainer />
    </Providers>
  );
}
