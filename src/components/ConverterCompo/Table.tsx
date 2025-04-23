"use client";
import React, { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { ParsedRow } from "@/types/convertType";

export function Table({ data }: { data: ParsedRow[] }) {
  const columns = useMemo<ColumnDef<ParsedRow>[]>(
    () =>
      Object.keys(data[0] || {}).map((key) => ({
        header: key,
        accessorKey: key,
      })),
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border border-gray-300 shadow-lg my-6 py-2">
      <thead className="bg-[#0A3A66]">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="p-2 border bg-[#0A3A66]/10 text-white"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-200 text-center">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2 border ">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
