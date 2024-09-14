"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Chart from './Chart';
import AssetInputForm from './AssetInputForm';
import { estimateAssetDetails } from '../utils/assetEstimation';
import { useAssets } from './AssetsContext';
import { Asset, AssetWithCalculations } from '../../types/asset';

const Calculator: React.FC = () => {
  const { assets, addAsset, updateAsset, clearAllAssets, isAnyAILoading, setIsAnyAILoading } = useAssets();
  const [resultHTML, setResultHTML] = useState<string>('');
  const [estimationResult, setEstimationResult] = useState<string | null>(null);
  const [chartData, setChartData] = useState<AssetWithCalculations[]>([]);
  const [chartColors, setChartColors] = useState<Record<string, string>>({});
  const [isDesktop, setIsDesktop] = useState(false);

  // Helper function to get a default color
  const getDefaultColor = useCallback((index: number) => {
    const defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return defaultColors[index % defaultColors.length];
  }, []);

  // Use useEffect to set initial chart colors
  useEffect(() => {
    setChartColors(prevColors => {
      const newChartColors: Record<string, string> = {...prevColors};
      let shouldUpdate = false;

      assets.forEach((asset, index) => {
        const assetName = asset.name || `Unnamed Asset ${index + 1}`;
        if (!newChartColors[assetName]) {
          newChartColors[assetName] = getDefaultColor(index);
          shouldUpdate = true;
        }
      });

      return shouldUpdate ? newChartColors : prevColors;
    });
  }, [assets, getDefaultColor]);

  // Check if the device is desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // Assuming 1024px as the breakpoint for desktop
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleChange = useCallback((index: number, field: keyof Asset, value: string | number | null) => {
    updateAsset(index, field, value);
  }, [updateAsset]);

  const handleAIEstimate = useCallback(async (index: number, estimationType: 'maintenance' | 'appreciation') => {
    const asset = assets[index];
    if (!asset.type || !asset.name || asset.value === null) {
      alert("Please fill out all required fields: Asset Type, Asset Name, and Asset Value. The more detailed information you provide, the more accurate our AI estimation will be. For best results, be as specific as possible when describing your asset.");
      return;
    }

    setIsAnyAILoading(true);
    try {
      const estimatedDetails = await estimateAssetDetails(asset.name, asset.type, estimationType);
      
      updateAsset(index, estimationType, estimatedDetails[estimationType]);
  
      let estimateValue = 'Unable to provide a specific estimate';
      if (estimatedDetails[estimationType] !== null) {
        estimateValue = estimationType === 'maintenance'
          ? `$${estimatedDetails[estimationType]} per month`
          : `${estimatedDetails[estimationType]}% per year`;
      }

      let result = `Estimated ${estimationType} for ${asset.name} (${asset.type}): ${estimateValue}\n\n`;
      result += `Explanation: ${estimatedDetails.explanation}`;

      if (estimatedDetails.range) {
        result += `\n\nEstimated range: ${estimatedDetails.range[0]} to ${estimatedDetails.range[1]}`;
      }

      setEstimationResult(result);
    } catch (error) {
      console.error('Error estimating asset details:', error);
      let errorMessage = 'An unexpected error occurred while estimating asset details. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (typeof error === 'object' && error !== null && 'rawResponse' in error) {
        errorMessage += `\n\nRaw AI response: ${(error as any).rawResponse}`;
      }
      setEstimationResult(`Error: ${errorMessage}`);
    } finally {
      setIsAnyAILoading(false);
    }
  }, [assets, updateAsset, setIsAnyAILoading]);

  const calculateAndCompare = useCallback(() => {
    const results: AssetWithCalculations[] = assets.map(asset => {
      const value = asset.value ?? 0;
      const maintenance = asset.maintenance ?? 0;
      const appreciation = asset.appreciation ?? 0;
  
      let lifespan = 'N/A';
      if (maintenance > 0) {
        lifespan = (value / maintenance / 12).toFixed(2) + ' years';
      } else if (value > 0) {
        lifespan = 'Indefinite';
      }
  
      const annualCost = maintenance * 12;
      const annualReturn = (appreciation / 100) * value;
      const roi = value > 0 ? ((annualReturn - annualCost) / value * 100).toFixed(2) : 'N/A';
  
      let doubleYourMoneyTime = 'N/A';
      if (appreciation > 0) {
        doubleYourMoneyTime = (Math.log(2) / Math.log(1 + (appreciation / 100))).toFixed(2) + ' years';
      }
  
      const projectedValue = (value * Math.pow(1 + (appreciation / 100), 5)).toFixed(2);
  
      return {
        ...asset,
        lifespan,
        roi,
        doubleYourMoneyTime,
        projectedValue,
        annualCost: annualCost.toFixed(2),
        annualReturn: annualReturn.toFixed(2)
      };
    });
  
    let newResultHTML = "<h2 class='text-2xl text-white font-bold mb-4'>Analysis Results</h2>";
    results.forEach(asset => {
      newResultHTML += `
        <div class='mb-6 p-4 bg-gray-700 rounded-lg shadow-md text-white'>
          <h3 class='text-xl font-semibold mb-2'>${asset.name || 'Unnamed Asset'} (${asset.type})</h3>
          <p>Initial Value: $${asset.value?.toLocaleString() ?? 0}</p>
          <p>Lifespan: ${asset.lifespan}</p>
          <p>Annual Maintenance Cost: $${parseFloat(asset.annualCost || '0').toLocaleString()}</p>
          <p>Annual ${Number(asset.appreciation) >= 0 ? 'Return' : 'Loss'}: $${parseFloat(asset.annualReturn || '0').toLocaleString()}</p>
          <p>ROI: ${asset.roi}%</p>
          ${Number(asset.appreciation) > 0 ? `<p>Time to double your money: ${asset.doubleYourMoneyTime}</p>` : ''}
          <p>5-year projected value: $${parseFloat(asset.projectedValue || '0').toLocaleString()}</p>
        </div>
      `;
    });
    setResultHTML(newResultHTML);
    
    // Update chart data
    setChartData(results);
  }, [assets]);

  const handleColorChange = (assetName: string, color: string) => {
    setChartColors(prev => ({...prev, [assetName]: color}));
  };

  const isDataEmpty = assets.length === 1 && !assets[0].name && !assets[0].value && !assets[0].maintenance && !assets[0].appreciation;

  return (
    <div className="calculator min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-emerald-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-8">
        <div className="bg-black/30 backdrop-blur-lg p-4 sm:p-8 rounded-lg shadow-2xl text-white">
          <p className="text-sm sm:text-base mb-4 sm:mb-6 text-center">
            Compare and analyze different types of assets over time. Input your asset details below and use AI to estimate maintenance costs and appreciation rates.
          </p>
          <div id="assetInputs" className="space-y-4 sm:space-y-6">
            {assets.map((asset, index) => (
              <AssetInputForm
                key={index}
                asset={asset}
                index={index}
                onChange={handleChange}
                onAIEstimate={handleAIEstimate}
                isAnyAILoading={isAnyAILoading}
              />
            ))}
          </div>
          {estimationResult && (
            <div className="mt-4 p-3 sm:p-4 bg-black/50 rounded-lg text-sm sm:text-base">
              <h3 className="text-base sm:text-lg font-semibold mb-2">AI Estimation Result</h3>
              <pre className="whitespace-pre-wrap">{estimationResult}</pre>
            </div>
          )}
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 text-sm sm:text-base"
            onClick={addAsset}
            disabled={isDataEmpty || isAnyAILoading}
          >
            Add Another Asset
          </button>
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded mt-4 hover:bg-green-700 text-sm sm:text-base"
            onClick={calculateAndCompare}
            disabled={isDataEmpty || isAnyAILoading}
          >
            Calculate and Compare
          </button>
          <button
            className="w-full bg-red-600 text-white py-2 px-4 rounded mt-4 hover:bg-red-700 text-sm sm:text-base"
            onClick={clearAllAssets}
            disabled={isDataEmpty || isAnyAILoading}
          >
            Clear All Data
          </button>
          <div className="result mt-6 sm:mt-8 p-3 sm:p-4 bg-black/50 rounded-lg text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: resultHTML }}></div>
          {chartData.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Asset Comparison Charts</h3>
              <Chart assets={chartData} colors={Object.values(chartColors)} />
              {isDesktop && (
                <div className="mt-4">
                  <h4 className="text-lg sm:text-xl font-bold mb-2 text-white">Customize Chart Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(chartColors).map(([assetName, color], index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(assetName, e.target.value)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer mr-2"
                        />
                        <span className="text-white text-xs sm:text-sm">{assetName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;