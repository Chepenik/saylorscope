import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AssetWithCalculations } from '../../types/asset';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  assets: AssetWithCalculations[];
  colors: string[];
}

const Chart: React.FC<ChartProps> = ({ assets, colors }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'white' },
      },
      title: {
        display: true,
        text: '5-Year Value Forecast', // Updated title here
        color: 'white',
        font: { size: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'Value ($)',
          color: 'white',
        },
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {assets.map((asset, index) => {
        const data = {
          labels: ['Initial Value', 'Projected Value (5 Years)'],
          datasets: [
            {
              label: asset.name || 'Unnamed Asset',
              data: [asset.value || 0, parseFloat(asset.projectedValue || '0')],
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderWidth: 1,
            },
          ],
        };

        return (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Bar options={options} data={data} height={300} />
          </div>
        );
      })}
    </div>
  );
};

export default Chart;