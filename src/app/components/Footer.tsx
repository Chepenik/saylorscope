"use client";

import Link from 'next/link';
import { FaXTwitter, FaGithub, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link href="https://twitter.com/ConorChepenik" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
            <FaXTwitter className="w-6 h-6 hover:text-blue-400 transition duration-300" />
          </a>
        </Link>
        <Link href="https://github.com/Chepenik/saylorscope" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="w-6 h-6 hover:text-gray-400 transition duration-300" />
          </a>
        </Link>
        <Link href="https://www.linkedin.com/in/conorchepenik/" passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="w-6 h-6 hover:text-blue-700 transition duration-300" />
          </a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;