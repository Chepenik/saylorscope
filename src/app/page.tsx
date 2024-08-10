"use client";

import Calculator from './components/Calculator';
import TipButton from './components/TipButton';
import Footer from './components/Footer';

const Header = () => (
  <header className="text-center mb-8">
    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">SaylorScope</h1>
    <p className="text-xl text-gray-200">Advanced Financial Analysis Tool</p>
  </header>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-800 to-emerald-600">
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
