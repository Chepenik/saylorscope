"use client";

import React, { useState, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import AssetInputForm from './AssetInputForm';
import { estimateAssetDetails } from '../utils/assetEstimation';
import { useAssets } from './AssetsContext';
import { Asset, AssetWithCalculations } from '../../types/asset';

const Calculator: React.FC = () => {
  const { assets, addAsset, updateAsset, clearAllAssets, isAnyAILoading, setIsAnyAILoading } = useAssets();
  const [resultHTML, setResultHTML] = useState<string>('');
  const [estimationResult, setEstimationResult] = useState<string | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

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
  
    let newResultHTML = "<h2 class='text-2xl font-bold mb-4 text-gray-800'>Analysis Results</h2>";
    results.forEach(asset => {
      newResultHTML += `
        <div class='mb-6 p-4 bg-gray-100 rounded-lg shadow-md'>
          <h3 class='text-xl font-semibold mb-2 text-gray-800'>${asset.name || 'Unnamed Asset'} (${asset.type})</h3>
          <p class='text-gray-700'>Initial Value: $${asset.value ?? 0}</p>
          <p class='text-gray-700'>Lifespan: ${asset.lifespan}</p>
          <p class='text-gray-700'>Annual Maintenance Cost: $${asset.annualCost}</p>
          <p class='text-gray-700'>Annual ${Number(asset.appreciation) >= 0 ? 'Return' : 'Loss'}: $${asset.annualReturn}</p>
          <p class='text-gray-700'>ROI: ${asset.roi}%</p>
          ${Number(asset.appreciation) > 0 ? `<p class='text-gray-700'>Time it takes to double your money: ${asset.doubleYourMoneyTime}</p>` : ''}
          <p class='text-gray-700'>5-year projected value: $${asset.projectedValue}</p>
        </div>
      `;
    });
    setResultHTML(newResultHTML);
  
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  
    if (chartCanvasRef.current) {
      chartRef.current = new Chart(chartCanvasRef.current, {
        type: 'bar',
        data: {
          labels: results.map(a => `${a.name || 'Unnamed Asset'} (${a.type})`),
          datasets: [
            {
              label: 'Initial Value',
              data: results.map(a => a.value ?? 0),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: '5-Year Projected Value',
              data: results.map(a => parseFloat(a.projectedValue ?? '0')),
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value ($)',
              },
            },
          },
        },
      });
    }
  }, [assets]);

  const isDataEmpty = assets.length === 1 && !assets[0].name && !assets[0].value && !assets[0].maintenance && !assets[0].appreciation;

  return (
    <div className="calculator min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-emerald-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <div className="bg-black/30 backdrop-blur-lg p-8 rounded-lg shadow-2xl text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">SaylorScope</h1>
          <div id="assetInputs" className="space-y-6">
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
            <div className="mt-4 p-4 bg-black/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">AI Estimation Result</h3>
              <pre className="whitespace-pre-wrap text-sm">{estimationResult}</pre>
            </div>
          )}
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 transition duration-300"
            onClick={addAsset}
            disabled={isDataEmpty || isAnyAILoading}
          >
            Add Another Asset
          </button>
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded mt-4 hover:bg-green-700 transition duration-300"
            onClick={calculateAndCompare}
            disabled={isDataEmpty || isAnyAILoading}
          >
            Calculate and Compare
          </button>
          <button
            className="w-full bg-red-600 text-white py-2 px-4 rounded mt-4 hover:bg-red-700 transition duration-300"
            onClick={clearAllAssets}
            disabled={isDataEmpty || isAnyAILoading}
          >
            Clear All Data
          </button>
          <div className="result mt-8 p-4 bg-black/50 rounded-lg" dangerouslySetInnerHTML={{ __html: resultHTML }}></div>
          <canvas className="mt-8" id="comparisonChart" ref={chartCanvasRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default Calculator;