"use client";

import { useState, useMemo, useEffect, useRef, type ReactElement } from "react";
import type { LayoutType, ScaleType } from "recharts/types/util/types";
import { useDispatch, useSelector } from "react-redux";
import {
  requestExport,
  resetExport,
  toggleItemSelection,
  toggleExportOption,
} from "@/redux/slices/exportSlice";
import { setColor, setColors } from "@/redux/slices/colorSlice";
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
  CartesianGrid,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
} from "recharts";
import { Button } from "../ui/button";
import type { ParsedRow } from "@/types/convertType";

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

interface ExportState {
  exportFormat: "pdf" | "image" | null;
  exportRequested: boolean;
  selectedItems: string[];
  selectedExportOptions: string[];
}

interface ColorState {
  colors: Record<string, string>;
}

interface DataState {
  headerNames: Record<string, string>;
  tableTitle: string;
}

export function Chart({
  data,
  initialChartType = "bar",
  theme = "light",
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const exportState = useSelector(
    (state: { export: ExportState }) => state.export
  );
  const { colors } = useSelector(
    (state: { colors: ColorState }) => state.colors
  );
  const { headerNames, tableTitle } = useSelector(
    (state: { data: DataState }) => state.data
  );
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: initialChartType,
    stacked: false,
    horizontal: false,
    showLegend: false,
    showGrid: false,
    showTooltip: true,
  });
  const [labelColumn, setLabelColumn] = useState<string>("");
  const [valueColumns, setValueColumns] = useState<string[]>([]);
  const [showValueDropdown, setShowValueDropdown] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const valueDropdownRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Track viewport width for responsive width calculation
  const [viewportWidth, setViewportWidth] = useState(0);
  useEffect(() => {
    setViewportWidth(window.innerWidth);

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Default colors for charts
  const defaultColors = useMemo(
    () => [
      "#36A2EB",
      "#F57C00",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC24A",
      "#1976D2",
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

    const isCaptionRow = data.length > 0 && Object.keys(data[0]).length === 1;
    const chartData = isCaptionRow ? data.slice(1) : data;

    const columns = Array.from(
      new Set(chartData.flatMap((row: ParsedRow) => Object.keys(row)))
    ).filter((col) => col);

    const processedData = chartData.map((row: ParsedRow) => {
      const newRow: ParsedRow = {};
      columns.forEach((col) => {
        newRow[col] = row[col] ?? null;
      });
      return newRow;
    });

    return { columns, processedData };
  }, [data]);

  // Get numeric and non-numeric columns
  const { numericColumns, nonNumericColumns } = useMemo(() => {
    if (!processedData.length) {
      return { numericColumns: [], nonNumericColumns: [] };
    }

    const numericCols = columns.filter((col) =>
      processedData.every(
        (row: ParsedRow) =>
          row[col] === null ||
          row[col] === undefined ||
          typeof row[col] === "number"
      )
    );

    const nonNumericCols = columns.filter((col) => !numericCols.includes(col));

    return { numericColumns: numericCols, nonNumericColumns: nonNumericCols };
  }, [columns, processedData]);

  // Initialize default selections
  useEffect(() => {
    if (columns.length > 0 && !labelColumn) {
      const firstNonNumeric = nonNumericColumns[0] || columns[0];
      setLabelColumn(firstNonNumeric);
    }

    if (columns.length > 0 && valueColumns.length === 0) {
      const autoSelectedValues = numericColumns.slice(0, 3);
      if (autoSelectedValues.length > 0) {
        setValueColumns(autoSelectedValues);

        const newColors: Record<string, string> = {};
        autoSelectedValues.forEach((col, index) => {
          if (!colors[col]) {
            newColors[col] = defaultColors[index % defaultColors.length];
          }
        });
        if (Object.keys(newColors).length > 0) {
          dispatch(setColors({ ...colors, ...newColors }));
        }
      }
    }
  }, [
    columns,
    numericColumns,
    nonNumericColumns,
    defaultColors,
    dispatch,
    labelColumn,
    valueColumns,
    colors,
  ]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        valueDropdownRef.current &&
        !valueDropdownRef.current.contains(event.target as Node)
      ) {
        setShowValueDropdown(false);
      }
      if (
        optionsDropdownRef.current &&
        !optionsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptionsDropdown(false);
      }
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target as Node)
      ) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export logic
  useEffect(() => {
    if (
      exportState.exportRequested &&
      exportState.selectedItems.includes("chart")
    ) {
      const exportChart = async () => {
        if (!chartRef.current) {
          console.warn("Chart reference is not available for export");
          dispatch(resetExport());
          return;
        }

        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context not available");

          const svg = chartRef.current.querySelector("svg");
          if (!svg) throw new Error("SVG not found in chart");

          const scale = exportState.selectedExportOptions.includes(
            "highResolution"
          )
            ? 2
            : 1;
          canvas.width = svg.clientWidth * scale;
          canvas.height = svg.clientHeight * scale;

          const img = new Image();
          const svgData = new XMLSerializer().serializeToString(svg);
          img.src = `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgData))
          )}`;

          await new Promise((resolve) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(null);
            };
          });

          if (exportState.exportFormat === "image") {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "chart.png";
            link.click();
          } else if (exportState.exportFormat === "pdf") {
            const printWindow = window.open("", "_blank");
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <body>
                    <img src="${canvas.toDataURL(
                      "image/png"
                    )}" style="width:100%;">
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.print();
            }
          }

          dispatch(resetExport());
        } catch (error) {
          console.error("Export failed:", error);
          dispatch(resetExport());
        }
      };

      exportChart();
    }
  }, [exportState, dispatch]);

  // Prepare data for Pie chart
  const pieData = useMemo<PieDataEntry[]>(() => {
    if (!labelColumn || !valueColumns.length || !processedData.length) {
      return [];
    }

    const selectedValueColumn = valueColumns[0];
    return processedData
      .filter(
        (item: ParsedRow) =>
          item[labelColumn] !== null &&
          item[labelColumn] !== undefined &&
          typeof item[selectedValueColumn] === "number" &&
          item[selectedValueColumn] !== null
      )
      .map((item: ParsedRow) => ({
        name: String(item[labelColumn]),
        value: item[selectedValueColumn] as number,
      }))
      .filter((entry: PieDataEntry) => entry.value > 0);
  }, [processedData, labelColumn, valueColumns]);

  // Color management
  const handleColorChange = (column: string, color: string) => {
    dispatch(setColor({ column, color }));
  };

  // Toggle value column selection
  const toggleValueColumn = (column: string) => {
    setValueColumns((prev) => {
      const newColumns = prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column];

      const newColors: Record<string, string> = { ...colors };
      newColumns.forEach((col, index) => {
        if (!newColors[col]) {
          newColors[col] = defaultColors[index % defaultColors.length];
          dispatch(setColor({ column: col, color: newColors[col] }));
        }
      });

      return newColumns;
    });
  };

  // Separate render function for chart (without legend) for better layout control
  const renderChartWithoutLegend = (): ReactElement => {
    if (!labelColumn || !valueColumns.length || !processedData.length) {
      return (
        <div className="py-6 w-full text-center text-gray-500 dark:text-gray-400">
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
    };

    const xAxisProps = {
      dataKey: labelColumn,
      name: headerNames[labelColumn] || labelColumn,
      angle: chartConfig.horizontal ? 0 : -45,
      textAnchor: (chartConfig.horizontal ? "middle" : "end") as
        | "middle"
        | "end",
      height: 70,
      scale: (chartConfig.horizontal ? "band" : "auto") as ScaleType,
      tick: { fill: theme === "dark" ? "#FFFFFF" : "#000000" },
    };

    const yAxisProps = {
      scale: (chartConfig.horizontal ? "auto" : "band") as ScaleType,
      tick: { fill: theme === "dark" ? "#FFFFFF" : "#000000" },
    };
    const LineyAxisProps = {
      scale: (chartConfig.horizontal ? "auto" : "linear") as ScaleType,
      domain: [0, "auto"] as [number, "auto"],
      tick: { fill: theme === "dark" ? "#FFFFFF" : "#000000" },
    };

    switch (chartConfig.type) {
      case "bar":
        return (
          <BarChart
            {...commonProps}
            className="max-w-full min-w-full overflow-auto flex"
          >
            {chartConfig.showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4B5563" : "#D1D5DB"}
              />
            )}

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
            {chartConfig.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  border:
                    theme === "dark"
                      ? "1px solid #4B5563"
                      : "1px solid #D1D5DB",
                }}
              />
            )}
            {chartConfig.showLegend && <Legend />}

            {valueColumns.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={headerNames[key] || key}
                fill={colors[key] || defaultColors[0]}
                stackId={chartConfig.stacked ? "stack" : undefined}
                className="min-w-10"
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            {chartConfig.showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4B5563" : "#D1D5DB"}
              />
            )}
            <XAxis {...xAxisProps} />
            <YAxis {...LineyAxisProps} />
            {chartConfig.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  border:
                    theme === "dark"
                      ? "1px solid #4B5563"
                      : "1px solid #D1D5DB",
                }}
              />
            )}
            {valueColumns.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={headerNames[key] || key}
                stroke={colors[key] || defaultColors[0]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );
      case "pie":
        if (!pieData.length) {
          return (
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
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
              label={{ fill: theme === "dark" ? "#FFFFFF" : "#000000" }}
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
            {chartConfig.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  border:
                    theme === "dark"
                      ? "1px solid #4B5563"
                      : "1px solid #D1D5DB",
                }}
              />
            )}
          </PieChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            {chartConfig.showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4B5563" : "#D1D5DB"}
              />
            )}
            <XAxis {...xAxisProps} />
            <YAxis {...LineyAxisProps} />
            {chartConfig.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  border:
                    theme === "dark"
                      ? "1px solid #4B5563"
                      : "1px solid #D1D5DB",
                }}
              />
            )}
            {valueColumns.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={headerNames[key] || key}
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
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
              Scatter plot requires at least 2 value columns
            </div>
          );
        }
        return (
          <ScatterChart {...commonProps}>
            {chartConfig.showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4B5563" : "#D1D5DB"}
              />
            )}
            <XAxis
              dataKey={valueColumns[0]}
              name={headerNames[valueColumns[0]] || valueColumns[0]}
              type="number"
              tick={{ fill: theme === "dark" ? "#FFFFFF" : "#000000" }}
            />
            <YAxis
              dataKey={valueColumns[1]}
              name={headerNames[valueColumns[1]] || valueColumns[1]}
              type="number"
              tick={{ fill: theme === "dark" ? "#FFFFFF" : "#000000" }}
            />
            <ZAxis range={[100, 1000]} />
            {chartConfig.showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  border:
                    theme === "dark"
                      ? "1px solid #4B5563"
                      : "1px solid #D1D5DB",
                }}
              />
            )}
            <Scatter
              name="Data"
              fill={colors[valueColumns[0]] || defaultColors[0]}
              data={processedData}
            />
          </ScatterChart>
        );
      default:
        return (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            Invalid chart type selected
          </div>
        );
    }
  };

  // Legend render helper for side legend
  const renderLegend = () => {
    if (!valueColumns.length) return null;
    return (
      <ul className="list-none m-0 p-0">
        {valueColumns.map((col, index) => (
          <li key={col} className="flex items-center gap-2 mb-2 cursor-default">
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor:
                  colors[col] || defaultColors[index % defaultColors.length],
                borderRadius: 3,
              }}
            />
            <span>{headerNames[col] || col}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className={`p-4 rounded-md border mx-auto ${
        theme === "dark"
          ? "bg-gray-800 text-white border-gray-700"
          : "text-gray-800 border-gray-300"
      }`}
    >
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
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
              setChartConfig({
                ...chartConfig,
                type: e.target.value as ChartConfig["type"],
              })
            }
            className="px-3 py-2 border rounded-md bg-white text-gray-700 text-sm sm:text-base w-full sm:w-auto dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>

        <div className="flex justify-between gap-4">
          <div
            className="relative w-full sm:w-auto md:flex sm:flex"
            ref={valueDropdownRef}
          >
            <button
              type="button"
              className="flex justify-between items-center px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-200 text-sm sm:text-base w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onClick={() => setShowValueDropdown(!showValueDropdown)}
              aria-expanded={showValueDropdown}
            >
              Select Columns
              <svg
                className="ml-2 h-5 w-5"
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
              <div className="absolute z-10 mt-11 w-full rounded-md shadow-md bg-white dark:bg-gray-700 overflow-y-auto max-h-[320px]">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-white font-medium">
                    Value Columns
                  </div>
                  {numericColumns.map((col) => (
                    <div key={col} className="flex items-center px-4 py-2">
                      <label className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        <input
                          type="checkbox"
                          checked={valueColumns.includes(col)}
                          onChange={() => toggleValueColumn(col)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                        />
                        {headerNames[col] || col}
                      </label>
                      {valueColumns.includes(col) && (
                        <input
                          type="color"
                          value={colors[col] || defaultColors[0]}
                          onChange={(e) =>
                            handleColorChange(col, e.target.value)
                          }
                          className="w-6 h-6 border-none cursor-pointer ml-2"
                          aria-label={`Color picker for ${
                            headerNames[col] || col
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-1 border-b border-gray-100 dark:border-gray-600">
                  {nonNumericColumns.map((col) => (
                    <button
                      key={col}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        labelColumn === col
                          ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-white"
                          : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setLabelColumn(col);
                        setShowValueDropdown(false);
                      }}
                    >
                      {headerNames[col] || col}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="xAxisLabel"
              className="font-medium text-sm sm:text-base"
            >
              X-Axis Label:
            </label>
            <select
              id="xAxisLabel"
              value={labelColumn}
              onChange={(e) => setLabelColumn(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white text-gray-700 text-sm sm:text-base w-full sm:w-auto dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {headerNames[col] || col}
                </option>
              ))}
            </select>
          </div>

          <div
            className="relative w-full sm:w-auto md:flex sm:flex"
            ref={optionsDropdownRef}
          >
            <button
              type="button"
              className="flex justify-between items-center px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-200 text-sm sm:text-base w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              aria-expanded={showOptionsDropdown}
            >
              Chart Options
              <svg
                className="ml-2 h-5 w-5"
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
            {showOptionsDropdown && (
              <div className="absolute z-10 mt-11 w-full rounded-md shadow-md bg-white dark:bg-gray-700 overflow-y-auto max-h-[320px]">
                <div className="py-1">
                  {["bar", "area"].includes(chartConfig.type) && (
                    <label className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center">
                      <input
                        type="checkbox"
                        checked={chartConfig.stacked}
                        onChange={(e) =>
                          setChartConfig({
                            ...chartConfig,
                            stacked: e.target.checked,
                          })
                        }
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                      />
                      Stacked
                    </label>
                  )}
                  {["bar"].includes(chartConfig.type) && (
                    <label className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center">
                      <input
                        type="checkbox"
                        checked={chartConfig.horizontal}
                        onChange={(e) =>
                          setChartConfig({
                            ...chartConfig,
                            horizontal: e.target.checked,
                          })
                        }
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                      />
                      Horizontal
                    </label>
                  )}
                  <label className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center">
                    <input
                      type="checkbox"
                      checked={chartConfig.showLegend}
                      onChange={(e) =>
                        setChartConfig({
                          ...chartConfig,
                          showLegend: e.target.checked,
                        })
                      }
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                    />
                    Show Legend
                  </label>
                  <label className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center">
                    <input
                      type="checkbox"
                      checked={chartConfig.showGrid}
                      onChange={(e) =>
                        setChartConfig({
                          ...chartConfig,
                          showGrid: e.target.checked,
                        })
                      }
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                    />
                    Show Grid
                  </label>
                  <label className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center">
                    <input
                      type="checkbox"
                      checked={chartConfig.showTooltip}
                      onChange={(e) =>
                        setChartConfig({
                          ...chartConfig,
                          showTooltip: e.target.checked,
                        })
                      }
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                    />
                    Show Tooltip
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full sm:w-auto" ref={exportDropdownRef}>
          <Button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className={`w-full sm:w-auto ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
            aria-expanded={showExportDropdown}
          >
            Export
            <svg
              className="ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          {showExportDropdown && (
            <div className="absolute z-10 mt-2 w-full rounded-md shadow-md bg-white dark:bg-gray-700">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => {
                    dispatch(toggleItemSelection("chart"));
                    dispatch(requestExport("pdf"));
                    setShowExportDropdown(false);
                  }}
                >
                  Export as PDF
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => {
                    dispatch(toggleItemSelection("chart"));
                    dispatch(requestExport("image"));
                    setShowExportDropdown(false);
                  }}
                >
                  Export as Image
                </button>
                <label className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center">
                  <input
                    type="checkbox"
                    checked={exportState.selectedExportOptions.includes(
                      "highResolution"
                    )}
                    onChange={() =>
                      dispatch(toggleExportOption("highResolution"))
                    }
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500"
                  />
                  High Resolution
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <h2 className="text-xl bg-gray-50 dark:bg-gray-800 dark:text-white p-2 rounded-t-lg uppercase font-semibold mb-4 text-center">
        {tableTitle}
      </h2>

      {/* Chart + Legend container */}
      <div
        className="max-w-[1205px] bg-white flex"
        style={{
          height: "clamp(300px, 100vh, 600px)",
          backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
          color: theme === "dark" ? "#FFFFFF" : "#000000",
          borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
        }}
        ref={chartRef}
      >
        {/* Chart wrapper with horizontal scrolling */}
        <div
          style={{
            width: "100%", // Take full width of parent
            overflowX: "auto", // Enable horizontal scrolling
            overflowY: "auto", // Prevent vertical scrolling
            flexGrow: 1, // Allow chart to take available space
          }}
        >
          <div
            style={{
              width: Math.max(viewportWidth, columns.length * 150), // Dynamic width based on data
              height: "100%", // Full height of parent
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {renderChartWithoutLegend()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend wrapper (static, not scrollable) */}
        {chartConfig.showLegend && (
          <div
            style={{
              minWidth: "200px",
              flexShrink: 0,
              paddingLeft: "10px",
              color: theme === "dark" ? "#FFF" : "#000",
              alignSelf: "center",
              overflowY: "auto", // Vertical scroll for legend if needed
              maxHeight: "100%",
            }}
          >
            {renderLegend()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
