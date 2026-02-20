import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartRenderer = ({ element }) => {
  const { chartType, data, options, title } = element;

  // Transform data to Chart.js format
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: chartType === 'pie' || chartType === 'doughnut'
        ? dataset.data.map((_, index) => {
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
            return colors[index % colors.length];
          })
        : dataset.color,
      borderColor: dataset.color,
      borderWidth: 1,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: options?.legend ?? true,
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: chartType === 'bar' || chartType === 'line' ? {
      y: {
        beginAtZero: true,
      },
    } : {},
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-full p-2">
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;