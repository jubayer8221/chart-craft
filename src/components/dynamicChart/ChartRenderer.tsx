"use client";
import React from "react";
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
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar } from "react-chartjs-2";

// Register Chart.js components
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

// Define allowed chart types
type ChartType = "bar" | "line" | "pie" | "doughnut" | "radar";

// Map of chart types to their components
const chartComponents = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
} as const;

// Define props for ChartRenderer
type ChartRendererProps<T extends ChartType> = {
  data: ChartData<T, number[], string>;
  type: T;
  options?: ChartOptions<T>;
};

const ChartRenderer = <T extends ChartType>({
  data,
  type,
  options,
}: ChartRendererProps<T>) => {
  const ChartComponent = chartComponents[type];
  const mergedOptions = {
    maintainAspectRatio: false,
    responsive: true,
    ...options,
  };

  return (
    <div className="w-full md:w-1/2 h-[300px]">
      <ChartComponent data={data} options={mergedOptions} />
    </div>
  );
};

export default ChartRenderer;
