"use client";

import React from "react";

export function Table<T>({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: T) => React.ReactNode;
  data: T[];
}) {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-100 text-sm mb-4">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
