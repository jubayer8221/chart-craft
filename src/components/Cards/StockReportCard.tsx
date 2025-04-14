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

// Register chart components
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
        data: [120, 200, 150, 80],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Makes it flexible inside a container
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
      },
    },
  };

  return (
    <div className="p-4 w-full max-w-full md:max-w-2xl mx-auto">
      <div className="relative h-[300px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StockReportCard;