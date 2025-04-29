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
import Image from "next/image";

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

interface Item {
  id: string;
  name: string;
  price: number;
}

const mockData: Item[] = [
  { id: "1", name: "Item 1", price: 10 },
  { id: "2", name: "Item 2", price: 20 },
  { id: "3", name: "Item 3", price: 30 },
  { id: "2", name: "Item 2", price: 20 },
  { id: "3", name: "Item 3", price: 30 },
  { id: "4", name: "Item 4", price: 40 },
  { id: "5", name: "Item 5", price: 50 },
];

interface ExportAlertProps {
  message: string;
  onClose: () => void;
}

const ExportAlert: React.FC<ExportAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-[#312c4a] border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
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
            <h3 className="text-sm font-medium text-gray-800 dark:text-white">
              Export Required
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:bg-[#312c4a] dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
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
  const [data] = useState<Item[]>(mockData);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate random colors for each chart initially
  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [chartColors, setChartColors] = useState<Record<string, string>>(() => {
    const initialColors: Record<string, string> = {};
    mockData.forEach((item) => {
      initialColors[item.id] = getRandomColor();
    });
    return initialColors;
  });

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

  const handleChartColorChange = (id: string, color: string) => {
    setChartColors((prev) => ({
      ...prev,
      [id]: color,
    }));
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

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 min-h-screen relative bg-white dark:bg-[#312c4a]">
      {showAlert && (
        <ExportAlert
          message="Please select at least one export format (CSV, Image, or PDF)"
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-center print:text-center dark:text-white">
          Chart Theme
        </h1>
        <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-md ring-[1.5px] ring-gray-300 dark:ring-[#897c8f] px-2">
          <Image src="/assets/search.png" alt="search" width={14} height={14} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] p-2 bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 py-2 mb-4 print:hidden">
            <div>
              <h3 className="font-semibold text-lg dark:text-white">
                Select Items to Export:
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {["csv", "image", "pdf"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer dark:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedExportOptions.includes(option)}
                    onChange={() => handleExportOptionChange(option)}
                    className="w-4 h-4 dark:accent-gray-300"
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
                  className="p-2 w-full rounded-md shadow-md px-4 py-2 border bg-[#0A3A66] dark:bg-[#685e74] dark:border-none text-white border-gray-300 transition-colors"
                >
                  {selectedItems.length > 0
                    ? `${selectedItems.length} item(s) selected`
                    : "Select Items"}
                </button>

                {isOpen && (
                  <div className="absolute z-10 mt-1 border border-gray-100 w-full rounded-md bg-gray-50 max-w-40 max-h-60 overflow-y-auto dark:bg-[#463f59] dark:border-gray-600">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelection(item.id)}
                            className="w-4 h-4 dark:accent-gray-300"
                          />
                          <span>{item.name}</span>
                        </label>
                      ))
                    ) : (
                      <div className="px-3 py-1 text-sm text-gray-500 dark:text-gray-300">
                        No items found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleExport}
              className="rounded-md text-white px-4 py-2 border border-gray-300 duration-200 active:scale-95 active:bg-opacity-80 bg-[#0A3A66] dark:border-none dark:bg-[#685e74] transition-colors"
            >
              Export
            </button>

            <button
              onClick={handleClearSelections}
              className="px-3 py-1 text-sm hover:text-gray-600 dark:text-white dark:hover:text-gray-300 hover:border-b-1 transition-colors"
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
        {filteredData.map((item, idx) => {
          const primaryColor = chartColors[item.id];

          const hexToRgb = (hex: string): string => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
          };

          const isDarkMode =
            document.documentElement.classList.contains("dark");
          const backgroundColor = `rgba(${hexToRgb(primaryColor)}, 0.6)`;
          const borderColor = isDarkMode
            ? `rgba(${hexToRgb(primaryColor)}, 1)`
            : "#ffffff";

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
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                fill: true,
              },
            ],
          };
          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const,
                labels: {
                  color: isDarkMode ? "#000000" : "#ffffff",
                },
              },
              title: {
                display: true,
                text: `Chart Report: ${item.name}`,
                color: isDarkMode ? "#000000" : "#ffffff",
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  color: isDarkMode ? "#000000" : "#ffffff",
                },
                grid: {
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  color: isDarkMode ? "#000000" : "#ffffff",
                },
                grid: {
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                },
              },
            },
          };

          return (
            <div
              key={`dynamic-${item.id}`}
              ref={(el) => {
                if (el) chartRefs.current[item.id] = el;
              }}
              className="p-4 rounded-xl shadow-md bg-white dark:bg-[#463f59] dark:text-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Chart for {item.name}</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={chartColors[item.id]}
                    onChange={(e) =>
                      handleChartColorChange(item.id, e.target.value)
                    }
                    className="w-6 h-6 rounded-md cursor-pointer"
                  />
                </div>
              </div>
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
                          backgroundColor: [
                            backgroundColor,
                            `rgba(${hexToRgb(primaryColor)}, 0.4)`,
                            `rgba(${hexToRgb(primaryColor)}, 0.2)`,
                            `rgba(${hexToRgb(primaryColor)}, 0.8)`,
                          ],
                          borderColor: borderColor,
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
