import React from 'react';

interface AIEstimationButtonProps {
  onEstimate: () => Promise<void>;
  isLoading: boolean;
  estimationType: 'maintenance' | 'appreciation';
}

const AIEstimationButton: React.FC<AIEstimationButtonProps> = ({ onEstimate, isLoading, estimationType }) => {
  const handleClick = () => {
    onEstimate();
  };

  return (
    <button
      onClick={handleClick}
      className={`text-white px-2 py-1 rounded transition-colors ${
        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      }`}
      disabled={isLoading}
    >
      {isLoading ? '...' : 'AI'}
    </button>
  );
};

export default AIEstimationButton;