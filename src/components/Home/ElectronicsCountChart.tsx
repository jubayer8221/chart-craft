"use client";
import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const ElectronicsCountChart = () => {
  const { theme } = useTheme();

  const data = useMemo(() => [
    {
      name: "Total",
      price: 6563,
      fill: theme === "dark" ? "#312c4a" : "white", // Change color based on theme
    },
    {
      name: "Buy",
      price: 4534,
      fill: "#00A9B4",
    },
    {
      name: "Sells",
      price: 3342,
      fill: "#0A3A66",
    },
  ], [theme]);

  return (
    <Link href={`/category/${1}`}>
      <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-black dark:text-white">Electronics</h1>
          <TfiLayoutMenuSeparated width={20} height={20} className="text-black dark:text-white" />
        </div>

        {/* CHART */}
        <div className="w-full h-[75%]">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={data}
            >
              <RadialBar background dataKey="price" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM */}
        <div className="flex justify-center gap-16">
          <div className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 bg-[#00A9B4] rounded-full" />
            <h1 className="font-bold text-black dark:text-white">1,234</h1>
            <h2 className="text-xs text-gray-500 dark:text-gray-300">Buy</h2>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-5 h-5 bg-[#0A3A66] rounded-full" />
            <h1 className="font-bold text-black dark:text-white">1,234</h1>
            <h2 className="text-xs text-gray-500 dark:text-gray-300">Sells</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ElectronicsCountChart;
