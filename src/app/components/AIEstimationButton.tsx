import React from 'react';

interface AIEstimationButtonProps {
  onEstimate: () => Promise<void>;
  isLoading: boolean;
  estimationType: 'maintenance' | 'appreciation';
  disabled: boolean;
}

const AIEstimationButton: React.FC<AIEstimationButtonProps> = ({ onEstimate, isLoading, estimationType, disabled }) => {
  const handleClick = () => {
    onEstimate();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center text-white px-2 py-1 rounded transition-colors ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : disabled
          ? 'bg-gray-400 cursor-not-allowed' // Apply greyed-out styling when disabled
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
      disabled={isLoading || disabled} // Disable the button if loading or explicitly disabled
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span>Estimating...</span>
        </div>
      ) : (
        <span>AI</span>
      )}
    </button>
  );
};

export default AIEstimationButton;
