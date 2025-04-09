"use client";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    price: 6563,
    fill: "white",
  },
  {
    name: "Buy",
    price: 4534,
    fill: "#FAE27C",
  },
  {
    name: "Sells",
    price: 3342,
    fill: "#C3EBFA",
  },
];

const ElectronicsCountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Electronics</h1>
        <TfiLayoutMenuSeparated width={20} height={20} />
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
          <div className="w-5 h-5 bg-[#FAE27C] rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300">Buy</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300">Sells</h2>
        </div>
      </div>
    </div>
  )
}

export default ElectronicsCountChart
