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
  ChartType as ChartJSType,
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

const chartMap = {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
};

// Define allowed chart types
type ChartType = keyof typeof chartMap;

// Define a type for the chart component to ensure it accepts the correct props
type ChartComponentType = React.ComponentType<{
  data: ChartData<ChartJSType, number[], string>;
}>;

type ChartRendererProps = {
  data: ChartData<ChartJSType, number[], string>;
  type: ChartType;
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, type }) => {
  const ChartComponent: ChartComponentType = chartMap[type];
  return (
    <div className="w-full md:w-1/2 h-[300px]">
      <ChartComponent
        data={data}
        // options={{ maintainAspectRatio: false }}
      />
    </div>

  );
};

export default ChartRenderer;