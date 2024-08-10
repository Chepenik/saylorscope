"use client";

import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import AssetInputForm from './AssetInputForm';
import { estimateAssetDetails } from '../utils/assetEstimation';
import Modal from './Modal';

interface Asset {
  name: string;
  value: number | null;
  maintenance: number | null;
  appreciation: number | null;
  type: 'physical' | 'digital' | 'financial' | '';
  lifespan?: string;
  roi?: string;
  doubleYourMoneyTime?: string;
  projectedValue?: string;
  annualCost?: string;
  annualReturn?: string;
}

const Calculator: React.FC = () => {
  const [assetCount, setAssetCount] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([
    { name: '', value: null, maintenance: null, appreciation: null, type: '' },
  ]);
  const [resultHTML, setResultHTML] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedAssets = localStorage.getItem('savedAssets');
    if (savedAssets) {
      setAssets(JSON.parse(savedAssets));
      setAssetCount(JSON.parse(savedAssets).length);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedAssets', JSON.stringify(assets));
  }, [assets]);

  const addAsset = () => {
    setAssetCount(assetCount + 1);
    setAssets([
      ...assets,
      { name: '', value: null, maintenance: null, appreciation: null, type: '' },
    ]);
  };

  const handleChange = (index: number, field: keyof Asset, value: string | number | null) => {
    const newAssets = [...assets];
    if (field === 'name') {
      newAssets[index].name = value as string;
    } else if (field === 'type') {
      newAssets[index].type = value as 'physical' | 'digital' | 'financial' | '';
    } else if (field === 'value' || field === 'maintenance' || field === 'appreciation') {
      if (value === null) {
        newAssets[index][field] = null;
      } else {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue)) {
          if (field === 'value' && numValue >= 0) {
            newAssets[index][field] = numValue;
          } else if (field === 'maintenance' && numValue >= 0) {
            newAssets[index][field] = numValue;
          } else if (field === 'appreciation') {
            newAssets[index][field] = numValue;
          }
        }
      }
    }
    setAssets(newAssets);
  };

  const handleAIEstimate = async (index: number, estimationType: 'maintenance' | 'appreciation') => {
    const asset = assets[index];
    if (!asset.type || !asset.name || asset.value === null) {
      alert("Please fill out all required fields: Asset Type, Asset Name, and Asset Value. The more detailed information you provide, the more accurate our AI estimation will be. For best results, be as specific as possible when describing your asset.");
      return;
    }

    setIsLoading(true);
    try {
      const estimatedDetails = await estimateAssetDetails(asset.name, asset.type, estimationType);
      
      const newAssets = [...assets];
      newAssets[index] = {
        ...asset,
        [estimationType]: estimatedDetails[estimationType],
      };
      setAssets(newAssets);
  
      setModalContent(`Estimated ${estimationType} for ${asset.name} (${asset.type}): 
        ${estimatedDetails[estimationType] !== null 
          ? `${estimationType === 'maintenance' 
              ? `$${estimatedDetails[estimationType]} per month` 
              : `${estimatedDetails[estimationType]}% per year`}`
          : 'Unable to provide a specific estimate'}
        
        Explanation: ${estimatedDetails.explanation}`);
    } catch (error) {
      console.error('Error estimating asset details:', error);
      setModalContent(`Error: ${error instanceof Error ? error.message : 'An unexpected error occurred while estimating asset details. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAndCompare = () => {
    const results = assets.map(asset => {
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
  };

  const clearAllData = () => {
    setAssets([{ name: '', value: null, maintenance: null, appreciation: null, type: 'physical' }]);
    setAssetCount(1);
    setResultHTML('');
    localStorage.removeItem('savedAssets');
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };

  const isDataEmpty = assets.length === 1 && !assets[0].name && !assets[0].value && !assets[0].maintenance && !assets[0].appreciation;

  return (
    <div className="calculator min-h-screen p-8 bg-gradient-to-br from-gray-100 via-gray-900 to-emerald-500">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">SaylorScope</h1>
        <div id="assetInputs" className="space-y-6">
          {assets.map((asset, index) => (
            <AssetInputForm
              key={index}
              asset={asset}
              index={index}
              onChange={handleChange}
              onAIEstimate={handleAIEstimate}
              isLoading={isLoading}
            />
          ))}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 transition duration-300"
          onClick={addAsset}
          disabled={isDataEmpty}
        >
          Add Another Asset
        </button>
        <button
          className="w-full bg-green-600 text-white py-2 px-4 rounded mt-4 hover:bg-green-700 transition duration-300"
          onClick={calculateAndCompare}
          disabled={isDataEmpty}
        >
          Calculate and Compare
        </button>
        <button
          className="w-full bg-red-600 text-white py-2 px-4 rounded mt-4 hover:bg-red-700 transition duration-300"
          onClick={clearAllData}
          disabled={isDataEmpty}
        >
          Clear All Data
        </button>
        <div className="result mt-8 p-4 bg-white rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: resultHTML }}></div>
        <canvas className="mt-8" id="comparisonChart" ref={chartCanvasRef}></canvas>
      </div>
      {modalContent && (
        <Modal onClose={() => setModalContent(null)}>
          <p>{modalContent}</p>
        </Modal>
      )}
    </div>
  );
};

export default Calculator;