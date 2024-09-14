import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LogarithmicScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AssetWithCalculations } from '../../types/asset';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LogarithmicScale);

interface ChartProps {
  assets: AssetWithCalculations[];
}

const Chart: React.FC<ChartProps> = ({ assets }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        type: 'logarithmic' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Value ($)',
          color: 'white',
        },
        ticks: {
          color: 'white',
          callback: (value: number) => {
            if (value === 10000000000) return "10B";
            if (value === 1000000000) return "1B";
            if (value === 100000000) return "100M";
            if (value === 10000000) return "10M";
            if (value === 1000000) return "1M";
            if (value === 100000) return "100K";
            if (value === 10000) return "10K";
            if (value === 1000) return "1K";
            return value.toString();
          },
        },
      },
      y: {
        ticks: { color: 'white' },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'white' },
      },
      title: {
        display: true,
        text: 'Asset Value Comparison',
        color: 'white',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.x);
            }
            return label;
          }
        }
      }
    },
  };

  const data = {
    labels: assets.map(a => a.name || 'Unnamed Asset'),
    datasets: [
      {
        label: 'Initial Value',
        data: assets.map(a => Math.max(a.value ?? 0, 1)), // Use 1 as minimum to avoid log(0)
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Projected Value (5 Years)',
        data: assets.map(a => Math.max(parseFloat(a.projectedValue ?? '0'), 1)), // Use 1 as minimum to avoid log(0)
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
      }
    ]
  };

  return (
    <div className="h-[60vh] sm:h-[70vh] mt-4 sm:mt-8">
      <Bar options={options as any} data={data} />
    </div>
  );
};

export default Chart;