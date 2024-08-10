"use client";

import Calculator from './components/Calculator';
import TipButton from './components/TipButton';
import Footer from './components/Footer';

const Header = () => (
  <header className="text-center mb-8">
    <h1 className="text-5xl font-bold text-white mb-4">SaylorScope</h1>
    <p className="text-xl text-white">Advanced Financial Analysis Tool</p>
  </header>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-900 to-emerald-500">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <TipButton />
          </div>
          <Calculator />
        </div>
      </main>
      <Footer />
    </div>
  );
}