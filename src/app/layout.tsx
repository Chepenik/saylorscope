import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaylorScope - Advanced Financial Analysis Tool',
  description: 'SaylorScope is a premier calculator for figuring out the first law of money. It is designed to help with financial analysis and wealth building, inspired by Michael Saylor\'s speech at the 2024 Bitcoin Conference in Nashville.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}