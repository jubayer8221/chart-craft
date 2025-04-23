"use client";

import React from "react";

type TableProps = {
  title: string;
  description?: string;
  columns: string[];
  rows: string[][];
  striped?: boolean;
  compact?: boolean;
};

const Table: React.FC<TableProps> = ({
  title,
  description,
  columns,
  rows,
  striped = false,
  compact = false,
}) => {
  return (
    <div className="border rounded-md shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      <table
        className={`w-full border-collapse ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col, index) => (
              <th
                key={index}
                className="border px-4 py-2 text-left font-medium text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                striped && rowIndex % 2 === 1 ? "bg-gray-50" : undefined
              }
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
