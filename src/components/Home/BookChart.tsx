"use client";
import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Buy",
    price: 534,
    fill: "#00A9B4",
  },
  {
    name: "Sells",
    price: 342,
    fill: "#0A3A66",
  },
  {
    name: "Buy",
    price: 454,
    fill: "#00A9B4",
  },
  {
    name: "Sells",
    price: 334,
    fill: "#0A3A66",
  },
  {
    name: "Buy",
    price: 44,
    fill: "#00A9B4",
  },
  {
    name: "Sells",
    price: 33,
    fill: "#0A3A66",
  },
];

const BookChart = () => {
  return (
    <Link href={`/category/${3}`}>
      <div className="relative bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Books</h1>
          <TfiLayoutMenuSeparated width={20} height={20} />
        </div>
        <div className="w-full h-[80%]">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="price"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-3xl font-bold">92%</h1>
          <p className="text-xs text-gray-300">of 10 max LTS</p>
        </div>
        <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
          2024 Year - 2025Year
        </h2>
      </div>
    </Link>
  );
};

export default BookChart;
