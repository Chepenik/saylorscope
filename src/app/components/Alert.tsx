import React from 'react';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 relative" role="alert">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900"
      >
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
};

export default Alert;