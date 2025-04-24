"use client";
import React, { useEffect, useState } from "react";
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
  ChartOptions,
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar } from "react-chartjs-2";

// Register chart components
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
} as const;

type ChartType = keyof typeof chartMap;

type ChartRendererProps = {
  data: ChartData<ChartJSType, number[], string>;
  type: ChartType;
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ data, type }) => {
  const ChartComponent = chartMap[type] as React.ComponentType<{
    data: ChartData<ChartJSType, number[], string>;
    options?: ChartOptions;
  }>;

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const commonOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#fff" : "#333",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#333" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#fff" : "#333",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#fff" : "#333",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  return (
    <div className="w-full md:w-1/2 h-[300px]">
      <ChartComponent data={data} options={commonOptions} />
    </div>
  );
};

export default ChartRenderer;
