"use client";
import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Mon",
    buy: 60,
    sells: 40,
  },
  {
    name: "Tue",
    buy: 70,
    sells: 60,
  },
  {
    name: "Wed",
    buy: 90,
    sells: 75,
  },
  {
    name: "Thu",
    buy: 90,
    sells: 75,
  },
  {
    name: "Fri",
    buy: 65,
    sells: 55,
  },
];

const FurnituresChart = () => {
  return (
    <Link href={`/category/${4}`}>
      <div className="bg-white dark:bg-gray-800  rounded-xl w-full h-full p-4 flex flex-col justify-between">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Furnitures</h1>
          <TfiLayoutMenuSeparated width={20} height={20} />
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart width={500} height={300} data={data} barSize={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ddd"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
            />
            <Bar
              dataKey="buy"
              fill="#00A9B4"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="sells"
              fill="#0A3A66"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
};

export default FurnituresChart;
