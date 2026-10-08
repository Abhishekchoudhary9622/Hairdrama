import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata: Metadata = {
  title: 'Hairdrama — Enterprise Task Management System',
  description: 'Next-generation project and workflow dashboard platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        className="min-h-full bg-[#EBE4DD] text-[#1A1A1A] antialiased selection:bg-[#F15A24] selection:text-white"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
