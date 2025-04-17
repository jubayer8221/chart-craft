"use client";
import React, { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { Moon, Sun } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const mockData = [
  { id: "1", name: "Item 1", price: 10 },
  { id: "2", name: "Item 2", price: 20 },
  { id: "3", name: "Item 3", price: 30 },
  { id: "4", name: "Item 4", price: 40 },
  { id: "5", name: "Item 5", price: 50 },
];

const SellsTable: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [data] = useState(mockData);
  const [selectedRowIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedChartId, setSelectedChartId] = useState<string>("");

  const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    saveAs(blob, "data.csv");
  };

  const exportAsImage = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "charts.png";
      link.click();
    }
  };

  const exportAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(image, "PNG", 0, 0, width, height);
      pdf.save("charts.pdf");
    }
  };

  const exportSelectedChartAsImage = async () => {
    const chartDiv = chartRefs.current[selectedChartId];
    if (chartDiv) {
      const canvas = await html2canvas(chartDiv);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${selectedChartId}-chart.png`;
      link.click();
    }
  };

  const exportSelectedChartAsPDF = async () => {
    const chartDiv = chartRefs.current[selectedChartId];
    if (chartDiv) {
      const canvas = await html2canvas(chartDiv);
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(image, "PNG", 0, 0, width, height);
      pdf.save(`${selectedChartId}-chart.pdf`);
    }
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
      <h1 className="text-2xl font-bold bg-[#0A3A66]/90 text-white mb-4 py-3 text-center">
        Bar Chart Theme
      </h1>
      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <button
            onClick={onPrint}
            className="bg-[#0A3A66] rounded-md shadow-md p-2 text-white"
          >
            Print {selectedRowIndex !== null ? "Selected" : "All"}
          </button>
          <button
            onClick={onExportCSV}
            className="bg-[#0A3A66] rounded-md shadow-md p-2 text-white"
          >
            Export {selectedRowIndex !== null ? "Selected" : "All"} CSV
          </button>
          <button
            onClick={exportAsImage}
            className="bg-[#0A3A66] rounded-md shadow-md p-2 text-white"
          >
            Export All Image
          </button>
          <button
            onClick={exportAsPDF}
            className="bg-[#0A3A66] rounded-md shadow-md p-2 text-white"
          >
            Export All PDF
          </button>
          <select
            className="rounded-md px-3 py-2 text-white bg-[#0A3A66] shadow-md "
            value={selectedChartId}
            onChange={(e) => setSelectedChartId(e.target.value)}
          >
            <option value="">Select Chart</option>
            <option value="bar-static">Static Bar</option>
            {data.map((d) => (
              <option key={d.id} value={`dynamic-${d.id}`}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            onClick={exportSelectedChartAsImage}
            className="bg-[#0A3A66] rounded-md shadow-md p-2 text-white"
          >
            Export Selected Image
          </button>
          <button
            onClick={exportSelectedChartAsPDF}
            className="bg-[#0A3A66] rounded-md shadow-md p-2 text-white"
          >
            Export Selected PDF
          </button>
        </div>
        <button
          className="text-sm px-4 py-2 rounded-md border border-gray-400 flex items-center gap-2 transition-transform duration-150 active:scale-95"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div
        ref={chartRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        {/* Static Chart */}
        <div
          ref={(el: HTMLDivElement | null) => {
            chartRefs.current["bar-static"] = el;
          }}
          className="p-4 bg-white dark:bg-gray-100 rounded-xl shadow-md"
        >
          <h2 className="font-semibold mb-2 text-center">Stock Bar Chart</h2>
          <div className="relative h-[200px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Dynamic Charts */}
        {data.map((item, idx) => {
          const colors = [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ];
          const borderColors = [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ];

          const datasetData = [
            item.price + 5,
            item.price + 10,
            item.price + 3,
            item.price + 8,
          ];
          const labels = ["T-shirt", "Hoodie", "Shirt", "Jeans"];
          const chartData = {
            labels,
            datasets: [
              {
                label: `Stock for ${item.name}`,
                data: datasetData,
                backgroundColor: colors[idx % colors.length],
                borderColor: borderColors[idx % borderColors.length],
                borderWidth: 1,
                fill: true,
              },
            ],
          };
          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" as const },
              title: {
                display: true,
                text: `Chart Report: ${item.name}`,
              },
            },
            scales: {
              x: { beginAtZero: true },
              y: { beginAtZero: true },
            },
          };

          return (
            <div
              key={`dynamic-${item.id}`}
              ref={(el: HTMLDivElement | null) => {
                chartRefs.current["bar-static"] = el;
              }}
              className="p-4 bg-white dark:bg-gray-100 rounded-xl shadow-md"
            >
              <h2 className="font-semibold mb-2 text-center">
                Chart for {item.name}
              </h2>
              <div className="relative h-[200px]">
                {idx === 0 ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : idx === 1 ? (
                  <Bar
                    data={chartData}
                    options={{ ...chartOptions, indexAxis: "y" }}
                  />
                ) : idx === 2 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : idx === 3 ? (
                  <Pie
                    data={{
                      labels,
                      datasets: [
                        {
                          data: datasetData,
                          backgroundColor: colors,
                          borderColor: borderColors,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellsTable;
