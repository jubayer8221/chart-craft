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

const StockReportCard = () => {
  const data = {
    labels: ["T-shirt", "Hoodie", "Shirt", "jeans"],
    datasets: [
      {
        label: "Stock Quantity",
        data: [120, 180, 150, 80],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Stock Report",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false, // No Y-axis border
          display: true, // Show horizontal grid lines
        },
      },
      x: {
        grid: {
          display: false, // No vertical grid lines
          drawBorder: true, // Show X-axis border
        },
      },
    },
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <h1 className="text-lg font-semibold pb-2">Stock Report</h1>
      <div className="h-[280px] w-fit">
        <Bar data={data} options={options} className="w-fit" />
      </div>
    </div>
  );
};

export default StockReportCard;
