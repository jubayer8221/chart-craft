"use client";
import React, { useMemo, useRef } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { setDataToPrint, printData } from "@/redux/slices/printSlice";
import { ParsedRow } from "@/types/convertType";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSearchTerm } from "@/redux/slices/convertDataSlice";
import Pagination from "@/components/ui/pagination";

interface DataState {
  filtered: ParsedRow[];
  searchTerm: string;
}

interface TableProps {
  data: ParsedRow[];
  showAll?: boolean;
  title?: string;
}

export function Table({ data, showAll = false, title }: TableProps) {
  const dispatch = useDispatch();
  const { filtered, searchTerm } = useSelector(
    (state: RootState) =>
      (state.data as DataState) || { filtered: [], searchTerm: "" }
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    dispatch(setDataToPrint(filtered));
    dispatch(printData());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const columns = useMemo<ColumnDef<ParsedRow>[]>(() => {
    if (data.length === 0) {
      return [
        {
          header: "#",
          cell: ({ row }) => row.index + 1,
        },
      ];
    }

    const dynamicCols = Object.keys(data[0]).map((key) => ({
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
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div ref={tableContainerRef} className="w-full">
      <div className="text-sm font-semibold text-gray-700 mt-4 flex dark:text-white justify-between items-center">
        <span>Total Rows: {filtered.length}</span>
        <Input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/2 max-w-xs dark:bg-[#312c4a] dark:text-white dark:border-gray-300"
        />
        <Button onClick={handlePrint}>Print</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-lg my-4">
          {/* Add table caption/header here */}
          {title && (
            <caption className="caption-top bg-[#0A3A66] text-white p-4 text-lg font-bold border-b">
              {title}
            </caption>
          )}
          <thead className="bg-[#0A3A66]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 border bg-[#0A3A66]/10 text-white text-left"
                    scope="col"
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-100 dark:hover:bg-[#685e74] text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination<ParsedRow>
        table={table}
        showAll={showAll}
        tableRef={tableContainerRef}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}

export default Table;
