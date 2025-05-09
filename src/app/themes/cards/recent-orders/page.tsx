"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setData,
  setSortConfig,
  setProgressFilter,
  setCurrentPage,
  setVisibleColumns,
  deleteRow,
} from "@/redux/slices/recent-orderSlice";
import { mockRecentOrders } from "@/lib/data/mockRecentOrders";
import { FaSortUp, FaSortDown, FaTimes, FaPlus } from "react-icons/fa";

interface Item {
  id: string;
  name: string;
  price: number;
  order: string;
  progress: string;
}

const allColumns: (keyof Item)[] = ["id", "name", "price", "order", "progress"];
const itemsPerPage = 6;

const TableComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, sortConfig, progressFilter, visibleColumns, currentPage } =
    useSelector((state: RootState) => state.recentOrders);

  useEffect(() => {
    dispatch(setData(mockRecentOrders));
  }, [dispatch]);

  const handleSort = (key: keyof Item) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    dispatch(setProgressFilter("")); // Reset filter
    dispatch(setSortConfig({ key, direction }));
  };

  const handleDeleteRow = (id: string) => {
    dispatch(deleteRow(id));
  };

  const handleDeleteColumn = (key: keyof Item) => {
    dispatch(setVisibleColumns(visibleColumns.filter((col) => col !== key)));
  };

  const filteredData = progressFilter
    ? data.filter((item: Item) => {
        const query = progressFilter.toLowerCase();
        return (
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.order.toLowerCase().includes(query) ||
          item.progress.toLowerCase().includes(query)
        );
      })
    : data;

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      return sortConfig.direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const currentValidPage = Math.min(currentPage, totalPages);
  const paginatedData = sortedData.slice(
    (currentValidPage - 1) * itemsPerPage,
    currentValidPage * itemsPerPage
  );

  return (
    <div className={`p-4 overflow-x-auto bg-gray-50 dark:bg-[#312c4a]`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold">Recent Order</h2>
      </div>

      <div className="w-full overflow-auto rounded-lg">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              {allColumns.map(
                (key) =>
                  visibleColumns.includes(key) && (
                    <TableHead
                      key={key}
                      onClick={() => handleSort(key)}
                      className="cursor-pointer whitespace-nowrap group"
                    >
                      <div className="flex items-center gap-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        <span className="w-4 h-4 inline-flex items-center justify-center relative">
                          {sortConfig?.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp className="text-primary" />
                            ) : (
                              <FaSortDown className="text-primary" />
                            )
                          ) : (
                            <span className="w-4 h-4" />
                          )}
                          <button
                            className="hidden group-hover:inline-block text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteColumn(key);
                            }}
                          >
                            <FaTimes />
                          </button>
                        </span>
                      </div>
                    </TableHead>
                  )
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="group relative hover:bg-gray-100 dark:hover:bg-[#685e74]"
              >
                {visibleColumns.includes("id") && (
                  <TableCell className="whitespace-nowrap">{item.id}</TableCell>
                )}
                {visibleColumns.includes("name") && (
                  <TableCell className="whitespace-nowrap">
                    {item.name}
                  </TableCell>
                )}
                {visibleColumns.includes("order") && (
                  <TableCell className="whitespace-nowrap">
                    {item.order}
                  </TableCell>
                )}
                {visibleColumns.includes("progress") && (
                  <TableCell className="whitespace-nowrap">
                    {item.progress}
                  </TableCell>
                )}
                {visibleColumns.includes("price") && (
                  <TableCell className="whitespace-nowrap">
                    ${item.price}
                  </TableCell>
                )}
                <TableCell className="absolute right-0 pr-2 opacity-0 group-hover:opacity-100">
                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteRow(item.id)}
                  >
                    <FaTimes />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
        <Button
          onClick={() => dispatch(setCurrentPage(currentValidPage - 1))}
          disabled={currentValidPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentValidPage} of {totalPages}
        </span>
        <Button
          onClick={() => dispatch(setCurrentPage(currentValidPage + 1))}
          disabled={currentValidPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Hidden Columns */}
      {allColumns.some((col) => !visibleColumns.includes(col)) && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Hidden Columns:</h3>
          <div className="flex gap-2 flex-wrap">
            {allColumns
              .filter((col) => !visibleColumns.includes(col))
              .map((col) => (
                <Button
                  key={col}
                  onClick={() =>
                    dispatch(setVisibleColumns([...visibleColumns, col]))
                  }
                >
                  <FaPlus className="mr-1" /> {col}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
