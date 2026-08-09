import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShopAPI — Production REST Platform',
  description: 'A production-ready, scalable REST API platform built with Node.js, Express, Prisma, and PostgreSQL. Full JWT authentication, role-based access control, and real-time CRUD.',
  keywords: ['REST API', 'e-commerce', 'Node.js', 'Express', 'Prisma', 'PostgreSQL'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
