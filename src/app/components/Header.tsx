import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AboutModal from './AboutModal';
import TipButton from './TipButton';

const Header: React.FC = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-900 text-white py-2 px-4 sm:py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Image
              src="/SaylorScope.png"  // Make sure this path is correct
              alt="SaylorScope Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
            <span className="text-xl font-bold">SaylorScope</span>
          </div>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-300 text-sm sm:text-base">Home</Link>
          <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="hover:text-gray-300 text-sm sm:text-base"
          >
            About
          </button>
          <TipButton />
        </nav>
      </header>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default Header;