"use client";
import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data01 = [
  { x: 10, y: 30 },
  { x: 30, y: 200 },
  { x: 45, y: 100 },
  { x: 50, y: 400 },
  { x: 70, y: 150 },
];
const data02 = [
  { x: 30, y: 20 },
  { x: 50, y: 180 },
  { x: 75, y: 240 },
  { x: 100, y: 100 },
];
const GroceriesChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Groceries</h1>
        <Link href={`/category/${6}`}><TfiLayoutMenuSeparated width={20} height={20} /></Link>
      </div>
      <div className="w-full h-[70%]">
        <ResponsiveContainer width="100%" height="90%">
          <ScatterChart
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="stature" />
            <YAxis type="number" dataKey="y" name="weight" />
            <ZAxis type="number" range={[100]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter
              name="buy"
              data={data01}
              fill="#00A9B4"
              line
              shape="cross"
            />
            <Scatter
              name="sells"
              data={data02}
              fill="#0A3A66"
              line
              shape="diamond"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GroceriesChart;
