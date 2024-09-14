"use client";

import Link from 'next/link';
import { FaXTwitter, FaGithub, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-transparent text-white py-6 relative z-10">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link href="https://twitter.com/ConorChepenik" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="hover:opacity-75 transition duration-300">
            <FaXTwitter className="w-6 h-6" />
          </a>
        </Link>
        <Link href="https://github.com/Chepenik/saylorscope" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:opacity-75 transition duration-300">
            <FaGithub className="w-6 h-6" />
          </a>
        </Link>
        <Link href="https://www.linkedin.com/in/conorchepenik/" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-75 transition duration-300">
            <FaLinkedin className="w-6 h-6" />
          </a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;