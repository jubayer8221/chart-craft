"use client";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import Image from "next/image";

const SellsTable = () => {
  const [items] = useState([
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

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const exportCSV = () => {
    const rows = [["Item", "Price", "Sold", "Category", "Stock"]];
    const data =
      selectedRowIndex !== null
        ? [filteredItems[selectedRowIndex]]
        : filteredItems;

    data.forEach((item) => {
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

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-600 min-h-[500px]">
      <div className="">
        <h1 className="text-2xl font-bold py-4">Top Selling Report</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          {/* search  */}
          {/* <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/2"
          /> */}

          <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-md ring-[1.5px] ring-gray-300 dark:border-[#897c8f] px-2">
            <Image src="/assets/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-[200px] p-2 bg-transparent outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#0A3A66] hover:bg-[#0A3A66]/80 text-white px-4 mb-4 py-2 rounded-md"
            >
              Print {selectedRowIndex !== null ? "Selected" : "All"}
            </button>
            <button
              onClick={exportCSV}
              className="bg-[#0A3A66] hover:bg-[#0A3A66]/80 text-white px-4 py-2 rounded-md mb-4"
            >
              Export {selectedRowIndex !== null ? "Selected" : "All"} CSV
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:bg-gray-700 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th className="px-4 py-2 border dark:border-gray-500">Item</th>
              <th className="px-4 py-2 border dark:border-gray-500">Price</th>
              <th className="px-4 py-2 border dark:border-gray-500">Sold</th>
              <th className="px-4 py-2 border dark:border-gray-500">
                Category
              </th>
              <th className="px-4 py-2 border dark:border-gray-500">Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr
                key={index}
                className={`cursor-pointer ${
                  index === selectedRowIndex ? "bg-blue-100" : ""
                }`}
                onClick={() => handleRowClick(index)}
              >
                <td className="px-4 py-2 border dark:border-gray-500">
                  {item.name}
                </td>
                <td className="px-4 py-2 border dark:border-gray-500">
                  {item.price}
                </td>
                <td className="px-4 py-2 border dark:border-gray-500">
                  {item.sold}
                </td>
                <td className="px-4 py-2 border dark:border-gray-500">
                  {item.category}
                </td>
                <td className="px-4 py-2 border dark:border-gray-500">
                  {item.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellsTable;
