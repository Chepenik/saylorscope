import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoModal: React.FC<LogoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-4">Logo</h2>
        <div className="relative w-full aspect-square mb-4">
          <Image
            src="/SaylorScope.png"
            alt="SaylorScope Logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoModal;