import React, { useState } from 'react';
import AIEstimationButton from './AIEstimationButton';

interface Asset {
  name: string;
  value: number | null;
  maintenance: number | null;
  appreciation: number | null;
  type: 'physical' | 'digital' | 'financial' | '';
}

interface AssetInputFormProps {
  asset: Asset;
  index: number;
  onChange: (index: number, field: keyof Asset, value: string | number | null) => void;
  onAIEstimate: (index: number, field: 'maintenance' | 'appreciation') => Promise<void>;
}

const AssetInputForm: React.FC<AssetInputFormProps> = ({ asset, index, onChange, onAIEstimate }) => {
  const [loadingButton, setLoadingButton] = useState<'maintenance' | 'appreciation' | null>(null);

  const handleNumberChange = (field: 'value' | 'maintenance' | 'appreciation', value: string) => {
    const parsedValue = value === '' ? null : parseFloat(value);
    onChange(index, field, parsedValue);
  };

  const handleAIEstimation = async (field: 'maintenance' | 'appreciation') => {
    setLoadingButton(field);
    await onAIEstimate(index, field);
    setLoadingButton(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <select
        value={asset.type}
        onChange={(e) => onChange(index, 'type', e.target.value as Asset['type'])}
        className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
        disabled={!!loadingButton} // Disable when loading
      >
        <option value="" disabled>Select Asset Type</option>
        <option value="physical">Physical Asset</option>
        <option value="digital">Digital Asset</option>
        <option value="financial">Financial Asset</option>
      </select>
      <input
        type="text"
        placeholder="e.g., Bitcoin, Real Estate, Stocks"
        value={asset.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
        disabled={!!loadingButton} // Disable when loading
      />
      <input
        type="number"
        placeholder="Enter asset value"
        value={asset.value === null ? '' : asset.value}
        onChange={(e) => handleNumberChange('value', e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
        disabled={!!loadingButton} // Disable when loading
      />
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="number"
          placeholder="Enter monthly cost"
          value={asset.maintenance === null ? '' : asset.maintenance}
          onChange={(e) => handleNumberChange('maintenance', e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded text-black"
          disabled={!!loadingButton} // Disable when loading
        />
        <AIEstimationButton
          onEstimate={() => handleAIEstimation('maintenance')}
          isLoading={loadingButton === 'maintenance'}
          estimationType="maintenance"
          disabled={!!loadingButton && loadingButton !== 'maintenance'} // Disable other buttons
        />
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative flex-grow">
          <input
            type="number"
            placeholder="Enter annual rate"
            value={asset.appreciation === null ? '' : asset.appreciation}
            onChange={(e) => handleNumberChange('appreciation', e.target.value)}
            className="w-full p-2 pr-8 border border-gray-300 rounded text-black"
            disabled={!!loadingButton} // Disable when loading
          />
          <span className="absolute right-3 top-2 text-gray-600">%</span>
        </div>
        <AIEstimationButton
          onEstimate={() => handleAIEstimation('appreciation')}
          isLoading={loadingButton === 'appreciation'}
          estimationType="appreciation"
          disabled={!!loadingButton && loadingButton !== 'appreciation'} // Disable other buttons
        />
      </div>
    </div>
  );
};

export default AssetInputForm;