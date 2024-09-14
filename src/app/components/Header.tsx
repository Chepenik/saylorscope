import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AboutModal from './AboutModal';
import TipButton from './TipButton';
import LogoModal from './LogoModal';

const Header: React.FC = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const openLogoModal = () => setIsLogoModalOpen(true);
  const closeLogoModal = () => setIsLogoModalOpen(false);

  return (
    <>
      <header className="bg-gray-900 text-white py-2 px-4 sm:py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0 cursor-pointer" onClick={openLogoModal}>
          <div className="relative w-[60px] h-[60px]">
            <Image
              src="/SaylorScope.png"
              alt="SaylorScope Logo"
              fill
              sizes="60px"
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-xl font-bold">SaylorScope</span>
        </div>
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
      <LogoModal isOpen={isLogoModalOpen} onClose={closeLogoModal} />
    </>
  );
};

export default Header;