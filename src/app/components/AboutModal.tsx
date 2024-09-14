import React from 'react';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
        <h2 className="text-3xl font-bold mb-4">About SaylorScope</h2>
        <div className="space-y-4">
          <p>
            SaylorScope is an open-source financial analysis tool inspired by Michael Saylor&apos;s insights on Bitcoin and asset management. It&apos;s designed to help you compare different types of assets and understand their long-term potential.
          </p>
          <div>
            <p>This tool allows you to:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Input various types of assets (digital, physical, financial)</li>
              <li>Estimate maintenance costs and appreciation rates using AI</li>
              <li>Calculate and compare long-term value projections</li>
              <li>Visualize asset performance over time</li>
            </ul>
          </div>
          <p>
            As an open-source project, we encourage you to hack, build upon, and improve SaylorScope. Your contributions can help make this tool even more valuable for the community.
          </p>
          <p>
            If you find SaylorScope useful, consider supporting its development by using the &quot;Zap Me&quot; button in the header. Your sats help us maintain and improve the tool. Remember, every sat counts!
          </p>
          <p className="font-semibold">
            We love Bitcoin and believe in its potential to change the world. By providing tools like SaylorScope, we hope to contribute to a future of sound money and financial sovereignty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;