"use client";
import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

// Use a function to determine the fill color based on the theme
const data = [
  {
    name: "Total",
    price: 6563,
    fill: typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "#333" : "white", // Dark gray in dark mode, white in light mode
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
];

const Toyschart = () => {
  return (
    <div className="bg-white dark:bg-[#312c4a] rounded-xl w-full h-full p-4 flex flex-col justify-between">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Toys</h1>
        <Link href={`/category/${5}`}>
          <TfiLayoutMenuSeparated width={20} height={20} />
        </Link>
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
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-[#00A9B4] rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300">Buy</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-[#0A3A66] rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300">Sells</h2>
        </div>
      </div>
    </div>
  );
};

export default Toyschart;