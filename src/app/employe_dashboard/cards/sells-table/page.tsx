"use client";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Moon, Sun } from "lucide-react";

interface TableProps {
  title: string;
  tableStyle: string;
  rowStyle: string;
  selectedRowStyle: string;
  items: ItemType[];
  selectedRowIndex: number | null;
  onRowClick: (index: number) => void;
  onPrint: () => void;
  onExportCSV: () => void;
  onEdit: (
    index: number,
    field: keyof ItemType,
    value: string | number
  ) => void;
  droppableId: string;
}

interface ItemType {
  name: string;
  price: string;
  sold: number;
  category: string;
  stock: number;
}

const SellsTable = () => {
  const [items, setItems] = useState<ItemType[]>([
    {
      name: "Blue T-shirt",
      price: "$100",
      sold: 300,
      category: "Clothing",
      stock: 50,
    },
    {
      name: "Red Hoodie",
      price: "$150",
      sold: 200,
      category: "Clothing",
      stock: 30,
    },
    {
      name: "Green Jacket",
      price: "$200",
      sold: 180,
      category: "Clothing",
      stock: 20,
    },
    {
      name: "Yellow Cap",
      price: "$40",
      sold: 120,
      category: "Accessories",
      stock: 100,
    },
    {
      name: "Black Shoes",
      price: "$250",
      sold: 90,
      category: "Footwear",
      stock: 10,
    },
    {
      name: "White Sneakers",
      price: "$300",
      sold: 150,
      category: "Footwear",
      stock: 25,
    },
    {
      name: "Leather Belt",
      price: "$50",
      sold: 80,
      category: "Accessories",
      stock: 60,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRowIndexes, setSelectedRowIndexes] = useState<{
    [key: string]: number | null;
  }>({
    default: null,
    striped: null,
    compact: null,
    hoverable: null,
  });

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (tableKey: string, index: number) => {
    setSelectedRowIndexes((prev) => ({
      ...prev,
      [tableKey]: prev[tableKey] === index ? null : index,
    }));
  };

  const handlePrint = (
    data: ItemType[],
    tableStyle: string,
    selectedRowIndex: number | null
  ) => {
    const printWindow = window.open("", "_blank");
    const selectedItem =
      selectedRowIndex !== null ? [data[selectedRowIndex]] : data;

    const tableHTML = `
      <html>
      <head>
        <title>Print</title>
        <style>
          table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          @media print {
            table { page-break-after: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
          ${tableStyle}
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Sold</th>
              <th>Category</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            ${selectedItem
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.sold}</td>
                <td>${item.category}</td>
                <td>${item.stock}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>`;

    if (printWindow) {
      printWindow.document.write(tableHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportCSV = (data: ItemType[], selectedRowIndex: number | null) => {
    const rows = [["Item", "Price", "Sold", "Category", "Stock"]];
    const selectedItem =
      selectedRowIndex !== null ? [data[selectedRowIndex]] : data;

    selectedItem.forEach((item) => {
      rows.push([
        item.name,
        item.price,
        item.sold.toString(),
        item.category,
        item.stock.toString(),
      ]);
    });

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "top_selling.csv");
  };

  const handleEdit = (
    index: number,
    field: keyof ItemType,
    value: string | number
  ) => {
    const newItems = [...items];

    if (field === "sold" || field === "stock") {
      newItems[index][field] = Number(value) as ItemType[typeof field];
    } else {
      newItems[index][field] = value as ItemType[typeof field];
    }

    setItems(newItems);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);
    setItems(updatedItems);
  };

  const Table = ({
    title,
    tableStyle,
    rowStyle,
    selectedRowStyle,
    items,
    selectedRowIndex,
    onRowClick,
    onPrint,
    onExportCSV,
    onEdit,
    droppableId,
  }: TableProps) => (
    <div className="mb-8 shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 px-4 pt-4">{title}</h2>
      <div className="overflow-x-auto px-4">
        <table
          className={`w-full table-auto ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          } ${tableStyle}`}
          style={{ width: "100%" }}
        >
          <thead>
            <tr
              className={`${
                darkMode ? "bg-gray-500" : "bg-gray-200"
              } text-left`}
            >
              <th className="px-4 py-2 ">Item</th>
              <th className="px-4 py-2 ">Price</th>
              <th className="px-4 py-2 ">Sold</th>
              <th className="px-4 py-2 ">Category</th>
              <th className="px-4 py-2 ">Stock</th>
            </tr>
          </thead>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={droppableId}>
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={`${droppableId}-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-pointer ${rowStyle} ${
                            index === selectedRowIndex ? selectedRowStyle : ""
                          }`}
                          onClick={() => onRowClick(index)}
                        >
                          {(
                            [
                              "name",
                              "price",
                              "sold",
                              "category",
                              "stock",
                            ] as (keyof ItemType)[]
                          ).map((field) => (
                            <td
                              key={field}
                              className={`px-4 py-2  ${
                                field === "stock" ? "" : ""
                              }`}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                onEdit(index, field, e.target.innerText)
                              }
                            >
                              {item[field]}
                            </td>
                          ))}
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </table>
      </div>
      <div className="flex gap-2 mt-4 px-4 pb-4">
        <button
          onClick={onPrint}
          className="bg-[#0A3A66] text-white px-4 py-2 rounded-md"
        >
          Print {selectedRowIndex !== null ? "Selected" : "All"}
        </button>
        <button
          onClick={onExportCSV}
          className="bg-[#0A3A66] text-white px-4 py-2 rounded-md"
        >
          Export {selectedRowIndex !== null ? "Selected" : "All"} CSV
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } p-4 min-h-[500px]`}
    >
      <div className="mb-4 flex justify-between items-center bg-[#0A3A66] px-4 text-white">
        <h1 className="text-2xl font-bold py-4">Tables Styles</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 shadow-md py-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
          <button
            className="text-sm px-4 py-2 rounded-md border-[1px] border-gray-300 shadow-md flex items-center gap-2 transition-transform duration-150 active:scale-95"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <Table
          title="Default Table"
          tableStyle={`${
            darkMode ? "border-gray-700" : "border-gray-300"
          } border`}
          rowStyle=""
          selectedRowStyle={`${
            darkMode ? "bg-[#00A9B4]/30" : "bg-[#00A9B4]/20"
          }`}
          items={filteredItems}
          selectedRowIndex={selectedRowIndexes.default}
          onRowClick={(index) => handleRowClick("default", index)}
          onPrint={() =>
            handlePrint(filteredItems, "", selectedRowIndexes.default)
          }
          onExportCSV={() =>
            exportCSV(filteredItems, selectedRowIndexes.default)
          }
          onEdit={handleEdit}
          droppableId="default"
        />
        <Table
          title="Striped Table"
          tableStyle=""
          rowStyle={`odd:${darkMode ? "bg-gray-800" : "bg-white"} even:${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
          selectedRowStyle={`${
            darkMode ? "bg-[#00A9B4]/20" : "bg-[#00A9B4]/10"
          }`}
          items={filteredItems}
          selectedRowIndex={selectedRowIndexes.striped}
          onRowClick={(index) => handleRowClick("striped", index)}
          onPrint={() =>
            handlePrint(filteredItems, "", selectedRowIndexes.striped)
          }
          onExportCSV={() =>
            exportCSV(filteredItems, selectedRowIndexes.striped)
          }
          onEdit={handleEdit}
          droppableId="striped"
        />
        <Table
          title="Compact Table"
          tableStyle="text-sm"
          rowStyle={`${darkMode ? "bg-[#007EA1]/10" : "bg-[#007EA1]/5"}`}
          selectedRowStyle={`${
            darkMode ? "bg-[#00B8C4]/20" : "bg-[#00B8C4]/10"
          }`}
          items={filteredItems}
          selectedRowIndex={selectedRowIndexes.compact}
          onRowClick={(index) => handleRowClick("compact", index)}
          onPrint={() =>
            handlePrint(filteredItems, "", selectedRowIndexes.compact)
          }
          onExportCSV={() =>
            exportCSV(filteredItems, selectedRowIndexes.compact)
          }
          onEdit={handleEdit}
          droppableId="compact"
        />
        <Table
          title="Hoverable Table"
          tableStyle=""
          rowStyle={`hover:${darkMode ? "bg-gray-600" : "bg-gray-200"}`}
          selectedRowStyle={`${
            darkMode ? "bg-[#0A3A66]/20" : "bg-[#0A3A66]/10"
          }`}
          items={filteredItems}
          selectedRowIndex={selectedRowIndexes.hoverable}
          onRowClick={(index) => handleRowClick("hoverable", index)}
          onPrint={() =>
            handlePrint(filteredItems, "", selectedRowIndexes.hoverable)
          }
          onExportCSV={() =>
            exportCSV(filteredItems, selectedRowIndexes.hoverable)
          }
          onEdit={handleEdit}
          droppableId="hoverable"
        />
      </div>
    </div>
  );
};

export default SellsTable;
