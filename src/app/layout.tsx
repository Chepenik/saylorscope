import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AssetsProvider } from './components/AssetsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SaylorScope',
  description: 'Advanced Financial Analysis Tool',
}

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
  )
}