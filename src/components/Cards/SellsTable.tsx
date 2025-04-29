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
    { name: "White Shirt", price: "$80", sold: 210 },
    { name: "Grey Sweater", price: "$130", sold: 170 },
    { name: "Blue Cap", price: "$40", sold: 120 },
    { name: "White Shoes", price: "$250", sold: 90 },
    { name: "Dark-Blue Shirt", price: "$80", sold: 210 },
    { name: "Nice Sweater", price: "$130", sold: 170 },
  ]);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const totalPages = Math.ceil(items.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const selectedItem =
      selectedRowIndex !== null
        ? [paginatedItems[selectedRowIndex]]
        : paginatedItems;

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
        ? [paginatedItems[selectedRowIndex]]
        : paginatedItems;

    data.forEach((item) => {
      rows.push([item.name, item.price, item.sold.toString()]);
    });

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "top_selling.csv");
  };

  const handlePrev = () => {
    setSelectedRowIndex(null);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setSelectedRowIndex(null);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="w-full max-w-full md:max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h1 className="text-lg font-semibold dark:text-white">Sells</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="sm:text-[12px] md:text-[12px] xl:text-[16px] border border-gray-300 dark:border-gray-600 hover:bg-[#0A3A66] text-black dark:text-white hover:text-white px-3 py-1 rounded-md text-sm font-semibold"
          >
            Print
          </button>
          <button
            onClick={exportCSV}
            className="border border-gray-300 sm:text-[12px] md:text-[12px] xl:text-[16px] dark:border-gray-600 dark:text-white hover:bg-[#0A3A66] text-black hover:text-white px-3 py-1 rounded-md text-sm font-semibold"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[360px]">
        <table className="w-full min-w-[280px] border border-gray-300 dark:rounded-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#0A3A66] text-left">
              <th className="px-4 py-2 border dark:border-gray-600">Item</th>
              <th className="px-4 py-2 border dark:border-gray-600">Price</th>
              <th className="px-4 py-2 border dark:border-gray-600">Sold</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => (
              <tr
                key={index}
                className={`cursor-pointer hover:bg-gray-300 ${
                  index === selectedRowIndex ? "bg-blue-200" : ""
                }`}
                onClick={() => handleRowClick(index)}
              >
                <td className="px-4 py-1 border dark:border-gray-600">
                  {item.name}
                </td>
                <td className="px-4 py-1 border dark:border-gray-600">
                  {item.price}
                </td>
                <td className="px-4 py-1 border dark:border-gray-600">
                  {item.sold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md dark:text-white disabled:opacity-50 hover:bg-[#0A3A66] hover:text-white"
        >
          Previous
        </button>
        <span className="dark:text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md dark:text-white disabled:opacity-50 hover:bg-[#0A3A66] hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SellsTable;
