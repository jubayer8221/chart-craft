"use client";

import { useState, useMemo, useEffect, ReactElement } from "react";
import type { LayoutType, ScaleType } from "recharts/types/util/types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// Enhanced interface definitions
export interface ParsedRow {
  [key: string]: string | number | null;
}

interface ChartProps {
  data: ParsedRow[];
  initialChartType?: "bar" | "line" | "pie" | "area" | "scatter";
  theme?: "light" | "dark";
}

interface ProcessedData {
  columns: string[];
  processedData: ParsedRow[];
}

interface PieDataEntry {
  name: string;
  value: number;
}

interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter";
  stacked?: boolean;
  horizontal?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export function Chart({
  data,
  initialChartType = "bar",
  theme = "light",
}: ChartProps) {
  // State management
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: initialChartType,
    stacked: false,
    horizontal: false,
    showLegend: true,
    showGrid: true,
    showTooltip: true,
  });

  const [labelColumn, setLabelColumn] = useState<string>("");
  const [valueColumns, setValueColumns] = useState<string[]>([]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showValueDropdown, setShowValueDropdown] = useState<boolean>(false);
  // const [aggregation, setAggregation] = useState<
  //   "none" | "sum" | "average" | "max"
  // >("none");
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const defaultColors = useMemo(
    () => [
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC24A",
      "#F06292",
      "#7986CB",
      "#A1887F",
    ],
    []
  );

  // Data processing
  const { columns, processedData }: ProcessedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { columns: [], processedData: [] };
    }

    // Get all unique columns
    const columns = Array.from(
      new Set(data.flatMap((row) => Object.keys(row)))
    ).filter((col) => col); // Filter out empty column names

    // Process data with type conversion
    const processedData = data.map((row) => {
      const newRow: ParsedRow = {};
      columns.forEach((col) => {
        // Convert numeric strings to numbers
        if (row[col] !== null && row[col] !== undefined) {
          const numValue = Number(row[col]);
          newRow[col] = isNaN(numValue) ? String(row[col]) : numValue;
        } else {
          newRow[col] = null;
        }
      });
      return newRow;
    });

    return { columns, processedData };
  }, [data]);

  // Get numeric and non-numeric columns
  const { numericColumns, nonNumericColumns } = useMemo(() => {
    if (!processedData.length)
      return { numericColumns: [], nonNumericColumns: [] };

    const numericCols = columns.filter((col) =>
      processedData.some(
        (row) =>
          row[col] !== null &&
          row[col] !== undefined &&
          typeof row[col] === "number"
      )
    );

    const nonNumericCols = columns.filter((col) => !numericCols.includes(col));

    return { numericColumns: numericCols, nonNumericColumns: nonNumericCols };
  }, [columns, processedData]);

  // const valueDropdownRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       showValueDropdown &&
  //       valueDropdownRef.current &&
  //       !valueDropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setShowValueDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [showValueDropdown]);

  // Initialize default selections
  useEffect(() => {
    if (columns.length > 0) {
      // Auto-select first non-numeric column as label if available
      const firstNonNumeric = nonNumericColumns[0] || columns[0];
      setLabelColumn(firstNonNumeric);

      // Auto-select numeric columns (limit to 3 for better visualization)
      const autoSelectedValues = numericColumns.slice(0, 3);
      if (autoSelectedValues.length > 0) {
        setValueColumns(autoSelectedValues);

        // Set default colors for auto-selected columns
        const newColors: Record<string, string> = {};
        autoSelectedValues.forEach((col, index) => {
          newColors[col] = defaultColors[index % defaultColors.length];
        });
        setColors(newColors);
      }
    }
  }, [columns, numericColumns, nonNumericColumns, defaultColors]);

  // Prepare data for Pie chart
  const pieData = useMemo<PieDataEntry[]>(() => {
    if (!labelColumn || !valueColumns.length || !processedData.length)
      return [];

    const selectedValueColumn = valueColumns[0]; // Use first value column for pie chart
    return processedData
      .filter(
        (item) =>
          item[labelColumn] !== null &&
          item[labelColumn] !== undefined &&
          typeof item[selectedValueColumn] === "number" &&
          item[selectedValueColumn] !== null
      )
      .map((item) => ({
        name: String(item[labelColumn]),
        value: item[selectedValueColumn] as number,
      }))
      .filter((entry) => entry.value > 0); // Ensure non-zero values for pie chart
  }, [processedData, labelColumn, valueColumns]);

  // Color management with localStorage persistence
  const handleColorChange = (column: string, color: string) => {
    setColors((prev) => {
      const newColors = { ...prev, [column]: color };
      localStorage.setItem("chartColors", JSON.stringify(newColors));
      return newColors;
    });
  };

  // Initialize colors from localStorage
  useEffect(() => {
    const savedColors = localStorage.getItem("chartColors");
    if (savedColors) {
      try {
        setColors(JSON.parse(savedColors));
      } catch (e) {
        console.error("Failed to parse saved colors", e);
      }
    }
  }, []);

  // Dynamic chart rendering
  const renderChart = (): ReactElement => {
    if (!labelColumn || !valueColumns.length || !processedData.length) {
      return (
        <div className="py-6 my-2 text-center text-gray-500">
          Please select a label column and at least one numeric value column
        </div>
      );
    }

    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 },
      layout: (chartConfig.horizontal
        ? "vertical"
        : "horizontal") as LayoutType,
      animationDuration: 500,
      animationEasing: "ease-in-out",
    };

    const xAxisProps = {
      dataKey: labelColumn,
      angle: chartConfig.horizontal ? 0 : -45,
      textAnchor: chartConfig.horizontal ? "middle" : ("end" as const),
      height: 70,
      scale: (chartConfig.horizontal ? "band" : "auto") as ScaleType,
    };

    const yAxisProps = {
      scale: (chartConfig.horizontal ? "auto" : "band") as ScaleType,
    };

    switch (chartConfig.type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {chartConfig.horizontal ? (
              <>
                <YAxis {...xAxisProps} />
                <XAxis {...yAxisProps} />
              </>
            ) : (
              <>
                <XAxis {...xAxisProps} />
                <YAxis {...yAxisProps} />
              </>
            )}
            {chartConfig.showTooltip && <Tooltip />}
            {chartConfig.showLegend && <Legend />}
            {valueColumns.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={colors[key] || defaultColors[0]}
                stackId={chartConfig.stacked ? "stack" : undefined}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisProps} />
            <YAxis />
            {chartConfig.showTooltip && <Tooltip />}
            {chartConfig.showLegend && <Legend />}
            {valueColumns.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={colors[key] || defaultColors[0]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );
      case "pie":
        if (!pieData.length) {
          return (
            <div className="py-6 my-2 text-center text-gray-500">
              No valid data available for Pie Chart
            </div>
          );
        }
        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    colors[valueColumns[0]] ||
                    defaultColors[index % defaultColors.length]
                  }
                />
              ))}
            </Pie>
            {chartConfig.showTooltip && <Tooltip />}
            {chartConfig.showLegend && <Legend />}
          </PieChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...xAxisProps} />
            <YAxis />
            {chartConfig.showTooltip && <Tooltip />}
            {chartConfig.showLegend && <Legend />}
            {valueColumns.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={colors[key] || defaultColors[0]}
                fill={colors[key] || defaultColors[0]}
                fillOpacity={0.4}
                stackId={chartConfig.stacked ? "stack" : undefined}
              />
            ))}
          </AreaChart>
        );
      case "scatter":
        if (valueColumns.length < 2) {
          return (
            <div className="py-6 my-2 text-center text-gray-500">
              Scatter plot requires at least 2 value columns
            </div>
          );
        }
        return (
          <ScatterChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis
              dataKey={valueColumns[0]}
              name={valueColumns[0]}
              type="number"
            />
            <YAxis
              dataKey={valueColumns[1]}
              name={valueColumns[1]}
              type="number"
            />
            <ZAxis range={[100, 1000]} />
            {chartConfig.showTooltip && <Tooltip />}
            {chartConfig.showLegend && <Legend />}
            <Scatter
              name="Data"
              fill={colors[valueColumns[0]] || defaultColors[0]}
              data={processedData}
            />
          </ScatterChart>
        );
      default:
        return (
          <div className="py-6 my-2 text-center text-gray-500">
            Invalid chart type selected
          </div>
        );
    }
  };

  // Toggle value column selection
  const toggleValueColumn = (column: string) => {
    setValueColumns((prev) => {
      const newColumns = prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column];

      // Update colors for new columns
      setColors((prevColors) => {
        const newColors = { ...prevColors };
        newColumns.forEach((col) => {
          if (!newColors[col]) {
            newColors[col] =
              defaultColors[
                Object.keys(newColors).length % defaultColors.length
              ];
          }
        });
        return newColors;
      });

      return newColumns;
    });
  };

  return (
    <div
      className={`pt-6 mt-2 rounded-md px-4 border ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Controls */}
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
        {/* Chart Type Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="chartType"
            className="font-medium text-sm sm:text-base"
          >
            Chart Type:
          </label>
          <select
            id="chartType"
            value={chartConfig.type}
            onChange={(e) =>
              setChartConfig({ ...chartConfig, type: e.target.value as any })
            }
            className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
        {/* Dropdown for Chart Options */}
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="chart-options-menu"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            >
              Chart Options
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {showOptionsDropdown && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="chart-options-menu"
            >
              <div className="py-1 " role="none">
                {/* Layout Options */}
                {["bar", "area"].includes(chartConfig.type) && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">Stacked</span>
                      <input
                        type="checkbox"
                        checked={chartConfig.stacked}
                        onChange={(e) =>
                          setChartConfig({
                            ...chartConfig,
                            stacked: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                )}

                {["bar"].includes(chartConfig.type) && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-700">Horizontal</span>
                      <input
                        type="checkbox"
                        checked={chartConfig.horizontal}
                        onChange={(e) =>
                          setChartConfig({
                            ...chartConfig,
                            horizontal: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                )}

                {/* Display Options */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Show Legend</span>
                    <input
                      type="checkbox"
                      checked={chartConfig.showLegend}
                      onChange={(e) =>
                        setChartConfig({
                          ...chartConfig,
                          showLegend: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="px-4 py-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">Show Grid</span>
                    <input
                      type="checkbox"
                      checked={chartConfig.showGrid}
                      onChange={(e) =>
                        setChartConfig({
                          ...chartConfig,
                          showGrid: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Value Columns Selector */}
        <div className="relative w-full sm:w-[160px]">
          <button
            type="button"
            onClick={() => setShowValueDropdown(!showValueDropdown)}
            className="flex justify-between items-center w-full px-3 py-2 sm:px-4 sm:py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <span className="truncate">
              {valueColumns.length > 0
                ? `Selected Data ${valueColumns.length}`
                : "Select Data"}
            </span>
            <svg
              className={`h-4 w-4 text-gray-400 ${
                showValueDropdown ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showValueDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-96 overflow-auto">
              <div className="p-2">
                <div className="px-3 py-1 text-xs font-medium text-gray-500">
                  Select Value Columns
                </div>
                {numericColumns.map((col) => (
                  <div
                    key={`column-${col}`}
                    className={`px-3 py-2 cursor-pointer ${
                      valueColumns.includes(col)
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleValueColumn(col)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{col}</span>
                      <input
                        type="checkbox"
                        checked={valueColumns.includes(col)}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Label Column Selector */}
        {/* <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="labelColumn"
            className="font-medium text-sm sm:text-base"
          >
            Label Column:
          </label>
          <select
            id="labelColumn"
            value={labelColumn}
            onChange={(e) => setLabelColumn(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div> */}

        {/* Color Selectors */}
        {valueColumns.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <span className="font-medium text-sm sm:text-base hidden sm:inline">
              Colors:
            </span>
            <div className="flex flex-wrap gap-1">
              {valueColumns.map((col) => (
                <div
                  key={col}
                  className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">
                    {col}
                  </span>
                  <input
                    type="color"
                    value={colors[col] || defaultColors[0]}
                    onChange={(e) => handleColorChange(col, e.target.value)}
                    className="w-4 h-4 border-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "clamp(300px, 60vh, 600px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
