"use client";
import React, { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type CustomLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index?: number;
};
import { RxCrossCircled } from "react-icons/rx";
import Link from "next/link";

const yearlyData = [
  { month: "January", buy: 500, sell: 600 },
  { month: "February", buy: 700, sell: 800 },
  { month: "March", buy: 800, sell: 750 },
  { month: "April", buy: 650, sell: 650 },
  { month: "May", buy: 900, sell: 1050 },
  { month: "June", buy: 400, sell: 450 },
  { month: "July", buy: 1000, sell: 1050 },
  { month: "August", buy: 720, sell: 840 },
  { month: "September", buy: 670, sell: 690 },
  { month: "October", buy: 750, sell: 700 },
  { month: "November", buy: 820, sell: 800 },
  { month: "December", buy: 900, sell: 1070 },
  // { month: "Total", buy: 10000, sell: 11500 },
  // { month: "Average", buy: 833.33, sell: 958.33 },
  // { month: "Max", buy: 1000, sell: 1070 },
  // { month: "Min", buy: 400, sell: 450 },
  // { month: "Growth Rate", buy: 20, sell: 25 },
  // { month: "Profit Margin", buy: 15, sell: 20 },
  // { month: "Net Profit", buy: 2000, sell: 2500 },
  // { month: "Total Revenue", buy: 12000, sell: 13000 },
  // { month: "Total Expenses", buy: 2000, sell: 2500 },
  // { month: "Net Income", buy: 10000, sell: 11500 },
];

const COLORS = ["#34d399", "#f87171", "#FFBB28"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function BuySellChart() {
  const [activeTab, setActiveTab] = useState("Data Table");
  const [isTabVisible, setIsTabVisible] = useState(false);
  // const [filter, setFilter] = useState("");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsTabVisible(false);
  };

  const [data, setData] = useState(yearlyData);
  const [filter, setFilter] = useState("");

  const filteredData = data.filter((row) =>
    row.month.toLowerCase().includes(filter.toLowerCase())
  );

  // const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [newRow, setNewRow] = useState({ month: "", buy: 0, sell: 0 });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newData = Array.from(data);
    const [removed] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, removed);
    setData(newData);
  };
  const handleAddRow = () => {
    if (!newRow.month || !newRow.buy || !newRow.sell) {
      // Fixed validation (!newRow.buy was missing)
      alert("Please fill all fields");
      return;
    }
    setData([
      ...data,
      {
        month: newRow.month,
        buy: Number(newRow.buy),
        sell: Number(newRow.sell),
      },
    ]);
    setNewRow({ month: "", buy: 0, sell: 0 });
  };
  const handleDelete = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  return (
    <div className="p-8">
      <main>
        <div className="mt-10 pl-3 pr-3 sm:pl-[100px] sm:pr-[100px] md:pl-[100px] md:pr-[100px] xl:pl-[100px] xl:pr-[100px] font-poppins">
          <div className="flex flex-col xl:flex-row border-b">
            {["Data Table", "Bar chart", "Pie Chart"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-green-500 text-green-500"
                    : "text-gray-500"
                } ${isTabVisible ? "block" : "hidden"} sm:block`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setIsTabVisible(!isTabVisible)}
              className="sm:hidden px-6 py-2 text-gray-500"
            >
              {activeTab}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-6 mt-6 w-full">
            <div className="w-full">
              {activeTab === "Data Table" && (
                <div>
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-6">
                      Buy & Sell Report (1 Year)
                    </h1>
                    <input
                      type="text"
                      placeholder="Search by month"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="mb-4 p-2 border rounded w-full"
                    />

                    <div className="p-8">
                      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="table">
                          {(provided) => (
                            <table
                              className="w-full justify-around border mb-6"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              <thead>
                                <tr className="bg-gray-800 text-white">
                                  <th className="p-2 border">Month</th>
                                  <th className="p-2 border">Buy</th>
                                  <th className="p-2 border">Sell</th>
                                  <th className="p-2 border">Actions</th>
                                  {/* Added Actions column */}
                                </tr>
                              </thead>
                              <tbody>
                                {filteredData.map((row, index) => (
                                  <Draggable
                                    key={row.month + index}
                                    draggableId={row.month + index}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`border ${
                                          snapshot.isDragging
                                            ? "bg-gray-700  text-white"
                                            : "hover:bg-gray-600"
                                        }`}
                                      >
                                        <td className="p-2 border">
                                          {row.month}
                                        </td>
                                        <td className="p-2 border">
                                          {row.buy}
                                        </td>
                                        <td className="p-2 border">
                                          {row.sell}
                                        </td>
                                        <td className="p-2 relative">
                                          <div className="group-hover:visible absolute bottom-1 text-center xl:ml-32 sm:ml-8 md:ml-10 mt-4">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(index);
                                              }}
                                              className=" text-black rounded hover:text-red-600 transition duration-500"
                                            >
                                              <RxCrossCircled className="w-7 h-7 text-center" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </tbody>
                            </table>
                          )}
                        </Droppable>
                      </DragDropContext>

                      {/* Add Row Form */}
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Month"
                          value={newRow.month}
                          onChange={(e) =>
                            setNewRow({ ...newRow, month: e.target.value })
                          }
                          className="border p-2 rounded w-40"
                        />
                        <input
                          type="number"
                          placeholder="Buy"
                          value={newRow.buy}
                          onChange={(e) =>
                            setNewRow({
                              ...newRow,
                              buy: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="border p-2 rounded w-24"
                        />
                        <input
                          type="number"
                          placeholder="Sell"
                          value={newRow.sell}
                          onChange={(e) =>
                            setNewRow({
                              ...newRow,
                              sell: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="border p-2 rounded w-24"
                        />
                        <button
                          onClick={handleAddRow}
                          className="bg-[#52796f] text-white px-4 py-2 rounded hover:bg-[#2f3e46]"
                        >
                          Add Row
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Bar chart" && (
                <div className="text-black">
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                      Monthly Buy vs Sell Report as Bar Chart
                    </h2>
                    <div className="w-full h-[500px]">
                      {/* Fixed height container */}
                      <ResponsiveContainer className="w-6xl h-3xl">
                        <BarChart
                          layout="vertical"
                          data={yearlyData}
                          margin={{ top: 20, right: 30, left: 80, bottom: 40 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                          />
                          {/* Only vertical grid lines */}
                          <XAxis
                            type="number"
                            label={{
                              value: "Amount ($)",
                              position: "bottom",
                              offset: 15,
                              fontSize: 12,
                            }}
                            tickFormatter={(value) =>
                              `$${value.toLocaleString()}`
                            }
                          />
                          <YAxis
                            type="category"
                            dataKey="month"
                            width={100}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              `$${Number(value).toLocaleString()}`,
                              name === "buy" ? "Buy Amount" : "Sell Amount",
                            ]}
                            labelFormatter={(label) => `Month: ${label}`}
                            contentStyle={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Legend
                            verticalAlign="top"
                            height={50}
                            wrapperStyle={{ paddingBottom: "20px" }}
                          />
                          <Bar
                            dataKey="buy"
                            name="Buy"
                            fill="#34d399"
                            radius={[0, 4, 4, 0]}
                            animationDuration={1500}
                          />
                          <Bar
                            dataKey="sell"
                            name="Sell"
                            fill="#f87171"
                            radius={[0, 4, 4, 0]}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Pie Chart" && (
                <div className="w-auto md:grid-cols-2 gap-4">
                  <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                      Total Buy vs Sell (Pie Chart)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Buy",
                              value: yearlyData.reduce(
                                (sum, item) => sum + item.buy,
                                0
                              ),
                            },
                            {
                              name: "Sell",
                              value: yearlyData.reduce(
                                (sum, item) => sum + item.sell,
                                0
                              ),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={index} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Link href="/" className="flex justify-center mt-6">
          <button className="bg-[#52796f] text-white px-4 py-2 rounded transform transition-transform active:scale-95">
            Back to Home page
          </button>
        </Link>
      </main>
    </div>
  );
}
