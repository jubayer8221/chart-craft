"use client";
import React, { useState, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Moon, Sun, Filter, Eye, EyeOff } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
  order: string;
  progress: string;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [progressFilter, setProgressFilter] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "id",
    "name",
    "order",
    "progress",
    "price",
  ]);

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

  const filteredData = useMemo(() => {
    if (!progressFilter) return data;
    return data.filter((item) => item.progress === progressFilter);
  }, [data, progressFilter]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      }
      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(
    () =>
      sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [sortedData, currentPage]
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(data);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setData(reordered);
  };

  const handleCellEdit = (
    index: number,
    key: keyof Item,
    value: string | number
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [key]: key === "price" ? parseFloat(value as string) || 0 : value,
    };
    setData(newData);
  };

  const requestSort = (key: keyof Item) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const onPrint = () => {
    const rows =
      selectedRows.length > 0 ? selectedRows.map((i) => data[i]) : data;
    console.log("Print Data:", rows);
    alert("Check console log for print data.");
  };

  const onExportCSV = () => {
    const rows =
      selectedRows.length > 0 ? selectedRows.map((i) => data[i]) : data;
    const csv = [
      "ID,Name,Price,Order ID,Progress",
      ...rows.map(
        (r) => `${r.id},${r.name},${r.price},${r.order},${r.progress}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteSelected = () => {
    const remaining = data.filter((_, idx) => !selectedRows.includes(idx));
    setData(remaining);
    setSelectedRows([]);
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  return (
    <div
      className={`p-4 min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between flex-wrap gap-2 items-center mb-4">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={onPrint}
            className="bg-[#0A3A66] hover:bg-[#0A3A66]/90 text-white px-4 py-2 rounded-md"
          >
            Print
          </button>
          <button
            onClick={onExportCSV}
            className="bg-[#0A3A66] hover:bg-[#0A3A66]/90 text-white px-4 py-2 rounded-md"
          >
            Export CSV
          </button>
          <button
            onClick={deleteSelected}
            className="bg-red-700 hover:bg-red-700/90 text-white px-4 py-2 rounded-md"
          >
            Delete Selected
          </button>
          <select
            onChange={(e) => setProgressFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Progress</option>
            <option value="Delivered">Delivered</option>
            <option value="In Transit">In Transit</option>
            <option value="Processing">Processing</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="border rounded px-4 py-2 flex items-center gap-2"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {["id", "name", "order", "progress", "price"].map((col) => (
            <button
              key={col}
              onClick={() => toggleColumn(col)}
              className="text-sm border rounded px-4 py-2 flex items-center gap-2"
            >
              {visibleColumns.includes(col) ? (
                <Eye size={16} />
              ) : (
                <EyeOff size={16} />
              )}{" "}
              {col}
            </button>
          ))}
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
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
                <tr>
                  <th className="border p-2 font-semibold">Select</th>
                  {["No.", "Name", "Order ID", "Progress", "Price"].map(
                    (col, idx) => {
                      const keys = ["id", "name", "order", "progress", "price"];
                      if (!visibleColumns.includes(keys[idx])) return null;
                      return (
                        <th
                          key={idx}
                          className="border p-2 font-semibold cursor-pointer"
                          onClick={() => requestSort(keys[idx] as keyof Item)}
                        >
                          <div className="flex justify-around text-center w-full">
                            {col} <Filter size={16} className="opacity-60" />
                          </div>
                        </th>
                      );
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => {
                  const index = data.findIndex((d) => d.id === item.id);
                  const isSelected = selectedRows.includes(index);
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`border-b hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                            isSelected ? "bg-gray-200 dark:bg-gray-800" : ""
                          }`}
                        >
                          <td className="border p-2 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                setSelectedRows((prev) =>
                                  prev.includes(index)
                                    ? prev.filter((i) => i !== index)
                                    : [...prev, index]
                                )
                              }
                            />
                          </td>
                          {visibleColumns.includes("id") && (
                            <td className="border p-2 text-center">
                              {index + 1}
                            </td>
                          )}
                          {visibleColumns.includes("name") && (
                            <td className="border p-2">
                              <input
                                className="bg-transparent w-full outline-none"
                                value={item.name}
                                onChange={(e) =>
                                  handleCellEdit(index, "name", e.target.value)
                                }
                              />
                            </td>
                          )}
                          {visibleColumns.includes("order") && (
                            <td className="border p-2 text-center">
                              {item.order}
                            </td>
                          )}
                          {visibleColumns.includes("progress") && (
                            <td className="border p-2 text-center">
                              {item.progress}
                            </td>
                          )}
                          {visibleColumns.includes("price") && (
                            <td className="border p-2 text-right">
                              <input
                                type="number"
                                className="bg-transparent w-full text-right outline-none"
                                value={item.price}
                                onChange={(e) =>
                                  handleCellEdit(index, "price", e.target.value)
                                }
                              />
                            </td>
                          )}
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[#0A3A66] text-white"
                  : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
