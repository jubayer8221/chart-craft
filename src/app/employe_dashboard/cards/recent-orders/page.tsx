"use client";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Moon, Sun } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  order: string;
  progress: string;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const mockData: Item[] = [
    {
      id: "1",
      name: "Shirt",
      price: 25.99,
      order: "1001",
      progress: "Delivered",
    },
    {
      id: "2",
      name: "Pants",
      price: 45.49,
      order: "1002",
      progress: "In Transit",
    },
    {
      id: "3",
      name: "Shoes",
      price: 89.99,
      order: "1003",
      progress: "Processing",
    },
    {
      id: "4",
      name: "Hat",
      price: 15.75,
      order: "1004",
      progress: "Delivered",
    },
    {
      id: "5",
      name: "Jacket",
      price: 120.0,
      order: "1005",
      progress: "Cancelled",
    },
    {
      id: "6",
      name: "Socks",
      price: 5.99,
      order: "1006",
      progress: "Processing",
    },
    {
      id: "7",
      name: "Scarf",
      price: 12.49,
      order: "1007",
      progress: "In Transit",
    },
    {
      id: "8",
      name: "Gloves",
      price: 18.99,
      order: "1008",
      progress: "Delivered",
    },
    {
      id: "9",
      name: "Sweater",
      price: 55.0,
      order: "1009",
      progress: "Cancelled",
    },
    {
      id: "10",
      name: "Belt",
      price: 20.0,
      order: "1010",
      progress: "Processing",
    },
  ];
  const [data, setData] = useState(mockData);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(data);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setData(reordered);
  };

  const onPrint = () => {
    console.log("Print function executed");
  };

  const handleCellEdit = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [key]: key === "price" ? parseFloat(value as string) || 0 : value,
    };
    setData(newData);
  };

  function onExportCSV(): void {
    const rows = selectedRowIndex !== null ? [data[selectedRowIndex]] : data;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "<table><tr><th>ID</th><th>Name</th><th>Price</th></tr>",
        ...rows.map(
          (item) =>
            `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td></tr>`
        ),
        "</table>",
      ].join("");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div
      className={`p-4 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex gap-4 mb-4">
          <button
            onClick={onPrint}
            className="bg-[#0A3A66] hover:bg-[#0A3A66]/90 text-white px-4 py-2 rounded-md transition-transform duration-150 active:scale-95"
          >
            Print {selectedRowIndex !== null ? "Selected" : "All"}
          </button>
          <button
            onClick={onExportCSV}
            className="bg-[#0A3A66] hover:bg-[#0A3A66]/90 text-white px-4 py-2 rounded-md transition-transform duration-150 active:scale-95"
          >
            Export {selectedRowIndex !== null ? "Selected" : "All"} CSV
          </button>
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="text-sm px-4 py-2 rounded-md border border-gray-400 flex items-center gap-2 transition-transform duration-150 active:scale-95"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <table
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-w-full border border-collapse border-gray-300 dark:border-gray-700"
            >
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
                  <th className="border p-2 font-semibold">
                    <div className="flex justify-between w-full">#</div>
                  </th>
                  <th className="border p-2 font-semibold">
                    <div className="flex justify-between w-full">Name</div>
                  </th>
                  <th className="border p-2 font-semibold">
                    <div className="flex justify-between w-full">Order ID</div>
                  </th>
                  <th className="border p-2 font-semibold">
                    <div className="flex justify-between w-full">Progress</div>
                  </th>
                  <th className="border p-2 font-semibold">
                    <div className="flex justify-between w-full">Price</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: Item, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`border-b hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                          selectedRowIndex === index
                            ? "bg-gray-200 dark:bg-gray-800"
                            : ""
                        }`}
                        onClick={() => setSelectedRowIndex(index)}
                      >
                        <td className="border p-2">
                          <div className="flex justify-between w-full">
                            {index + 1}
                          </div>
                        </td>
                        <td className="border p-2">
                          <div className="flex justify-between w-full">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleCellEdit(index, "name", e.target.value)
                              }
                              className="bg-transparent w-full outline-none"
                            />
                          </div>
                        </td>
                        <td className="border p-2">
                          <div className="flex justify-between w-full">
                            {item.order}
                          </div>
                        </td>
                        <td className="border p-2">
                          <div className="flex justify-between w-full">
                            {item.progress}
                          </div>
                        </td>
                        <td className="border p-2">
                          <div className="flex justify-between w-full">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleCellEdit(index, "price", e.target.value)
                              }
                              className="bg-transparent w-full outline-none text-right"
                            />
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
    </div>
  );
}
