import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AssetsProvider } from './components/AssetsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaylorScope - Advanced Financial Analysis Tool',
  description: 'SaylorScope is a premier calculator for figuring out the first law of money. It is designed to help with financial analysis and wealth building, inspired by Michael Saylor\'s speech at the 2024 Bitcoin Conference in Nashville.',
  keywords: ['Bitcoin', 'financial analysis', 'wealth building', 'Michael Saylor', 'cryptocurrency', 'digital assets'],
  openGraph: {
    title: 'SaylorScope - Advanced Financial Analysis Tool',
    description: 'Premier calculator for Bitcoin and other asset focused financial analysis and wealth building',
    type: 'website',
    url: 'https://saylorscope.com', 
    images: [
      {
        url: 'https://i.nostr.build/V2FLC7jrbH1LbwEz.webp', 
        width: 1200,
        height: 630,
        alt: 'SaylorScope',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AssetsProvider>
        <body className={inter.className}>{children}</body>
      </AssetsProvider>
    </html>
  );
}