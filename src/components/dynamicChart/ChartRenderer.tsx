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

// Define allowed chart types and map
const chartMap = {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
} as const;

type ChartType = keyof typeof chartMap;

type ChartRendererProps = {
  data: ChartData<ChartJSType, number[], string>;
  type: ChartType;
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, type }) => {
  const ChartComponent = chartMap[type] as React.ComponentType<{ data: ChartData<ChartJSType, number[], string> }>;

  
  return (
    <div className="w-full md:w-1/2 h-[300px]">
      <ChartComponent data={data} />
    </div>
  );
};

export default ChartRenderer;
