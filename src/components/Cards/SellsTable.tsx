"use client";
import React, { useState } from "react";
import { saveAs } from "file-saver";

const SellsTable = () => {
  const [items] = useState([
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
    { name: "Green Jacket", price: "$200", sold: 180 },
    { name: "Yellow Cap", price: "$40", sold: 120 },
    { name: "Black Shoes", price: "$250", sold: 90 },
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
  ]);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [searchTerm] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const selectedItem =
      selectedRowIndex !== null
        ? [filteredItems[selectedRowIndex]]
        : filteredItems;

    const tableHTML = `
      <html>
      <head><title>Print</title></head>
      <body>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Sold</th>
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

  const exportCSV = () => {
    const rows = [["Item", "Price", "Sold"]];
    const data =
      selectedRowIndex !== null
        ? [filteredItems[selectedRowIndex]]
        : filteredItems;

    data.forEach((item) => {
      rows.push([item.name, item.price, item.sold.toString()]);
    });

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "top_selling.csv");
  };

  return (
    <div className="w-full max-w-full md:max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
        <h1 className="text-lg font-semibold">Sells</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="border border-gray-300 hover:bg-[#0A3A66] text-black hover:text-white px-4 py-1 rounded-md text-sm font-semibold"
          >
            Print {selectedRowIndex !== null ? "" : ""}
          </button>
          <button
            onClick={exportCSV}
            className="border border-gray-300 hover:bg-[#0A3A66] text-black hover:text-white px-2 py-1 rounded-md text-sm font-semibold"
          >
            Export {selectedRowIndex !== null ? "" : ""} CSV
          </button>
        </div>
      </div>

      {/* <input
        type="text"
        placeholder="Search by item name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/2"
      /> */}

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Item</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Sold</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr
                key={index}
                className={`cursor-pointer hover:bg-gray-200 ${
                  index === selectedRowIndex ? "bg-blue-200" : ""
                }`}
                onClick={() => handleRowClick(index)}
              >
                <td className="px-4 py-1 border">{item.name}</td>
                <td className="px-4 py-1 border">{item.price}</td>
                <td className="px-4 py-1 border">{item.sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellsTable;
