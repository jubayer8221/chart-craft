"use client";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

type RowData = {
  [key: string]: string;
};

export default function TableOne() {
  const [columns, setColumns] = useState<string[]>(["Name", "Age"]);
  const [data, setData] = useState<RowData[]>([{ Name: "Alice", Age: "23" }]);

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

  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Simple Table</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={addRow}
          className="bg-[#0A3A66] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
        <FiPlus className="text-[16px]"/> Add Row
        </button>
        <button
          onClick={addColumn}
          className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
         <FiPlus className="text-[16px]"/> Add Column
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-max w-full table-auto text-gray-700">
          <thead>
            <tr className="bg-[#0A3A66]">
              {columns.map((col) => (
                <th key={col} className="p-3 text-left text-white">
                  <div className="flex items-center gap-2">
                  {col}
                  <button
                    onClick={() => deleteColumn(col)}
                    className=""
                  >
                    <RxCross2 className="text-[16px]"/>
                  </button>
                  </div>
                </th>
              ))}
              <th className="p-3 text-left font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
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
    </div>
  );
}
