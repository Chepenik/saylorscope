import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AboutModal from './AboutModal';
import TipButton from './TipButton';
import LogoModal from './LogoModal';

const Header: React.FC = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  const openLogoModal = () => setIsLogoModalOpen(true);
  const closeLogoModal = () => setIsLogoModalOpen(false);

  const openTipModal = () => setIsTipModalOpen(true);
  const closeTipModal = () => setIsTipModalOpen(false);

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
        </div>
        <nav className="flex items-center space-x-4">
          <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="hover:text-gray-300 text-sm sm:text-base"
          >
            About
          </button>
          <Link href="https://github.com/Chepenik/saylorscope" className="hover:text-gray-300 text-sm sm:text-base" target="_blank">Code</Link>
          <button
            onClick={openTipModal}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg font-bold shadow-lg hover:from-yellow-500 hover:to-orange-600 transition duration-300 transform hover:scale-105"
          >
            Zap me ⚡
          </button>
        </nav>
      </header>
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
        onOpenTipModal={openTipModal}
      />
      <LogoModal isOpen={isLogoModalOpen} onClose={closeLogoModal} />
      <TipButton isOpen={isTipModalOpen} onClose={closeTipModal} />
    </>
  );
};

export default Header;