"use client";

import { useState, useMemo, useEffect, ReactElement, useRef } from "react";
import type { LayoutType, ScaleType } from "recharts/types/util/types";
import { useDispatch, useSelector } from "react-redux";
import {
  requestExport,
  resetExport,
  toggleItemSelection,
  toggleExportOption,
} from "@/redux/slices/exportSlice";
import { setColor, setColors } from "@/redux/slices/colorSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
import { Button } from "../ui/button";
import { ParsedRow } from "@/types/convertType";

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
  headerNames: { [key: string]: string };
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
  const { headerNames } = useSelector(
    (state: { data: DataState }) => state.data
  );
  const [showExportDropdown, setShowExportDropdown] = useState(false);
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
  const [showValueDropdown, setShowValueDropdown] = useState<boolean>(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const valueDropdownRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

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

    // Skip caption row if it exists
    const isCaptionRow = data.length > 0 && Object.keys(data[0]).length === 1;
    const chartData = isCaptionRow ? data.slice(1) : data;

    const columns = Array.from(
      new Set(chartData.flatMap((row: ParsedRow) => Object.keys(row)))
    ).filter((col: string) => col);

    const processedData = chartData.map((row: ParsedRow) => {
      const newRow: ParsedRow = {};
      columns.forEach((col: string) => {
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

    const numericCols = columns.filter((col: string) =>
      processedData.some(
        (row: ParsedRow) =>
          row[col] !== null &&
          row[col] !== undefined &&
          typeof row[col] === "number"
      )
    );

    const nonNumericCols = columns.filter(
      (col: string) => !numericCols.includes(col)
    );

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
        autoSelectedValues.forEach((col: string, index: number) => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          const canvas = await html2canvas(chartRef.current, {
            scale: exportState.selectedExportOptions.includes("highResolution")
              ? 2
              : 1,
            backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
            useCORS: true,
            logging: false,
            onclone: (clonedDoc: Document) => {
              const elements = clonedDoc.querySelectorAll("*");
              elements.forEach((el: Element) => {
                const htmlEl = el as HTMLElement;
                const style = window.getComputedStyle(htmlEl);
                ["color", "background-color", "border-color"].forEach(
                  (prop: string) => {
                    if (style.getPropertyValue(prop).includes("oklch(")) {
                      htmlEl.style.setProperty(
                        prop,
                        theme === "dark" ? "#FFFFFF" : "#000000"
                      );
                    }
                  }
                );
              });
            },
          });

          const imgData = canvas.toDataURL("image/png");

          if (exportState.exportFormat === "image") {
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "chart.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (exportState.exportFormat === "pdf") {
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width / 2, canvas.height / 2],
            });
            pdf.addImage(
              imgData,
              "PNG",
              0,
              0,
              canvas.width / 2,
              canvas.height / 2
            );
            pdf.save("chart.pdf");
          }

          dispatch(resetExport());
        } catch (error: unknown) {
          console.error("Export failed:", error);
          dispatch(resetExport());
        }
      };

      exportChart();
    }
  }, [exportState, theme, dispatch]);

  // Prepare data for Pie chart
  const pieData = useMemo<PieDataEntry[]>(() => {
    if (!labelColumn || !valueColumns.length || !processedData.length)
      return [];

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
    setValueColumns((prev: string[]) => {
      const newColumns = prev.includes(column)
        ? prev.filter((c: string) => c !== column)
        : [...prev, column];

      const newColors: Record<string, string> = { ...colors };
      newColumns.forEach((col: string) => {
        if (!newColors[col]) {
          newColors[col] =
            defaultColors[Object.keys(newColors).length % defaultColors.length];
          dispatch(setColor({ column: col, color: newColors[col] }));
        }
      });

      return newColumns;
    });
  };

  // Dynamic chart rendering
  const renderChart = (): ReactElement => {
    if (!labelColumn || !valueColumns.length || !processedData.length) {
      return (
        <div className="py-6 my-2 text-center text-gray-500 dark:text-gray-400">
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
      animationEasing: "ease-in-out" as const,
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

    switch (chartConfig.type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
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
            {valueColumns.map((key: string) => (
              <Bar
                key={key}
                dataKey={key}
                name={headerNames[key] || key}
                fill={colors[key] || defaultColors[0]}
                stackId={chartConfig.stacked ? "stack" : undefined}
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
            <YAxis {...yAxisProps} />
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
            {valueColumns.map((key: string) => (
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
            <div className="py-6 my-2 text-center text-gray-500 dark:text-gray-400">
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
              {pieData.map((_: PieDataEntry, index: number) => (
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
            {chartConfig.showLegend && <Legend />}
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
            <YAxis {...yAxisProps} />
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
            {valueColumns.map((key: string) => (
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
            <div className="py-6 my-2 text-center text-gray-500 dark:text-gray-400">
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
          <div className="py-6 my-2 text-center text-gray-500 dark:text-gray-400">
            Invalid chart type selected
          </div>
        );
    }
  };

  return (
    <div
      className={`pt-6 mt-2 rounded-md px-4 border ${
        theme === "dark"
          ? "bg-[#312c4a] text-white border-gray-700"
          : "text-gray-800 border-gray-300"
      }`}
    >
      {/* Controls */}
      <div className="relative flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
        {/* Chart Type Dropdown */}
        <div className="relative flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="chartType"
            className="font-medium text-sm sm:text-base dark:text-white"
          >
            Chart Type:
          </label>
          <select
            id="chartType"
            value={chartConfig.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setChartConfig({
                ...chartConfig,
                type: e.target.value as ChartConfig["type"],
              })
            }
            className="px-2 py-1 sm:px-3 sm:py-2 border relative rounded-md bg-white text-gray-700 text-sm sm:text-base w-full sm:w-auto dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
        {/* Label and Value Columns Dropdown */}
        <div className="relative w-full sm:w-auto" ref={valueDropdownRef}>
          <button
            type="button"
            className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-1.5 border rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            onClick={() => setShowValueDropdown(!showValueDropdown)}
            aria-expanded={showValueDropdown}
            aria-haspopup="true"
          >
            Select Columns
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
          {showValueDropdown && (
            <div
              className="absolute z-10 top-full mt-2 w-full rounded-md shadow-md bg-white dark:bg-gray-700 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1 border-b border-gray-100 dark:border-gray-600">
                {nonNumericColumns.map((col: string) => (
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
                    role="menuitem"
                  >
                    {headerNames[col] || col}
                  </button>
                ))}
              </div>
              <div className="py-1">
                <div className="relative px-4 py-2 text-sm text-gray-700 dark:text-white font-medium">
                  Value Columns
                </div>
                {numericColumns.map((col: string) => (
                  <label
                    key={col}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center"
                    role="menuitem"
                  >
                    <input
                      type="checkbox"
                      checked={valueColumns.includes(col)}
                      onChange={() => toggleValueColumn(col)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
                    />
                    {headerNames[col] || col}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Chart Options Dropdown */}
        <div className="relative w-full sm:w-auto" ref={optionsDropdownRef}>
          <button
            type="button"
            className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-1.5 border rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            aria-expanded={showOptionsDropdown}
            aria-haspopup="true"
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
          {showOptionsDropdown && (
            <div
              className="absolute z-10 top-full mt-2 w-full rounded-md shadow-md bg-white dark:bg-gray-700 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
            >
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
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
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
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
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
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
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
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
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
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
                  />
                  Show Tooltip
                </label>
              </div>
            </div>
          )}
        </div>
        {/* Color Selectors */}
        {valueColumns.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <span className="font-medium text-sm sm:text-base hidden sm:inline dark:text-white">
              Colors:
            </span>
            <div className="flex flex-wrap gap-1">
              {valueColumns.map((col: string) => (
                <div
                  key={col}
                  className="flex items-center gap-1 bg-blue-50 dark:bg-gray-600 px-2 py-1 rounded text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[80px] sm:max-w-[120px] dark:text-white">
                    {headerNames[col] || col}
                  </span>
                  <input
                    type="color"
                    value={colors[col] || defaultColors[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleColorChange(col, e.target.value)
                    }
                    className="w-4 h-4 border-none cursor-pointer"
                    aria-label={`Color picker for ${headerNames[col] || col}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Export Button */}
        <div className="relative w-full sm:w-auto" ref={exportDropdownRef}>
          <Button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className={`w-full sm:w-auto ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-500 hover:text-white"
            }`}
            aria-expanded={showExportDropdown}
            aria-haspopup="true"
          >
            Export
            <svg
              className="ml-2 -mr-1 h-5 w-5"
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
          </Button>
          {showExportDropdown && (
            <div
              className="absolute z-10 top-full mt-2 w-full rounded-md shadow-md bg-white dark:bg-gray-700 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => {
                    dispatch(toggleItemSelection("chart"));
                    dispatch(requestExport("pdf"));
                    setShowExportDropdown(false);
                  }}
                  role="menuitem"
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
                  role="menuitem"
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
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600"
                  />
                  High Resolution
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Chart */}
      <div
        ref={chartRef}
        className="mt-4"
        style={{
          height: "clamp(300px, 60vh, 600px)",
          backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
          color: theme === "dark" ? "#FFFFFF" : "#000000",
          borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
