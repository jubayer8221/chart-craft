"use client";
import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const mockData: Item[] = [
    { id: "1", name: "Item 1", price: 10 },
    { id: "2", name: "Item 2", price: 20 },
    { id: "3", name: "Item 3", price: 30 },
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
    // Add your print logic here
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
                <tr className="bg-gray-100 dark:bg-gray-500 text-white">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Price</th>
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
                        className={`border-b hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer ${
                          selectedRowIndex === index
                            ? "bg-gray-200 dark:bg-gray-200"
                            : ""
                        }`}
                        onClick={() => setSelectedRowIndex(index)}
                      >
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleCellEdit(index, "name", e.target.value)
                            }
                            className="bg-transparent w-full outline-none"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleCellEdit(index, "price", e.target.value)
                            }
                            className="bg-transparent w-full outline-none"
                          />
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
