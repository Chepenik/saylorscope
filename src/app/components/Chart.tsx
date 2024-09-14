import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AssetWithCalculations } from '../../types/asset';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Disable all animations globally
ChartJS.defaults.animation = false;
ChartJS.defaults.transitions.active.animation.duration = 0;

interface ChartProps {
  assets: AssetWithCalculations[];
  colors: string[];
}

const Chart: React.FC<ChartProps> = ({ assets, colors }) => {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { 
          color: 'white',
          font: {
            size: 10 // Smaller font size for mobile
          }
        },
      },
      title: {
        display: true,
        text: '5-Year Value Forecast',
        color: 'white',
        font: { size: 14 }, // Smaller font size for mobile
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          color: 'white',
          font: {
            size: 10 // Smaller font size for mobile
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'Value ($)',
          color: 'white',
          font: {
            size: 12 // Smaller font size for mobile
          }
        },
      },
      x: {
        ticks: { 
          color: 'white',
          font: {
            size: 10 // Smaller font size for mobile
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8">
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
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Bar options={options} data={data} height={300} />
          </div>
        );
      })}
    </div>
  );
};

export default Chart;