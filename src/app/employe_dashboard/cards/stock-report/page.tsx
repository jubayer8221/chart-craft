"use client";
import React, { useRef, useEffect, useState } from "react";
import { saveAs } from "file-saver";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  toggleItemSelection,
  toggleExportOption,
  clearSelections,
} from "@/redux/slices/exportSlice";

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

const ExportAlert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-red-500 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Export Required
            </h3>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const SellsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedItems, selectedExportOptions } = useSelector(
    (state: RootState) => state.export
  );
  const [data] = useState(mockData);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [chartColor, setChartColor] = useState("#4BC0C0"); // Default chart color
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemSelection = (id: string) => {
    dispatch(toggleItemSelection(id));
  };

  const handleExportOptionChange = (option: string) => {
    dispatch(toggleExportOption(option));
  };

  const handleClearSelections = () => {
    dispatch(clearSelections());
  };

  const onExportCSV = (itemsToExport: string[] = []) => {
    const rows =
      itemsToExport.length > 0
        ? data.filter((item) => itemsToExport.includes(item.id))
        : data;

    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((h) => row[h as keyof typeof row]).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, itemsToExport.length > 0 ? "selected-data.csv" : "data.csv");
  };

  const exportAsImage = async (itemsToExport: string[] = []) => {
    if (itemsToExport.length === 0 && chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "charts.png";
      link.click();
    } else {
      for (const id of itemsToExport) {
        const chartDiv = chartRefs.current[id];
        if (chartDiv) {
          const canvas = await html2canvas(chartDiv);
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `${id}-chart.png`;
          link.click();
        }
      }
    }
  };

  const exportAsPDF = async (itemsToExport: string[] = []) => {
    const pdf = new jsPDF("p", "mm", "a4");

    if (itemsToExport.length === 0 && chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const image = canvas.toDataURL("image/png");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(image, "PNG", 0, 0, width, height);
      pdf.save("charts.pdf");
    } else {
      let addedFirstPage = false;

      for (const id of itemsToExport) {
        const chartDiv = chartRefs.current[id];
        if (chartDiv) {
          const canvas = await html2canvas(chartDiv);
          const image = canvas.toDataURL("image/png");
          const width = pdf.internal.pageSize.getWidth();
          const height = (canvas.height * width) / canvas.width;

          if (addedFirstPage) {
            pdf.addPage();
          } else {
            addedFirstPage = true;
          }

          pdf.addImage(image, "PNG", 0, 0, width, height);
        }
      }

      if (addedFirstPage) {
        pdf.save("selected-charts.pdf");
      }
    }
  };

  const handleExport = () => {
    if (selectedExportOptions.length === 0) {
      setShowAlert(true);
      return;
    }

    const itemsToExport = selectedItems.length > 0 ? selectedItems : [];

    selectedExportOptions.forEach((option) => {
      switch (option) {
        case "csv":
          onExportCSV(itemsToExport);
          break;
        case "image":
          exportAsImage(itemsToExport);
          break;
        case "pdf":
          exportAsPDF(itemsToExport);
          break;
        default:
          break;
      }
    });
  };

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const barData = {
    labels: ["T-shirt", "Hoodie", "Shirt", "Jeans"],
    datasets: [
      {
        label: "Stock Quantity",
        data: [120, 200, 150, 80],
        backgroundColor: chartColor,
        borderColor: chartColor,
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
    <div className="p-4 min-h-screen relative bg-white">
      {showAlert && (
        <ExportAlert
          message="Please select at least one export format (CSV, Image, or PDF)"
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-center">Bar Chart Theme</h1>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-gray-300 max-w-40 max-h-10"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 py-2 mb-4">
            <div className="">
              <h3 className="font-semibold text-lg">Select Items to Export:</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {["csv", "image", "pdf"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedExportOptions.includes(option)}
                    onChange={() => handleExportOptionChange(option)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">
                    {option.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div ref={dropdownRef} className="relative max-w-40">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 w-full rounded-md shadow-md px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {selectedItems.length > 0
                    ? `${selectedItems.length} item(s) selected`
                    : "Select Items"}
                </button>

                {isOpen && (
                  <div className="absolute z-10 mt-1 border border-gray-100 w-full rounded-md bg-gray-50 shadow-lg max-w-40 max-h-60 overflow-y-auto">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelection(item.id)}
                            className="w-4 h-4"
                          />
                          <span>{item.name}</span>
                        </label>
                      ))
                    ) : (
                      <div className="px-3 py-1 text-sm text-gray-500">
                        No items found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Chart Color:</label>
              <input
                type="color"
                value={chartColor}
                onChange={(e) => setChartColor(e.target.value)}
                className="w-8 h-8 rounded-md cursor-pointer"
              />
            </div>
            <button
              onClick={handleExport}
              className="rounded-md shadow-md px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Export
            </button>

            <button
              onClick={handleClearSelections}
              className="px-3 py-1 text-sm hover:text-gray-600 hover:border-b-1 transition-colors"
            >
              Clear Selections
            </button>
          </div>
        </div>
      </div>

      <div
        ref={chartRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        {/* Static Chart */}
        <div
          ref={(el) => {
            if (el) chartRefs.current["bar-static"] = el;
          }}
          className="p-4 rounded-xl shadow-md"
        >
          <h2 className="font-semibold mb-2 text-center">Stock Bar Chart</h2>
          <div className="relative h-[200px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Dynamic Charts */}
        {filteredData.map((item, idx) => {
          const colors = [
            chartColor,
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ];
          const borderColors = [
            chartColor,
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
              ref={(el) => {
                if (el) chartRefs.current[item.id] = el;
              }}
              className="p-4 rounded-xl shadow-md"
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
