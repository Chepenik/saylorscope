"use client";

import Head from 'next/head';
import Calculator from './components/Calculator';
import TipButton from './components/TipButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-900 to-emerald-500">
      <Head>
        <title>SaylorScope: Advanced Financial Analysis Tool</title>
        <meta name="description" content="SaylorScope - The premier calculator for Bitcoin-focused financial analysis and wealth building, inspired by Michael Saylor's principles" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">SaylorScope</h1>
          <p className="text-xl text-white">Advanced Financial Analysis Tool</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <TipButton />
          </div>
          <Calculator />
        </div>
      </main>
    </div>
  );
}