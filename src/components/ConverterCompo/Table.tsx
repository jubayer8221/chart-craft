"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useSelector, useDispatch } from "react-redux";
import { setDataToPrint, printData } from "@/redux/slices/printSlice";
import { setSearchTerm } from "@/redux/slices/convertDataSlice";
import { RootState } from "@/redux/store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Pagination from "@/components/ui/pagination";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

// Types
interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

interface DataState {
  filtered: ParsedRow[];
  searchTerm: string;
}

interface TableProps {
  data: ParsedRow[];
  showAll?: boolean;
  title?: string;
}

// Constants
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000];
const DEFAULT_PAGE_SIZE = 10;
const EMPTY_STATE_MESSAGE = "No data available";

// Main Table Component
const Table: React.FC<TableProps> = ({ data, showAll = false, title = "" }) => {
  const dispatch = useDispatch();
  const { filtered, searchTerm } = useSelector(
    (state: RootState) =>
      (state.data as DataState) || { filtered: [], searchTerm: "" }
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [headerNames, setHeaderNames] = useState<{ [key: string]: string }>(
    data.length > 0
      ? Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {})
      : {
          [Object.keys(data[0])[0]]: Object.keys(data[1])[1],
        }
  );

  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editableTitle, setEditableTitle] = useState<string>(title);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [tempHeaderValue, setTempHeaderValue] = useState<string>("");

  // Handlers
  const handleHeaderChange = useCallback(
    (accessorKey: string) => {
      const newValue = tempHeaderValue.trim();
      if (!newValue) {
        setTempHeaderValue(headerNames[accessorKey]);
        setEditingHeader(null);
        return;
      }

      if (
        Object.values(headerNames)
          .filter((name) => name !== headerNames[accessorKey])
          .includes(newValue)
      ) {
        setTempHeaderValue(headerNames[accessorKey]);
        setEditingHeader(null);
        return;
      }

      setHeaderNames((prev) => ({ ...prev, [accessorKey]: newValue }));
      setEditingHeader(null);
    },
    [headerNames, tempHeaderValue]
  );

  // Memoized Computations
  const isSingleTitle = useMemo(
    () => data.length === 1 && Object.keys(data[1]).length === 1,
    [data]
  );

  const columns = useMemo<ColumnDef<ParsedRow>[]>(() => {
    if (data.length === 0 || isSingleTitle) {
      return [
        {
          header: "#",
          cell: ({ row }) => row.index + 0,
          enableSorting: false,
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
              value={tempHeaderValue}
              onChange={(e) => setTempHeaderValue(e.target.value)}
              onBlur={() => handleHeaderChange(key)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleHeaderChange(key);
                if (e.key === "Escape") {
                  setTempHeaderValue(headerNames[key]);
                  setEditingHeader(null);
                }
              }}
              className="w-full bg-transparent border-b border-gray-200 text-white py-1"
            />
          ) : (
            <span
              onDoubleClick={() => {
                setEditingHeader(key);
                setTempHeaderValue(headerNames[key]);
              }}
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
        header: "No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      ...dynamicCols,
    ];
  }, [
    data,
    headerNames,
    editingHeader,
    sorting,
    tempHeaderValue,
    handleHeaderChange,
    isSingleTitle,
  ]);

  // Table Setup
  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  });

  // Derived Table State
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  // Handlers
  const scrollToTop = useCallback(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = Number(e.target.value);
      table.setPageSize(newSize);
      table.setPageIndex(0);
      scrollToTop();
    },
    [table, scrollToTop]
  );

  const handlePrint = useCallback(() => {
    dispatch(setDataToPrint(filtered));
    dispatch(printData());
  }, [dispatch, filtered]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    },
    [dispatch]
  );

  // // Log Header and Table Data
  // const handleLogData = useCallback(() => {
  //   console.groupCollapsed("Table Data Inspection");

  //   // Log basic table info
  //   console.log("ℹ️ Table Info:", {
  //     Title: editableTitle,
  //     "Total Rows": totalRows,
  //     "Current Page": currentPage,
  //     "Page Size": pageSize,
  //     "Visible Rows": table.getRowModel().rows.length,
  //     "Search Term": searchTerm || "(none)",
  //     "Sorting State": sorting.length ? sorting : "(none)",
  //   });

  //   // Log header mappings
  //   console.log("🔤 Header Mappings:", {
  //     "#": "Index",
  //     ...headerNames,
  //   });

  //   // Log the actual data in table format
  //   if (table.getRowModel().rows.length === 0) {
  //     console.log("🚫 No data rows available to display");
  //   } else {
  //     console.log("📋 Table Data:");
  //     console.table(
  //       table.getRowModel().rows.map((row) => ({
  //         index: row.index + 1,
  //         ...Object.fromEntries(
  //           row
  //             .getVisibleCells()
  //             .slice(1) // Skip the index column
  //             .map((cell) => [
  //               headerNames[cell.column.id] || cell.column.id,
  //               cell.getValue(),
  //             ])
  //         ),
  //       }))
  //     );
  //   }

  //   // Log the raw filtered data
  //   console.log("Raw Filtered Data:", filtered);

  //   console.groupEnd();
  // }, [
  //   headerNames,
  //   table,
  //   filtered,
  //   editableTitle,
  //   totalRows,
  //   currentPage,
  //   pageSize,
  //   searchTerm,
  //   sorting,
  // ]);

  // Single Title Render
  if (isSingleTitle && data.length === 1) {
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
  // else if (isSingleTitle && data.length > 1) {
  //   return [
  //     table.getRowModel().rows.map((row) => (
  //       <tr
  //         key={row.id}
  //         className="hover:bg-gray-100 dark:hover:bg-[#685e74] text-center"
  //       >
  //         {row.getVisibleCells().map((cell) => (
  //           <td key={cell.id} className="p-2 border">
  //             {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //           </td>
  //         ))}
  //       </tr>
  //     )),
  //   ];
  // }

  // Main Table Render
  return (
    <div ref={tableContainerRef} className="w-full">
      <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-white mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1 text-sm focus:outline-none bg-white dark:bg-[#312c4a] dark:text-white"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
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
            aria-label="Search table data"
          />
          <Button onClick={handlePrint} aria-label="Print table">
            Print
          </Button>
          {/* <Button onClick={handleLogData} aria-label="Log table data">
            Log Data
          </Button> */}
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
                className=" relative bg-transparent py-1"
                aria-label="Edit table title"
              />
            ) : (
              <div
                onDoubleClick={() => setIsEditingTitle(true)}
                className="cursor-pointer"
                role="button"
                aria-label="Edit table title"
                tabIndex={0}
                onFocus={() => setIsEditingTitle(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsEditingTitle(true);
                  }
                }}
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
                  className="text-center text-gray-500 p-4"
                >
                  {EMPTY_STATE_MESSAGE}
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
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </div>
  );
};

export default Table;
