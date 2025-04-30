import React, { useMemo } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";

interface PaginationProps<TData> {
  table: Table<TData>;
  showAll?: boolean;
  className?: string;
  pageSizeOptions?: number[];
  showPageSizeOptions?: boolean;
  tableRef?: React.RefObject<HTMLElement | null>;
}

const Pagination = <TData,>({
  table,
  showAll = false,
  className = "",
  // pageSizeOptions = [10, 20, 50],
  showPageSizeOptions = true,
  tableRef,
}: PaginationProps<TData>) => {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  // const pageSize = table.getState().pagination.pageSize;
  // const totalRows = table.getFilteredRowModel().rows.length;

  const scrollToTop = () => {
    if (tableRef?.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage: number, shouldScroll = true) => {
    if (newPage >= 0 && newPage < pageCount) {
      table.setPageIndex(newPage);
      if (shouldScroll) {
        scrollToTop();
      }
    }
  };

  // const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newSize = Number(e.target.value);
  //   table.setPageSize(newSize);
  //   table.setPageIndex(0);
  //   scrollToTop();
  // };

  const getPageRange = useMemo(() => {
    const range: number[] = [];

    // Add previous page if it exists
    if (currentPage > 1) {
      range.push(currentPage - 1);
    }

    // Add current page
    range.push(currentPage);

    // Add next page if it exists
    if (currentPage < pageCount) {
      range.push(currentPage + 1);
    }

    return range;
  }, [pageCount, currentPage]);

  if (pageCount <= 1 && !showPageSizeOptions) {
    return null;
  }

  const filtered = table.getFilteredRowModel().rows;
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
        {showPageSizeOptions && (
          <>
            <span>Total Rows: {filtered.length}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              Page No: {currentPage} out of {pageCount}
            </span>
            {/* <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Select page size"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select> */}
          </>
        )}
        {/* <span>
          {table.getRowModel().rows.length === 0
            ? 0
            : (currentPage - 1) * pageSize + 1}
          -{(currentPage - 1) * pageSize + table.getRowModel().rows.length} of{" "}
          {totalRows}
        </span> */}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={scrollToTop}
          className="p-2 rounded-md hover:bg-gray-600"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={16} />
        </Button>

        {!showAll && pageCount > 1 && (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => handlePageChange(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
              title="First page"
            >
              «
            </Button>

            <Button
              onClick={() => handlePageChange(currentPage - 2, false)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
              title="Previous page"
            >
              ‹
            </Button>

            {getPageRange.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page - 1)}
                disabled={currentPage === page}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? "bg-blue-900 text-white font-semibold cursor-not-allowed"
                    : "hover:bg-blue-900/55"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ))}

            <Button
              onClick={() => handlePageChange(currentPage, false)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
              title="Next page"
            >
              ›
            </Button>

            <Button
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
              title="Last page"
            >
              »
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
