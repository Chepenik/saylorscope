import React, { useState } from 'react';
import AIEstimationButton from './AIEstimationButton';
import { FaLaptop, FaHome, FaChartLine } from 'react-icons/fa';

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
  isAnyAILoading: boolean;
}

const AssetInputForm: React.FC<AssetInputFormProps> = ({ asset, index, onChange, onAIEstimate, isAnyAILoading }) => {
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

  const handleAssetTypeChange = (type: Asset['type']) => {
    onChange(index, 'type', type);
  };

  const assetTypes = [
    { type: 'digital', icon: FaLaptop, label: 'Digital' },
    { type: 'physical', icon: FaHome, label: 'Physical' },
    { type: 'financial', icon: FaChartLine, label: 'Financial' },
  ] as const;

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-center space-x-3 mb-4">
        {assetTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleAssetTypeChange(type)}
            className={`px-4 py-1.5 rounded-md flex flex-col items-center justify-center transition-colors w-28 ${
              asset.type === type
                ? 'bg-amber-500 text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={isAnyAILoading}
          >
            <Icon className="text-lg mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="e.g., Bitcoin, Real Estate, Stocks"
        value={asset.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white"
        disabled={isAnyAILoading}
      />
      <input
        type="number"
        placeholder="Enter asset value"
        value={asset.value === null ? '' : asset.value}
        onChange={(e) => handleNumberChange('value', e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white"
        disabled={isAnyAILoading}
      />
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="number"
          placeholder="Enter monthly cost"
          value={asset.maintenance === null ? '' : asset.maintenance}
          onChange={(e) => handleNumberChange('maintenance', e.target.value)}
          className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded text-white"
          disabled={isAnyAILoading}
        />
        <AIEstimationButton
          onEstimate={() => handleAIEstimation('maintenance')}
          isLoading={loadingButton === 'maintenance'}
          estimationType="maintenance"
          disabled={isAnyAILoading}
        />
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative flex-grow">
          <input
            type="number"
            placeholder="Enter annual appreciation/depreciation rate"
            value={asset.appreciation === null ? '' : asset.appreciation}
            onChange={(e) => handleNumberChange('appreciation', e.target.value)}
            className="w-full p-2 pr-8 bg-gray-700 border border-gray-600 rounded text-white"
            disabled={isAnyAILoading}
          />
          <span className="absolute right-3 top-2 text-gray-400">%</span>
        </div>
        <AIEstimationButton
          onEstimate={() => handleAIEstimation('appreciation')}
          isLoading={loadingButton === 'appreciation'}
          estimationType="appreciation"
          disabled={isAnyAILoading}
        />
      </div>
    </div>
  );
};

export default AssetInputForm;