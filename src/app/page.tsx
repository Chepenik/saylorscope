"use client";

import Calculator from './components/Calculator';
import Footer from './components/Footer';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-800 to-emerald-500">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">SaylorScope</h1>
          <p className="text-lg sm:text-xl text-gray-200">Advanced Financial Analysis Tool</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Calculator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
