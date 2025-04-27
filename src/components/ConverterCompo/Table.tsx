"use client";
import React, { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { setDataToPrint, printData } from "@/redux/slices/printSlice";
import { ParsedRow } from "@/types/convertType";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSearchTerm } from "@/redux/slices/convertDataSlice";

export function Table({ data }: { data: ParsedRow[] }) {
  const dispatch = useDispatch();
  const { filtered, searchTerm } = useSelector(
    (state: RootState) => state.data
  );
  const handlePrint = () => {
    dispatch(setDataToPrint(data)); // full data, not filtered
    dispatch(printData());
  };

  // Update search term on input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Add row index and dynamic columns
  const columns = useMemo<
    ColumnDef<ParsedRow & { __rowNum?: number }>[]
  >(() => {
    const dynamicCols = Object.keys(data[0] || {}).map((key) => ({
      header: key,
      accessorKey: key,
    }));

    return [
      {
        header: "#",
        cell: ({ row }) => row.index + 1,
      },
      ...dynamicCols,
    ];
  }, [data]);

  const table = useReactTable({
    data: filtered, // use filtered data for searching
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="text-sm font-semibold text-gray-700 mt-4 flex justify-between items-center">
        <span>Total Rows: {filtered.length}</span>
        <Input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/2"
        />
        <Button className="p-4" onClick={handlePrint}>
          Print
        </Button>
      </div>

      <table className="w-full border border-gray-300 shadow-lg my-4 py-2">
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-200 text-center">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
