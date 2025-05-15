"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useSelector, useDispatch } from "react-redux";
import { setDataToPrint, printData } from "@/redux/slices/printSlice";
import {
  setSearchTerm,
  setHeaderName,
  initializeHeaderNames,
  setTableTitle,
} from "@/redux/slices/convertDataSlice";
import type { RootState } from "@/redux/store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { ParsedRow } from "@/types/convertType";

interface DataState {
  filtered: ParsedRow[];
  searchTerm: string;
  headerNames: Record<string, string>;
  tableTitle: string;
}

interface TableProps {
  data: ParsedRow[];
  title?: string;
}

const DEFAULT_PAGE_SIZE = 10;
const EMPTY_STATE_MESSAGE = "No data available";
const LOAD_CHUNK_SIZE = 1000;

const generatePageSizeOptions = (
  totalRows: number
): (number | { value: number; label: string })[] => {
  const baseOptions = [10, 20, 50, 100, 200, 500, 1000];
  if (totalRows > 1000) {
    baseOptions.push(2000, 5000, 10000);
  }
  const filteredOptions = baseOptions.filter((size) => size <= totalRows);
  const options: (number | { value: number; label: string })[] =
    filteredOptions;
  if (totalRows > 0 && totalRows <= 10000) {
    options.push({ value: totalRows, label: "All" });
  }
  return options.sort(
    (a, b) =>
      (typeof a === "number" ? a : a.value) -
      (typeof b === "number" ? b : b.value)
  );
};

const Table: React.FC<TableProps> = ({ data, title = "Table" }) => {
  const dispatch = useDispatch();
  const { filtered, searchTerm, headerNames, tableTitle } = useSelector(
    (state: RootState) => state.data as DataState
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [tempHeaderValue, setTempHeaderValue] = useState<string>("");
  const [editingCaption, setEditingCaption] = useState<boolean>(false);
  const [tempCaptionValue, setTempCaptionValue] = useState<string>(tableTitle);
  const [loadedData, setLoadedData] = useState<ParsedRow[]>(
    filtered.slice(0, LOAD_CHUNK_SIZE)
  );

  // Initialize headerNames and tableTitle
  useEffect(() => {
    if (data.length > 0 && Object.keys(data[0]).length > 0) {
      const initialHeaderNames = Object.keys(data[0]).reduce(
        (acc, key) => ({ ...acc, [key]: key }),
        {}
      );
      dispatch(initializeHeaderNames(initialHeaderNames));
      console.log("Initialized headerNames:", initialHeaderNames);
    }
    dispatch(setTableTitle(title));
    setTempCaptionValue(title);
    console.log("Initialized tableTitle:", title);
  }, [data, dispatch, title]);

  // Sync loadedData with filtered data and implement lazy loading
  useEffect(() => {
    // Reset loadedData when filtered data changes (e.g., due to search)
    setLoadedData(filtered.slice(0, LOAD_CHUNK_SIZE));
  }, [filtered]);

  // Load more data when needed
  const loadMoreData = useCallback(() => {
    const currentLoadedCount = loadedData.length;
    if (currentLoadedCount < filtered.length) {
      const nextChunk = filtered.slice(
        currentLoadedCount,
        currentLoadedCount + LOAD_CHUNK_SIZE
      );
      setLoadedData((prev) => [...prev, ...nextChunk]);
      console.log(
        `Loaded ${nextChunk.length} more rows, total loaded: ${
          currentLoadedCount + nextChunk.length
        }`
      );
    }
  }, [filtered, loadedData]);

  // Handle header editing
  const handleHeaderEdit = useCallback(
    (key: string) => {
      setEditingHeader(key);
      setTempHeaderValue(headerNames[key] || key);
      console.log(`Started editing header: ${key}`);
    },
    [headerNames]
  );

  const handleHeaderChange = useCallback(
    (key: string) => {
      const newValue = tempHeaderValue.trim();
      if (newValue && !Object.values(headerNames).includes(newValue)) {
        dispatch(setHeaderName({ key, name: newValue }));
        console.log(`Header updated: ${key} -> ${newValue}`);
      } else {
        console.log(
          `Header update skipped: ${newValue} is invalid or duplicate`
        );
      }
      setEditingHeader(null);
      setTempHeaderValue("");
    },
    [dispatch, headerNames, tempHeaderValue]
  );

  // Handle caption editing
  const handleCaptionEdit = useCallback(() => {
    setEditingCaption(true);
    console.log("Started editing caption");
  }, []);

  const handleCaptionChange = useCallback(() => {
    const newValue = tempCaptionValue.trim();
    if (newValue) {
      dispatch(setTableTitle(newValue));
      console.log(`Caption updated: ${newValue}`);
    } else {
      setTempCaptionValue(tableTitle);
      console.log("Caption update skipped: empty value");
    }
    setEditingCaption(false);
  }, [dispatch, tempCaptionValue, tableTitle]);

  const isSingleTitle = useMemo(
    () => data.length === 1 && Object.keys(data[0]).length === 1,
    [data]
  );

  const columns = useMemo<ColumnDef<ParsedRow>[]>(() => {
    if (data.length === 0 || isSingleTitle) {
      return [
        {
          header: "#",
          cell: ({ row }) => row.index + 1,
          enableSorting: false,
        },
      ];
    }

    const dynamicCols = Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      enableSorting: true,
      header: () => (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleHeaderEdit(key);
          }}
          className="cursor-text hover:bg-blue-500/10 px-2 py-1 rounded inline-block w-full"
        >
          {editingHeader === key ? (
            <Input
              value={tempHeaderValue}
              onChange={(e) => setTempHeaderValue(e.target.value)}
              onBlur={() => handleHeaderChange(key)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleHeaderChange(key);
                if (e.key === "Escape") {
                  setTempHeaderValue(headerNames[key] || key);
                  setEditingHeader(null);
                }
              }}
              className="w-full bg-transparent text-sm font-semibold dark:text-white border-none focus:border-b focus:border-white/50 focus:ring-0 px-2 py-1 transition-colors duration-200"
              aria-label={`Edit header for ${key}`}
              autoFocus
            />
          ) : (
            headerNames[key] || key
          )}
        </span>
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
    tempHeaderValue,
    handleHeaderEdit,
    handleHeaderChange,
    isSingleTitle,
  ]);

  const table = useReactTable({
    data: loadedData,
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

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = filtered.length;

  const pageSizeOptions = useMemo(
    () => generatePageSizeOptions(totalRows),
    [totalRows]
  );

  // Check if more data needs to be loaded based on pagination
  useEffect(() => {
    const lastVisibleRowIndex = currentPage * pageSize;
    if (
      lastVisibleRowIndex > loadedData.length &&
      loadedData.length < filtered.length
    ) {
      loadMoreData();
    }
  }, [currentPage, pageSize, loadedData, filtered, loadMoreData]);

  const scrollToTop = useCallback(() => {
    tableContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
    dispatch(setDataToPrint(loadedData));
    dispatch(printData());
  }, [dispatch, loadedData]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(e.target.value));
    },
    [dispatch]
  );

  if (isSingleTitle && data.length === 1) {
    const singleKey = Object.keys(data[0])[0];
    const singleValue = data[0][singleKey];
    return (
      <div ref={tableContainerRef} className="w-full max-w-full mx-auto">
        <table className="w-full border border-gray-300 shadow-lg my-4">
          {tableTitle && (
            <caption className="caption-top bg-blue-800 text-white p-4 text-lg font-bold">
              {editingCaption ? (
                <Input
                  value={tempCaptionValue}
                  onChange={(e) => setTempCaptionValue(e.target.value)}
                  onBlur={handleCaptionChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCaptionChange();
                    if (e.key === "Escape") {
                      setTempCaptionValue(tableTitle);
                      setEditingCaption(false);
                    }
                  }}
                  className="w-full bg-transparent text-white text-lg font-bold border-none focus:border-b focus:border-white/50 focus:ring-0 px-2 py-1 transition-colors duration-200"
                  aria-label="Edit table caption"
                  autoFocus
                />
              ) : (
                <span onDoubleClick={handleCaptionEdit} className="cursor-text">
                  {tableTitle}
                </span>
              )}
            </caption>
          )}
          <caption className="caption-top bg-blue-800/10 text-gray-800 dark:text-white p-4 text-base font-semibold">
            {singleValue}
          </caption>
        </table>
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className="w-full max-w-full mx-auto overflow-x-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm font-semibold text-gray-700 dark:text-white mt-4 gap-4">
        {/* <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
          {totalRows >
            (typeof pageSizeOptions[0] === "number"
              ? pageSizeOptions[0]
              : pageSizeOptions[0].value) && (
            <>
              <span>Rows per page:</span>
              <div className="relative group">
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
                  aria-label="Rows per page"
                >
                  {pageSizeOptions.map((size) => (
                    <option
                      key={typeof size === "number" ? size : size.value}
                      value={typeof size === "number" ? size : size.value}
                    >
                      {typeof size === "number" ? size : size.label}
                    </option>
                  ))}
                </select>
              </div>
              <span>
                {table.getRowModel().rows.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                -
                {(currentPage - 1) * pageSize + table.getRowModel().rows.length}{" "}
                of {totalRows}
              </span>
            </>
          )}
        </div> */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
          {totalRows <= 10 && <span>Rows per page: {totalRows} </span>}
          {totalRows >= 10 && <span>Rows per page: </span>}
          {totalRows >
            (typeof pageSizeOptions[0] === "number"
              ? pageSizeOptions[0]
              : pageSizeOptions[0].value) && (
            <>
              <div className="relative group">
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
                  aria-label="Rows per page"
                >
                  {pageSizeOptions.map((size) => (
                    <option
                      key={typeof size === "number" ? size : size.value}
                      value={typeof size === "number" ? size : size.value}
                    >
                      {typeof size === "number" ? size : size.label}
                    </option>
                  ))}
                </select>
              </div>
              <span>
                {table.getRowModel().rows.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                -
                {(currentPage - 1) * pageSize + table.getRowModel().rows.length}
              </span>
              <span> of {totalRows}</span>
            </>
          )}
        </div>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-xs dark:bg-gray-800 dark:text-white"
            aria-label="Search table data"
          />
          <Button onClick={handlePrint} aria-label="Print table">
            Print
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto min-w-[280px] lg:w-[1220px] overflow-y-auto">
        <table className="w-full border border-gray-300 shadow-lg my-4">
          <caption className="caption-top bg-blue-900/80 capitalize text-white p-2 text-lg font-bold border-b">
            {editingCaption ? (
              <Input
                value={tempCaptionValue}
                onChange={(e) => setTempCaptionValue(e.target.value)}
                onBlur={handleCaptionChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCaptionChange();
                  if (e.key === "Escape") {
                    setTempCaptionValue(tableTitle);
                    setEditingCaption(false);
                  }
                }}
                className="w-full bg-transparent text-white text-lg font-bold border-2 border-dashed"
                aria-label="Edit table caption"
                autoFocus
              />
            ) : (
              <span onDoubleClick={handleCaptionEdit} className="cursor-text">
                {tableTitle}
              </span>
            )}
          </caption>
          <thead className="bg-blue-900/70 sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="relative p-1 border-b border-gray-200 bg-blue-900/20 text-white text-center font-semibold text-sm tracking-wide cursor-pointer"
                    role="columnheader"
                    aria-sort={
                      sorting.find((s) => s.id === header.column.id)
                        ? sorting.find((s) => s.id === header.column.id)?.desc
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                    onClick={() => {
                      if (!editingHeader) {
                        const id = header.column.id;
                        const existing = sorting.find((s) => s.id === id);
                        if (!existing) setSorting([{ id, desc: false }]);
                        else if (!existing.desc)
                          setSorting([{ id, desc: true }]);
                        else setSorting([]);
                      }
                    }}
                    onDoubleClick={() => {
                      if (!editingHeader) handleHeaderEdit(header.column.id);
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="w-3 h-3 inline-flex">
                        {sorting.find((s) => s.id === header.column.id) ? (
                          sorting.find((s) => s.id === header.column.id)
                            ?.desc ? (
                            <span>🔽</span>
                          ) : (
                            <span>🔼</span>
                          )
                        ) : (
                          <span className="opacity-0">🔼</span>
                        )}
                      </span>
                    </div>
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
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
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => {
            table.previousPage();
            scrollToTop();
          }}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          Page {currentPage} of {table.getPageCount()}
        </span>
        <Button
          onClick={() => {
            table.nextPage();
            scrollToTop();
          }}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Table;
