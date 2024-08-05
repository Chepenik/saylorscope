"use client";

import { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface Asset {
  name: string;
  value: number | null;
  maintenance: number | null;
  appreciation: number | null;
  type: 'physical' | 'digital' | 'financial';
  lifespan?: string;
  roi?: string;
  doubleYourMoneyTime?: string;
  projectedValue?: string;
  annualCost?: string;
  annualReturn?: string;
}

const Calculator = () => {
  const [assetCount, setAssetCount] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([
    { name: '', value: null, maintenance: null, appreciation: null, type: 'physical' },
  ]);
  const [resultHTML, setResultHTML] = useState<string>('');
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
      { name: '', value: null, maintenance: null, appreciation: null, type: 'physical' },
    ]);
  };

  const handleChange = (index: number, field: keyof Asset, value: string | number) => {
    const newAssets = [...assets];
    if (field === 'name') {
      newAssets[index].name = value as string;
    } else if (field === 'type') {
      newAssets[index].type = value as 'physical' | 'digital' | 'financial';
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
    setAssets(newAssets);
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

  return (
    <div className="calculator min-h-screen p-8 bg-gradient-to-br from-gray-100 via-gray-900 to-emerald-500">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">SaylorScope</h1>
        <div id="assetInputs" className="space-y-6">
        {assets.map((asset, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Asset {index + 1}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor={`asset-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Name
                </label>
                <input
                  id={`asset-name-${index}`}
                  type="text"
                  placeholder="e.g., Bitcoin, Real Estate, Stocks"
                  value={asset.name}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'name', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`asset-value-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Value of Asset ($)
                </label>
                <input
                  id={`asset-value-${index}`}
                  type="number"
                  placeholder="Enter asset value"
                  value={asset.value === null ? '' : asset.value}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'value', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`asset-maintenance-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Maintenance Cost ($)
                </label>
                <input
                  id={`asset-maintenance-${index}`}
                  type="number"
                  placeholder="Enter monthly cost"
                  value={asset.maintenance === null ? '' : asset.maintenance}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'maintenance', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`asset-appreciation-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Appreciation Rate (%)
                </label>
                <div className="relative">
                  <input
                    id={`asset-appreciation-${index}`}
                    type="number"
                    placeholder="Enter annual rate"
                    value={asset.appreciation === null ? '' : asset.appreciation}
                    className="w-full p-2 pr-8 border border-gray-300 rounded text-black"
                    onChange={e => handleChange(index, 'appreciation', e.target.value)}
                  />
                  <span className="absolute right-3 top-2 text-gray-600">%</span>
                </div>
              </div>
              <div>
                <label htmlFor={`asset-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Type
                </label>
                <select
                  id={`asset-type-${index}`}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  value={asset.type}
                  onChange={e => handleChange(index, 'type', e.target.value)}
                >
                  <option value="physical">Physical Asset</option>
                  <option value="digital">Digital Asset</option>
                  <option value="financial">Financial Asset</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 transition duration-300"
          onClick={addAsset}
        >
          Add Another Asset
        </button>
        <button
          className="w-full bg-green-600 text-white py-2 px-4 rounded mt-4 hover:bg-green-700 transition duration-300"
          onClick={calculateAndCompare}
        >
          Calculate and Compare
        </button>
        <div className="result mt-8 p-4 bg-white rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: resultHTML }}></div>
        <canvas className="mt-8" id="comparisonChart" ref={chartCanvasRef}></canvas>
      </div>
    </div>
  );
};

export default Calculator;
