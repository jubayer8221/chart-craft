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
  tableRef?: React.RefObject<HTMLElement | null>; // Allow null
}

const Pagination = <TData,>({
  table,
  showAll = false,
  className = "",
  pageSizeOptions = [10, 20, 50],
  showPageSizeOptions = true,
  tableRef,
}: PaginationProps<TData>) => {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

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

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    table.setPageSize(newSize);
    table.setPageIndex(0);
    scrollToTop();
  };

  const getPageRange = useMemo(() => {
    const totalPages = pageCount;
    const current = currentPage;
    const range: (number | string)[] = [];

    // Always include the first page
    range.push(1);

    // Calculate the start and end of the middle range (2 pages before and after current)
    const start = Math.max(2, current - 2);
    const end = Math.min(totalPages, current + 1);

    // Add ellipsis if there's a gap between page 1 and the start of the range
    if (start > 2) {
      range.push("...");
    }

    // Add the middle range (2 before, current, 2 after)
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add ellipsis if there's a gap between the last page and the end of the range
    if (end < totalPages - 1) {
      range.push("...");
      range.push(totalPages);
    }

    return range;
  }, [pageCount, currentPage]);

  if (pageCount <= 1 && !showPageSizeOptions) {
    return null;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
        {showPageSizeOptions && (
          <>
            <span>Rows per page:</span>
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

      <div className="flex items-center gap-2">
        <Button
          onClick={scrollToTop}
          className="p-2 rounded-full hover:bg-gray-600"
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

            {getPageRange.map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  onClick={() => handlePageChange((page as number) - 1)}
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
              )
            )}

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
