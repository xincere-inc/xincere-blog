import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Providers } from '@/providers/provider';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    </Providers>
  );
}
