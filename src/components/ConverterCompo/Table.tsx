"use client";
import React, { useMemo, useRef, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { setDataToPrint, printData } from "@/redux/slices/printSlice";
import { ParsedRow } from "@/types/convertType";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSearchTerm } from "@/redux/slices/convertDataSlice";
import Pagination from "@/components/ui/pagination";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

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

  const [headerNames, setHeaderNames] = useState<{ [key: string]: string }>(
    data.length > 0
      ? Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {})
      : {}
  );
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editableTitle, setEditableTitle] = useState<string>(title || "");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const pageSizeOptions = [10, 20, 50, 100, 200, 500, 1000];
  const showPageSizeOptions = true;

  const handleHeaderChange = (accessorKey: string, newValue: string) => {
    if (!newValue.trim()) return;
    if (
      Object.values(headerNames)
        .filter((name) => name !== headerNames[accessorKey])
        .includes(newValue)
    )
      return;

    setHeaderNames((prev) => ({ ...prev, [accessorKey]: newValue }));
    setEditingHeader(null);
  };

  const isSingleTitle = data.length === 1 && Object.keys(data[0]).length === 1;

  const columns = useMemo<ColumnDef<ParsedRow>[]>(() => {
    if (data.length === 0 || isSingleTitle) {
      return [
        {
          header: "#",
          cell: ({ row }) => row.index + 1,
        },
      ];
    }

    const dynamicCols = Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      enableSorting: true,
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => {
            setSorting((old) => {
              const existing = old.find((s) => s.id === key);
              if (!existing) return [{ id: key, desc: false }];
              if (!existing.desc) return [{ id: key, desc: true }];
              return [];
            });
          }}
        >
          {editingHeader === key ? (
            <Input
              value={headerNames[key]}
              onChange={(e) =>
                setHeaderNames((prev) => ({
                  ...prev,
                  [key]: e.target.value || key,
                }))
              }
              onBlur={(e) => handleHeaderChange(key, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  handleHeaderChange(key, e.currentTarget.value);
                if (e.key === "Escape") setEditingHeader(null);
              }}
              autoFocus
              className="w-full bg-transparent border-b border-gray-200 text-white py-1"
            />
          ) : (
            <span
              onClick={() => setEditingHeader(key)}
              className="hover:bg-[#0A3A66]/20 px-2 py-1 rounded transition-colors"
            >
              {headerNames[key]}
            </span>
          )}
          {sorting.find((s) => s.id === key)?.desc ? (
            <AiOutlineArrowDown />
          ) : sorting.find((s) => s.id === key) ? (
            <AiOutlineArrowUp />
          ) : null}
        </div>
      ),
    }));

    return [
      {
        header: "#",
        cell: ({ row }) => row.index + 1,
      },
      ...dynamicCols,
    ];
  }, [data, headerNames, editingHeader, sorting]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const scrollToTop = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    table.setPageSize(newSize);
    table.setPageIndex(0);
    scrollToTop();
  };

  const handlePrint = () => {
    dispatch(setDataToPrint(filtered));
    dispatch(printData());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  if (isSingleTitle) {
    const singleKey = Object.keys(data[0])[0];
    const singleValue = data[0][singleKey];
    return (
      <div ref={tableContainerRef} className="w-full">
        <table className="w-full border border-gray-300 shadow-lg my-4">
          {title && (
            <caption className="caption-top bg-[#0A3A66] text-white p-4 text-lg font-bold">
              {title}
            </caption>
          )}
          <caption className="caption-top bg-[#0A3A66]/10 text-white p-4 text-base font-semibold">
            {singleValue}
          </caption>
        </table>
      </div>
    );
  }

  return (
    <div ref={tableContainerRef} className="w-full">
      <div className="text-sm font-semibold text-gray-700 mt-4 flex dark:text-white justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
          {showPageSizeOptions && (
            <>
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border rounded px-2 py-1 text-sm focus:outline-none"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </>
          )}
          <span>
            {table.getRowModel().rows.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            -{(currentPage - 1) * pageSize + table.getRowModel().rows.length} of{" "}
            {totalRows}
          </span>
        </div>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-xs dark:bg-[#312c4a] dark:text-white"
          />
          <Button onClick={handlePrint}>Print</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-lg my-4">
          <caption className="caption-top bg-[#0A3A66] text-white p-4 text-lg font-bold border-b">
            {isEditingTitle ? (
              <Input
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="w-full bg-transparent border-b border-white text-white py-1"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer"
              >
                {editableTitle || "Untitled Table"}
              </div>
            )}
          </caption>
          <thead className="bg-[#0A3A66]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 border bg-[#0A3A66]/10 text-white text-left"
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
                  colSpan={table.getAllColumns().length}
                  className="text-center text-gray-500"
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
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}

export default Table;
