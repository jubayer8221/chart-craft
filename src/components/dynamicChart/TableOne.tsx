"use client";

import { useState, useCallback } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiPlus, FiMove } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { CSVLink } from "react-csv";
import { FaPrint } from "react-icons/fa";
import ChartRenderer from "./ChartRenderer";
// import type { DropResult } from "react-beautiful-dnd";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type RowData = { [key: string]: string };
type ChartType = "Bar" | "Line" | "Pie" | "Doughnut" | "Radar";

export default function TableOne() {
  const [columns, setColumns] = useState<string[]>([
    "Name",
    "Age",
    "Title",
    "Salary",
  ]);
  const [data, setData] = useState<RowData[]>([
    { Name: "Alice", Age: "23", Title: "Developer", Salary: "25,000" },
  ]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);

  const chartTypes: ChartType[] = ["Bar", "Line", "Pie", "Doughnut", "Radar"];

  const addRow = () => {
    const newRow: RowData = {};
    columns.forEach((col) => (newRow[col] = ""));
    setData([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleEdit = (rowIdx: number, colName: string, value: string) => {
    setData((prev) =>
      prev.map((row, i) => (i === rowIdx ? { ...row, [colName]: value } : row))
    );
  };

  const addColumn = () => {
    const newCol = prompt("Enter new column name:");
    if (newCol && !columns.includes(newCol)) {
      setColumns([...columns, newCol]);
      setData(data.map((row) => ({ ...row, [newCol]: "" })));
    }
  };

  const deleteColumn = (colToDelete: string) => {
    setColumns(columns.filter((col) => col !== colToDelete));
    setData(
      data.map((row) => {
        const newRow = { ...row };
        delete newRow[colToDelete];
        return newRow;
      })
    );
  };

  const printTable = () => {
    const printContent = document.getElementById("printable-table");
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow && printContent) {
      printWindow.document.write(
        "<html><head><title>Print</title></head><body>"
      );
      printWindow.document.write(printContent.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getChartData = () => {
    const labels = data.map((row) => row[columns[0]] || "Unknown");
    const datasetData = data.map(
      (row) => parseFloat(row[columns[1]] || "0") || 0
    );

    return {
      labels,
      datasets: [
        {
          label: columns[1] || "Value",
          data: datasetData,
          backgroundColor: [
            "rgb(0,169,180)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgb(10,58,102)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, type } = result;
      if (!destination) return;

      if (type === "column") {
        const newCols = [...columns];
        const [moved] = newCols.splice(source.index, 1);
        newCols.splice(destination.index, 0, moved);
        setColumns(newCols);
      } else if (type === "row") {
        const newRows = [...data];
        const [moved] = newRows.splice(source.index, 1);
        newRows.splice(destination.index, 0, moved);
        setData(newRows);
      }
    },
    [columns, data]
  );

  return (
    <div className="bg-white dark:bg-[#312c4a] p-4 rounded-md max-w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-white mb-4">
        Enhanced Table
      </h2>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
        <button
          onClick={addColumn}
          className="flex items-center gap-3 px-3 py-2 bg-[#0A3A66] dark:bg-[#685e74] rounded-md text-white"
        >
          <FiPlus /> Add Column
        </button>
        <button
          onClick={addRow}
          className="flex items-center gap-3 px-3 py-2 bg-[#0A3A66] dark:bg-[#685e74] rounded-md text-white"
        >
          <FiPlus /> Add Row
        </button>
        <CSVLink data={data} filename="table-data.csv">
          <button className="bg-green-600 dark:bg-[#685e74] text-white px-3 py-2 rounded-md">
            Export CSV
          </button>
        </CSVLink>
        <button
          onClick={printTable}
          className="bg-orange-500 dark:bg-[#685e74] text-white px-3 py-2 rounded-md flex items-center gap-2"
        >
          <FaPrint /> Print
        </button>
        <select
          value={selectedChart || ""}
          onChange={(e) => setSelectedChart(e.target.value as ChartType)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option
            className="border-none dark:text-white dark:bg-gray-800"
            value=""
          >
            Select Chart Type
          </option>
          {chartTypes.map((type) => (
            <option
              className="bg-white dark:bg-gray-800 text-black dark:text-white"
              key={type}
              value={type}
            >
              {type} Chart
            </option>
          ))}
        </select>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border px-3 py-2 rounded-md text-sm"
        >
          {[5, 10, 25].map((n) => (
            <option
              className="bg-white dark:bg-gray-800 text-black dark:text-white"
              key={n}
              value={n}
            >
              Show {n}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        id="printable-table"
        className="overflow-auto rounded shadow max-w-full"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="min-w-full table-auto">
            {/* Columns Drag-Drop */}
            <thead>
              <Droppable
                droppableId="columns"
                direction="horizontal"
                type="column"
              >
                {(provided, snapshot) => (
                  <tr
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={snapshot.isDraggingOver ? "bg-gray-200" : ""}
                  >
                    {columns.map((col, index) => (
                      <Draggable
                        key={`col-${col}`}
                        draggableId={`col-${col}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <th
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-3 bg-[#0A3A66] dark:bg-[#685e74] text-white text-left ${
                              snapshot.isDragging ? "opacity-50" : ""
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              minWidth: "100px", // Ensure columns have enough space
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span {...provided.dragHandleProps}>
                                <FiMove />
                              </span>
                              {col}
                              <button onClick={() => deleteColumn(col)}>
                                <RxCross2 />
                              </button>
                            </div>
                          </th>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <th className="p-3 bg-[#0A3A66] dark:bg-[#685e74] text-white text-left">
                      Action
                    </th>
                  </tr>
                )}
              </Droppable>
            </thead>

            {/* Rows Drag-Drop */}
            <Droppable droppableId="rows" type="row" isDropDisabled={true}>
              {(provided, snapshot) => (
                <tbody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={snapshot.isDraggingOver ? "bg-gray-100" : ""}
                >
                  {data.slice(0, rowsPerPage).map((row, rowIdx) => (
                    <Draggable
                      key={`row-${rowIdx}`}
                      draggableId={`row-${rowIdx}`}
                      index={rowIdx}
                    >
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${
                            snapshot.isDragging ? "bg-blue-100" : ""
                          } even:bg-slate-50 dark:even:bg-[#383042] dark:odd:bg-[#403d43] dark:hover:bg-[#4d4d4d] dark:text-black border-b dark:border-gray-500 text-sm`}
                        >
                          {columns.map((col) => (
                            <td key={col} className="p-2">
                              <input
                                value={row[col] || ""}
                                onChange={(e) =>
                                  handleEdit(rowIdx, col, e.target.value)
                                }
                                className="w-full bg-transparent text-gray-700 dark:text-white outline-none"
                              />
                            </td>
                          ))}
                          <td className="p-2 flex items-center gap-2">
                            <button
                              onClick={() => deleteRow(rowIdx)}
                              className="bg-[#0A3A66] dark:bg-[#685e74] text-white p-1 rounded-full"
                            >
                              <RiDeleteBin6Line />
                            </button>
                            <div
                              {...provided.dragHandleProps}
                              className="bg-[#0A3A66] dark:bg-[#2f2b33] text-white p-1 rounded-full cursor-move"
                            >
                              <FiMove />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      {/* Chart */}
      {selectedChart && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
            {selectedChart} Chart
          </h3>
          <ChartRenderer data={getChartData()} type={selectedChart} />
        </div>
      )}
    </div>
  );
}
