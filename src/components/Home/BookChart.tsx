"use client";
import Link from "next/link";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '2025',
    Sells: 4000,
    Buy: 2400,
    amt: 2400,
  },
  {
    name: '2024',
    Sells: 3000,
    Buy: 1398,
    amt: 2210,
  },
  {
    name: '2023',
    Sells: 2000,
    Buy: 9800,
    amt: 2290,
  },
  {
    name: '2022',
    Salls: 2780,
    Buy: 3908,
    amt: 2000,
  },
  {
    name: '0',
    Sells: 1890,
    Buy: 4800,
    amt: 2181,
  },
];

const BookChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-primary">Books</h1>
        <Link href={`/category/${6}`}>
          <TfiLayoutMenuSeparated className="text-secondary" size={20} />
        </Link>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          layout="vertical"
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line dataKey="Sells" stroke="#0A3A66" strokeWidth={2} />
          <Line dataKey="Buy" stroke="#00A9B4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookChart;
