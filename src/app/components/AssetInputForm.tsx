import React from 'react';
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
    isLoading: boolean;
}

const AssetInputForm: React.FC<AssetInputFormProps> = ({ asset, index, onChange, onAIEstimate, isLoading }) => {
    const handleNumberChange = (field: 'value' | 'maintenance' | 'appreciation', value: string) => {
        const parsedValue = value === '' ? null : parseFloat(value);
        onChange(index, field, parsedValue);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <select
                value={asset.type}
                onChange={(e) => onChange(index, 'type', e.target.value as Asset['type'])}
                className="w-full mb-2 p-2 border border-gray-300 rounded text-black"
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
            />
            <input
                type="number"
                placeholder="Enter asset value"
                value={asset.value === null ? '' : asset.value}
                onChange={(e) => handleNumberChange('value', e.target.value)}
                className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
            />
            <div className="flex items-center space-x-2 mb-2">
                <input
                    type="number"
                    placeholder="Enter monthly cost"
                    value={asset.maintenance === null ? '' : asset.maintenance}
                    onChange={(e) => handleNumberChange('maintenance', e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded text-black"
                />
                <AIEstimationButton
                    onEstimate={() => onAIEstimate(index, 'maintenance')}
                    isLoading={isLoading}
                    estimationType="maintenance"
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
                    />
                    <span className="absolute right-3 top-2 text-gray-600">%</span>
                </div>
                <AIEstimationButton
                    onEstimate={() => onAIEstimate(index, 'appreciation')}
                    isLoading={isLoading}
                    estimationType="appreciation"
                />
            </div>
        </div>
    );
};

export default AssetInputForm;