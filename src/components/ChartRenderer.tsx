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
} from "chart.js";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
} from "react-chartjs-2";

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

type ChartType = keyof typeof chartMap;

type ChartRendererProps = {
  data: ChartData<any, number[], string>;
  type: ChartType;
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, type }) => {
  const ChartComponent = chartMap[type];
  return (
    <div className="w-full md:w-1/2">
      <ChartComponent data={data} />
    </div>
  );
};

export default ChartRenderer;
