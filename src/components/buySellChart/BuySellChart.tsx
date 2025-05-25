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
    <div className="bg-[#F7F7F7] min-h-screen">
      <main>
        <div className="font-poppins">
          <div className="flex mt-4 bg-white shadow-md rounded-lg p-6">
            {["Data Table", "Bar chart", "Pie Chart"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`justify-between px-4 items-center py-2 ${
                  activeTab === tab
                    ? " bg-[#0A3A66] rounded-lg text-white"
                    : "text-gray-500"
                } ${isTabVisible ? "block" : "hidden"} sm:block`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setIsTabVisible(!isTabVisible)}
              className="sm:hidden px-6 py-2 bg-[#0A3A66]"
            >
              {activeTab}
            </button>
          </div>

          <div className="flex justify-between gap-6 mt-6 w-full">
            <div className="w-full">
              {activeTab === "Data Table" && (
                <div>
                  <div className="text-center bg-white shadow-md rounded-lg p-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold mb-4">
                          Data Table
                        </h1>
                        <input
                          type="text"
                          placeholder="Search by month"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="p-2 border rounded "
                        />
                      </div>

                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="table">
                          {(provided) => (
                            <table
                              className="w-full max-w-screen justify-around mb-6"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              <thead>
                                <tr className="bg-[#0A3A66] text-white">
                                  <th className="p-2 text-left">Month</th>
                                  <th className="p-2">Buy</th>
                                  <th className="p-2">Sell</th>
                                  <th className="p-2">Actions</th>
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
                                        className={`border-y-[1px] ${
                                          snapshot.isDragging
                                            ? "bg-gray-700  text-white hover:text-white"
                                            : "hover:bg-gray-600 hover:text-white"
                                        }`}
                                      >
                                        <td className="p-2 text-left">
                                          {row.month}
                                        </td>
                                        <td className="p-2">{row.buy}</td>
                                        <td className="p-2">{row.sell}</td>
                                        <td className="p-2 relative">
                                          {/* <div className="group-hover:visible absolute bottom-1 text-center xl:ml-32 sm:ml-8 md:ml-10 mt-4"> */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDelete(index);
                                            }}
                                            className=" text-gray-900 rounded hover:text-red-600 transition duration-500"
                                          >
                                            <RxCrossCircled className="w-7 h-7 text-center" />
                                          </button>
                                          {/* </div> */}
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
                          className="border p-2 rounded w-24"
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
                          className="border p-2 rounded w-20"
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
                          className="border p-2 rounded w-20"
                        />
                        <button
                          onClick={handleAddRow}
                          className="bg-[#0A3A66] text-white px-4 py-2 rounded hover:bg-[#2f3e46] transform transition-transform active:scale-95"
                        >
                          Add Row
                        </button>
                        <Link href="/" className="flex justify-center">
                          <button className="bg-[#0A3A66] text-white px-4 py-2 rounded transform transition-transform active:scale-95">
                            Home page
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "Bar chart" && (
                <div className="w-full h-screen pb-10 bg-white shadow-md rounded-lg">
                  <h1 className="text-xl font-semibold mb-4 p-4">
                    Monthly Buy vs Sell Report as Bar Chart
                  </h1>
                  {/* Fixed height container */}
                  <ResponsiveContainer className="w-screen h-screen ">
                    <BarChart
                      layout="vertical"
                      data={yearlyData}
                      margin={{ top: 20, right: 30, left: 80, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} />
                      {/* Only vertical grid lines */}
                      <XAxis
                        type="number"
                        label={{
                          value: "Amount ($)",
                          position: "bottom",
                          offset: 15,
                          fontSize: 12,
                        }}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
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
              )}
              {activeTab === "Pie Chart" && (
                <div className="w-full bg-white shadow-md rounded-lg p-4">
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export const metadata = {
  title: "Buy & Sell Chart",
  description: "Buy & Sell Chart",
};
