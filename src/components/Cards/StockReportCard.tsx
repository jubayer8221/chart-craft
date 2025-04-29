import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockReportCardProps {
  isDarkMode?: boolean; // Prop to toggle dark mode
}

const StockReportCard: React.FC<StockReportCardProps> = ({
  isDarkMode = false,
}) => {
  // Define theme-based colors for light and dark modes
  const chartColors = {
    backgroundColor: "rgba(75, 192, 192, 0.6)", // Teal for bars
    borderColor: "rgba(75, 192, 192, 1)", // Teal border for bars
    textColor: isDarkMode ? " #1F2937" : "#FFFFFF", // Light gray for dark mode, dark gray for light
    gridColor: isDarkMode ? "rgba(0, 0, 0, 0.1) " : "rgba(255, 255, 255, 0.15)", // Subtle white vs black for grid
    background: isDarkMode ? "#1F2937" : "#FFFFFF", // Chart background
  };

  // Chart data
  const data = {
    labels: [
      "T-shirt",
      "Hoodie",
      "Shirt",
      "Jeans",
      "Sneakers",
      "Jacket",
      "Shorts",
    ],
    datasets: [
      {
        label: "Stock Quantity",
        data: [80, 120, 180, 200, 180, 120, 80],
        backgroundColor: chartColors.backgroundColor,
        borderColor: chartColors.borderColor,
        borderWidth: 1,
      },
    ],
  };

  // Chart options with consistent theme application
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: chartColors.textColor, // Legend text color
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Stock Report",
        color: chartColors.textColor, // Title text color
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: chartColors.background, // Tooltip background matches chart
        titleColor: chartColors.textColor, // Tooltip title
        bodyColor: chartColors.textColor, // Tooltip body
        borderColor: chartColors.gridColor,
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: chartColors.gridColor, // Y-axis grid lines
          borderColor: chartColors.gridColor, // Y-axis border
        },
        ticks: {
          color: chartColors.textColor, // Y-axis tick labels
          stepSize: 40, // Consistent tick intervals
        },
        title: {
          display: true,
          text: "Quantity",
          color: chartColors.textColor,
        },
      },
      x: {
        grid: {
          display: false, // Disable X-axis grid lines
          borderColor: chartColors.gridColor, // X-axis border
        },
        ticks: {
          color: chartColors.textColor, // X-axis tick labels
        },
        title: {
          display: true,
          text: "Items",
          color: chartColors.textColor,
        },
      },
    },
    backgroundColor: chartColors.background,
  };

  return (
    <div
      className={` text-black ${isDarkMode ? "text-gray-900" : "text-white"}`}
    >
      <h1 className="text-lg font-semibold pb-2">Chart Theme</h1>
      <div className="h-[280px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StockReportCard;
