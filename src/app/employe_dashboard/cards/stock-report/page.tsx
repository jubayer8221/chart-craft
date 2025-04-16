"use client";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import { Moon, Sun } from "lucide-react";
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

const mockData = [
  { id: "1", name: "Item 1", price: 10 },
  { id: "2", name: "Item 2", price: 20 },
  { id: "3", name: "Item 3", price: 30 },
];

const SellsTable = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [data] = useState(mockData);
  const [selectedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  const onPrint = () => {
    const content =
      selectedRowIndex !== null
        ? JSON.stringify(data[selectedRowIndex], null, 2)
        : JSON.stringify(data, null, 2);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write("<pre>" + content + "</pre>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const onExportCSV = () => {
    const rows = selectedRowIndex !== null ? [data[selectedRowIndex]] : data;
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((h) => row[h as keyof typeof row]).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "export.csv");
  };

  const barData = {
    labels: ["T-shirt", "Hoodie", "Shirt", "Jeans"],
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

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Stock Report" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div
      className={`p-4 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <h1 className="text-2xl font-bold mb-1 text-center">Bar Chart Theme</h1>
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <button
            onClick={onPrint}
            className="bg-[#0A3A66] hover:bg-[#0A3A66]/90 text-white px-4 py-2 rounded-md transition-transform duration-150 active:scale-95"
          >
            Print {selectedRowIndex !== null ? "Selected" : "All"}
          </button>
          <button
            onClick={onExportCSV}
            className="bg-[#0A3A66] hover:bg-[#0A3A66]/90 text-white px-4 py-2 rounded-md transition-transform duration-150 active:scale-95"
          >
            Export {selectedRowIndex !== null ? "Selected" : "All"} CSV
          </button>
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="text-sm px-4 py-2 rounded-md border border-gray-400 flex items-center gap-2 transition-transform duration-150 active:scale-95"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 ">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 bg-white dark:bg-gray-100 rounded-xl shadow-md"
          >
            <h2 className="font-semibold mb-2 text-center">
              Stock Chart #{idx + 1}
            </h2>
            <div className="relative h-[200px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellsTable;
