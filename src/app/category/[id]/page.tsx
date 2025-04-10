"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { notFound, useParams } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { useState } from "react";

interface CategoryItem {
  item: string;
  price: number;
  oldPrice?: number;
  quality?: string;
}

interface CategoryData {
  [key: string]: CategoryItem[];
}

interface CategoryNames {
  [key: string]: string;
}

const categoryData: CategoryData = {
  "1": [
    { item: "I phone", price: 999, oldPrice: 1099, quality: "High" },
    { item: "Redme", price: 899, quality: "Medium" },
    { item: "Dell", price: 1599, oldPrice: 1699, quality: "High" },
    { item: "Hp", price: 1499, quality: "Medium" },
    { item: "Watch", price: 1699, oldPrice: 1969, quality: "Medium" },
  ],
  "2": [
    { item: "Shirt", price: 25, oldPrice: 30, quality: "High" },
    { item: "Shirt", price: 30, quality: "Medium" },
    { item: "Pants", price: 40, oldPrice: 50, quality: "High" },
    { item: "Pants", price: 45, quality: "Medium" },
  ],
  "3": [
    { item: "Fiction Book", price: 15, oldPrice: 20, quality: "New" },
    { item: "Non-Fiction Book", price: 20, quality: "Used" },
    { item: "Children's Book", price: 10, oldPrice: 12, quality: "New" },
  ],
  "4": [
    { item: "Sofa", price: 500, oldPrice: 600, quality: "High" },
    { item: "Dining Table", price: 300, oldPrice: 350, quality: "Medium" },
    { item: "Chair", price: 50, quality: "Low" },
  ],
  "5": [
    { item: "Action Figure", price: 25, oldPrice: 30, quality: "New" },
    { item: "Board Game", price: 40, quality: "New" },
    { item: "Puzzle", price: 15, oldPrice: 20, quality: "New" },
  ],
  "6": [
    { item: "Milk", price: 3, quality: "Fresh" },
    { item: "Bread", price: 2, oldPrice: 3, quality: "Fresh" },
    { item: "Eggs", price: 5, quality: "Organic" },
    { item: "Cheese", price: 8, oldPrice: 10, quality: "Premium" },
  ],
};

const categoryNames: CategoryNames = {
  "1": "Electronics",
  "2": "Clothing",
  "3": "Books",
  "4": "Furniture",
  "5": "Toys",
  "6": "Groceries",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function CategoryPage() {
  const params = useParams(); // Get dynamic route param
  const id = params.id as string;

  const [rows, setRows] = useState<CategoryItem[]>(categoryData[id] || []);

  if (!categoryData[id] || !categoryNames[id]) {
    return notFound(); // Valid App Router usage
  }

  const categoryName = categoryNames[id];

  const data01 = rows.map((item) => ({
    name: item.item,
    value: item.price,
  }));

  const data02 = rows
    .filter((item) => item.oldPrice)
    .map((item) => ({
      name: item.item,
      value: item.oldPrice || 0,
    }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRows(items);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 2xl:px-16">
      <h1 className="text-2xl font-bold mb-2 text-center pt-6">
        {categoryName}
      </h1>
      <div className="flex flex-wrap gap-4 justify-center items-start bg-white w-full mx-auto">
        <div className="flex-1 border-2 hover:border-b-[#3c6e71] rounded-lg p-4 shadow-lg min-w-[300px] max-w-[500px] w-full">
          <h1 className="text-xl font-semibold mb-4">Table</h1>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="category-table">
              {(provided) => (
                <table
                  className="w-full h-[270px] border mb-8"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead>
                    <tr className="bg-gray-400">
                      <th className="p-2 border">Item</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Old Price</th>
                      <th className="p-2 border">Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <Draggable
                        key={row.item + index}
                        draggableId={row.item + index}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border ${
                              snapshot.isDragging
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <td className="p-2 border">{row.item}</td>
                            <td className="p-2 border">${row.price}</td>
                            <td className="p-2 border">
                              {row.oldPrice ? `$${row.oldPrice}` : "N/A"}
                            </td>
                            <td className="p-2 border">
                              {row.quality || "N/A"}
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
        </div>

        <div className="flex-1 border-2 border-b-[#3c6e71] rounded-lg p-4 shadow-lg min-w-[300px] max-w-[500px] w-full hover:shadow-lg transition-shadow duration-300">
          <h1 className="text-xl font-semibold mb-4">Bar Chart</h1>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={rows} margin={{ left: 50 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="item" />
              <Tooltip />
              <Bar dataKey="price" fill="#3b82f6" />
              <Bar dataKey="oldPrice" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 border-2 border-b-[#3c6e71] rounded-lg p-4 shadow-lg min-w-[300px] max-w-[500px] w-full">
          <h1 className="text-xl font-semibold mb-4">Pie Chart</h1>

          <PieChart width={400} height={300}>
            <Pie
              data={data01}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
            >
              {data01.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Pie
              data={data02}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#82ca9d"
              label
            >
              {data02.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
      <div className="flex justify-around">
        <Link href="/buySellChart">
          <button className="px-4 py-2 bg-[#3c6e71] text-white rounded hover:bg-[#2f3e46] transition m-5 active:scale-95">
            Buy & Sell Report
          </button>
        </Link>
      </div>
      <div className="flex justify-center">
        <Link href="/">
          <button className="px-4 py-2 my-5 mb-10 bg-[#3c6e71] text-white rounded hover:bg-[#2f3e46] transition active:scale-95">
            Back to Home page
          </button>
        </Link>
      </div>
    </div>
  );
}
