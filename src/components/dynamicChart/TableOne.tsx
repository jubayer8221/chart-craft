"use client";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { CSVLink } from "react-csv";
import { FaPrint } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import ChartRenderer from "./ChartRenderer";

type RowData = {
  [key: string]: string;
};

// Define ChartType to match ChartRenderer's expected types
type ChartType = "Bar" | "Line" | "Pie" | "Doughnut" | "Radar";

export default function TableOne() {
  const [columns, setColumns] = useState<string[]>(["Name", "Age"]);
  const [data, setData] = useState<RowData[]>([{ Name: "Alice", Age: "23" }]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);

  const chartTypes: ChartType[] = ["Bar", "Line", "Pie", "Doughnut", "Radar"];

  const sortedData = [...data];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  const addRow = () => {
    const newRow: RowData = {};
    columns.forEach((col) => (newRow[col] = ""));
    setData([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleEdit = (rowIdx: number, colName: string, value: string) => {
    const newData = [...data];
    newData[rowIdx][colName] = value;
    setData(newData);
  };

  const addColumn = () => {
    const newCol = prompt("Enter new column name:");
    if (newCol && !columns.includes(newCol)) {
      setColumns([...columns, newCol]);
      setData(data.map((row) => ({ ...row, [newCol]: "" })));
    }
  };

  const deleteColumn = (colToDelete: string) => {
    setColumns(columns.filter((col) => col !== colToDelete));
    setData(
      data.map((row) => {
        const newRow = { ...row };
        delete newRow[colToDelete];
        return newRow;
      })
    );
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const printTable = () => {
    const printContent = document.getElementById("printable-table");
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow && printContent) {
      printWindow.document.write("<html><head><title>Print</title></head><body>");
      printWindow.document.write(printContent.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Convert table data to Chart.js format
  const getChartData = () => {
    const labels = data.map((row) => row[columns[0]] || "Unknown");
    const datasetData = data.map((row) => {
      const value = row[columns[1]] || "0";
      return parseFloat(value) || 0;
    });

    return {
      labels,
      datasets: [
        {
          label: columns[1] || "Value",
          data: datasetData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Enhanced Table</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={addRow} className="bg-[#0A3A66] text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FiPlus className="text-[16px]" /> Add Row
        </button>
        <button onClick={addColumn} className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FiPlus className="text-[16px]" /> Add Column
        </button>
        <CSVLink data={data} filename="table-data.csv">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md">Export CSV</button>
        </CSVLink>
        <button onClick={printTable} className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FaPrint /> Print
        </button>
        <select
          value={selectedChart || ""}
          onChange={(e) => setSelectedChart((e.target.value as ChartType) || null)}
          className="border px-2 py-1 rounded-md"
        >
          <option value="">Select Chart Type</option>
          {chartTypes.map((type) => (
            <option key={type} value={type}>
              {type} Chart
            </option>
          ))}
        </select>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border px-2 py-1 rounded-md"
        >
          {[5, 10, 25].map((n) => (
            <option key={n} value={n}>
              Show {n}
            </option>
          ))}
        </select>
      </div>

      <div id="printable-table" className="overflow-x-auto rounded shadow">
        <table className="min-w-max w-full table-auto text-gray-700">
          <thead>
            <tr className="bg-[#0A3A66]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-3 text-left text-white cursor-pointer"
                  onClick={() => requestSort(col)}
                >
                  <div className="flex items-center gap-2">
                    {col} <BsChevronDown className="text-sm" />
                    <button onClick={() => deleteColumn(col)}>
                      <RxCross2 className="text-[16px]" />
                    </button>
                  </div>
                </th>
              ))}
              <th className="p-3 text-left font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, rowsPerPage).map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-[#F1F0FF]">
                {columns.map((col) => (
                  <td key={col} className="p-2">
                    <input
                      value={row[col] || ""}
                      onChange={(e) => handleEdit(rowIdx, col, e.target.value)}
                      className="w-full bg-transparent text-gray-700 outline-none"
                      placeholder={col}
                    />
                  </td>
                ))}
                <td className="p-2">
                  <button
                    onClick={() => deleteRow(rowIdx)}
                    className="w-8 h-8 flex items-center justify-center bg-[#0A3A66] text-white rounded-full"
                  >
                    <RiDeleteBin6Line className="text-[16px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedChart && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{selectedChart} Chart</h3>
          <ChartRenderer data={getChartData()} type={selectedChart} />
        </div>
      )}
    </div>
  );
}