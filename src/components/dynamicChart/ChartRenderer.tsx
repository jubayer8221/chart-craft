"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartType as ChartJSType,
  Chart as ChartJSInstance,
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar } from "react-chartjs-2";

// Define two user-friendly colors
const PRIMARY_COLOR = "#685e74";
const SECONDARY_COLOR = "#4d4d4d";

// Register core chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const chartMap = { Bar, Line, Pie, Doughnut, Radar } as const;
type ChartType = keyof typeof chartMap;

// Map capitalized ChartType to lowercase chart.js types
type ChartTypeToLowercase = {
  Bar: "bar";
  Line: "line";
  Pie: "pie";
  Doughnut: "doughnut";
  Radar: "radar";
};

// Interface for ChartRendererProps
interface ChartRendererProps {
  data: ChartData<ChartJSType, number[], string>;
  type: ChartType;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, type }) => {
  // Use mapped type for chartRef
  const chartRef = useRef<ChartJSInstance<ChartTypeToLowercase[ChartType], number[], string> | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect light/dark mode to invert text if needed
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true });
    return () => mo.disconnect();
  }, []);

  // Create a simple vertical gradient between the two colors
  const createGradient = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return PRIMARY_COLOR;
    const ctx = chart.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, chart.height);
    grad.addColorStop(0, PRIMARY_COLOR);
    grad.addColorStop(1, SECONDARY_COLOR);
    return grad;
  }, []);

  // Apply colors to datasets
  const styledData = {
    ...data,
    datasets: data.datasets.map((ds) => ({
      ...ds,
      backgroundColor: type === "Bar" || type === "Doughnut" ? createGradient() : PRIMARY_COLOR,
      borderColor: type === "Line" ? createGradient() : SECONDARY_COLOR,
      borderWidth: 2,
      pointBackgroundColor: SECONDARY_COLOR,
      pointBorderColor: PRIMARY_COLOR,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: type === "Line" ? 0.3 : undefined,
    })),
  };

  // Common options
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutCubic" },
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#fff" : "#333",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? SECONDARY_COLOR : "#fff",
        titleColor: isDark ? "#fff" : PRIMARY_COLOR,
        bodyColor: isDark ? SECONDARY_COLOR : "#black" ,
        borderColor: PRIMARY_COLOR,
        borderWidth: 1,
        cornerRadius: 6,
        padding: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#ccc" : "#555", font: { size: 11 } },
        grid: { color: "transparent" },
      },
      y: {
        ticks: { color: isDark ? "#ccc" : "#555", font: { size: 11 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
    elements: {
      bar: { borderRadius: 4 },
      line: { tension: 0.3, fill: false },
      point: { hoverBorderWidth: 2 },
    },
  };

  // Type-safe chart component
  const TypedChart = chartMap[type] as React.ForwardRefExoticComponent<
    React.RefAttributes<ChartJSInstance<ChartTypeToLowercase[ChartType], number[], string>> & {
      data: ChartData<ChartJSType, number[], string>;
      options?: ChartOptions;
    }
  >;

  return (
    <div
      className={`w-full md:w-[600px] h-[350px] p-4 rounded-xl shadow-md bg-${
        isDark ? "neutral-900" : "white"
      }`}
    >
      <TypedChart ref={chartRef} data={styledData} options={options} />
    </div>
  );
};

export default ChartRenderer;