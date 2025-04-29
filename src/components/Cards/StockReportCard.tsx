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
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StockReportCard: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark"; // Derive dark mode from theme

  // Define theme-based colors for light and dark modes
  const chartColors = {
    backgroundColor: isDarkMode
      ? "rgba(75, 192, 192, 0.6)"
      : "rgba(54, 162, 235, 0.6)", // Teal for dark, blue for light
    borderColor: isDarkMode ? "rgba(75, 192, 192, 1)" : "rgba(54, 162, 235, 1)", // Teal for dark, blue for light
    textColor: isDarkMode ? "#E5E7EB" : "#1F2937", // Light gray for dark mode, dark gray for light mode
    gridColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", // Subtle white for dark, black for light
    background: isDarkMode ? "#1F2937" : "#FFFFFF", // Dark gray for dark mode, white for light mode
    tooltipBackground: isDarkMode ? "#374151" : "#F9FAFB", // Darker gray for dark mode, light gray for light mode
  };

  // Chart data with dynamic colors
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
        backgroundColor: chartColors.tooltipBackground, // Tooltip background
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
          stepSize: 40,
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
  };

  return (
    <div
      className={`rounded-lg ${
        isDarkMode ? "text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-lg font-semibold pb-2">Chart Theme</h1>
      <div className="h-[280px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StockReportCard;
