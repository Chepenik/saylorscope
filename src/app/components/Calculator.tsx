"use client";

import { useState, useRef } from 'react';
import Chart from 'chart.js/auto';

interface Asset {
  name: string;
  value: number;
  maintenance: number;
  appreciation: number;
  type: string;
}

const Calculator = () => {
  const [assetCount, setAssetCount] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([
    { name: '', value: 0, maintenance: 0, appreciation: 0, type: 'physical' },
  ]);
  const [resultHTML, setResultHTML] = useState<string>('');
  const chartRef = useRef<Chart | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  const addAsset = () => {
    setAssetCount(assetCount + 1);
    setAssets([
      ...assets,
      { name: '', value: 0, maintenance: 0, appreciation: 0, type: 'physical' },
    ]);
  };

  const handleChange = (index: number, field: keyof Asset, value: string | number) => {
    const newAssets = [...assets];
    if (typeof value === 'string') {
      if (field === 'name' || field === 'type') {
        newAssets[index][field] = value as never;
      } else {
        newAssets[index][field] = parseFloat(value) as never;
      }
    } else {
      newAssets[index][field] = value as never;
    }
    setAssets(newAssets);
  };

  const calculateAndCompare = () => {
    const results = assets.map(asset => {
      const lifespan = asset.value / asset.maintenance;
      const roi = ((asset.appreciation * asset.value - asset.maintenance) / asset.value) * 100;
      const breakevenYears = Math.log(2) / Math.log(1 + (asset.appreciation / 100));
      const projectedValue = asset.value * Math.pow(1 + (asset.appreciation / 100), 5);

      return {
        ...asset,
        lifespan: lifespan.toFixed(2),
        roi: roi.toFixed(2),
        breakevenYears: breakevenYears.toFixed(2),
        projectedValue: projectedValue.toFixed(2),
      };
    });

    let newResultHTML = "<h2>Analysis Results</h2>";
    results.forEach(asset => {
      newResultHTML += `
        <h3>${asset.name} (${asset.type})</h3>
        <p>Lifespan: ${asset.lifespan} years</p>
        <p>Annual ROI: ${asset.roi}%</p>
        <p>Break-even time: ${asset.breakevenYears} years</p>
        <p>5-year projected value: $${asset.projectedValue}</p>
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
          labels: results.map(a => `${a.name} (${a.type})`),
          datasets: [
            {
              label: 'Initial Value',
              data: results.map(a => a.value),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: '5-Year Projected Value',
              data: results.map(a => parseFloat(a.projectedValue)),
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Asset Name"
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Value of Asset (V)"
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'value', e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Monthly Maintenance Cost (M)"
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'maintenance', e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Annual Appreciation Rate (%)"
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'appreciation', e.target.value)}
                />
                <span className="absolute top-0 right-3 mt-3 text-gray-600">%</span>
              </div>
              <div className="relative">
                <select
                  className="w-full p-2 mb-2 border border-gray-300 rounded text-black"
                  onChange={e => handleChange(index, 'type', e.target.value)}
                >
                  <option value="" disabled selected>Select Asset Type</option>
                  <option value="physical">Physical Asset</option>
                  <option value="digital">Digital Asset</option>
                  <option value="financial">Financial Asset</option>
                </select>
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