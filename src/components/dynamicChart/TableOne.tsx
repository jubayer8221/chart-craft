"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiPlus, FiMove } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { CSVLink } from "react-csv";
import { FaPrint } from "react-icons/fa";
import ChartRenderer from "./ChartRenderer";
import type { DropResult } from "react-beautiful-dnd";

type RowData = {
  [key: string]: string;
};

type ChartType = "Bar" | "Line" | "Pie" | "Doughnut" | "Radar";

export default function TableOne() {
  const [columns, setColumns] = useState<string[]>(["Name", "Age"]);
  const [data, setData] = useState<RowData[]>([{ Name: "Alice", Age: "23" }]);
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
    setData((prevData) => {
      const newData = [...prevData];
      const updatedRow = { ...newData[rowIdx] };
      updatedRow[colName] = value;
      newData[rowIdx] = updatedRow;
      return newData;
    });
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
      printWindow.document.write("<html><head><title>Print</title></head><body>");
      printWindow.document.write(printContent.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getChartData = () => {
    const labels = data.map((row) => row[columns[0]] || "Unknown");
    const datasetData = data.map((row) => {
      const value = row[columns[1]] || "0";
      return parseFloat(value) || 0;
    });

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

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const newCols = Array.from(columns);
      const [removed] = newCols.splice(source.index, 1);
      newCols.splice(destination.index, 0, removed);
      setColumns(newCols);
    } else if (type === "row") {
      const newRows = Array.from(data);
      const [removed] = newRows.splice(source.index, 1);
      newRows.splice(destination.index, 0, removed);
      setData(newRows);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md max-w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
        Enhanced Table
      </h2>

      <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
        <button
          onClick={addColumn}
          className="bg-[rgb(10,58,102)] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center gap-2 text-sm md:text-base"
        >
          <FiPlus /> Add Column
        </button>
        <button
          onClick={addRow}
          className="bg-[rgb(10,58,102)] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center gap-2 text-sm md:text-base"
        >
          <FiPlus /> Add Row
        </button>
        <CSVLink data={data} filename="table-data.csv">
          <button className="bg-green-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm md:text-base">
            Export CSV
          </button>
        </CSVLink>
        <button
          onClick={printTable}
          className="bg-orange-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md flex items-center gap-2 text-sm md:text-base"
        >
          <FaPrint /> Print
        </button>
        <select
          value={selectedChart || ""}
          onChange={(e) =>
            setSelectedChart((e.target.value as ChartType) || null)
          }
          className="border border-gray-300 px-2 py-1 rounded-md text-sm"
        >
          <option value="">Select Chart Type</option>
          {chartTypes.map((type) => (
            <option key={type} value={type}>
              {type} Chart
            </option>
          ))}
        </select>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border border-gray-300 px-2 py-1 rounded-md text-sm"
        >
          {[5, 10, 25].map((n) => (
            <option key={n} value={n}>
              Show {n}
            </option>
          ))}
        </select>
      </div>

      <div id="printable-table" className="overflow-auto rounded shadow max-w-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <table
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-w-full table-auto text-gray-700"
              >
                <thead>
                  <tr>
                    {columns.map((col, index) => (
                      <Draggable key={col} draggableId={col} index={index}>
                        {(provided) => (
                          <th
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="p-3 text-left text-white bg-[#0A3A66]"
                          >
                            <div className="flex items-center gap-2">
                              <span {...provided.dragHandleProps}>
                                <FiMove className="text-white text-[16px]" />
                              </span>
                              {col}
                              <button onClick={() => deleteColumn(col)}>
                                <RxCross2 className="text-white text-[16px]" />
                              </button>
                            </div>
                          </th>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <th className="p-3 text-left text-white bg-[#0A3A66]">
                      Action
                    </th>
                  </tr>
                </thead>
                <Droppable droppableId="rows" type="row">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {data.slice(0, rowsPerPage).map((row, rowIdx) => (
                        <Draggable
                          key={`row-${rowIdx}`}
                          draggableId={`row-${rowIdx}`}
                          index={rowIdx}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border-b border-gray-200 even:bg-slate-50 hover:bg-[#F1F0FF] text-sm"
                            >
                              {columns.map((col) => (
                                <td key={col} className="p-2">
                                  <input
                                    value={row[col] || ""}
                                    onChange={(e) =>
                                      handleEdit(rowIdx, col, e.target.value)
                                    }
                                    className="w-full bg-transparent text-gray-700 outline-none"
                                  />
                                </td>
                              ))}
                              <td className="p-2 flex items-center gap-4">
                                <div
                                  onClick={() => deleteRow(rowIdx)}
                                  className="cursor-pointer w-7 h-7 bg-[#0A3A66] rounded-full flex items-center justify-center"
                                >
                                  <RiDeleteBin6Line className="text-white text-[16px]" />
                                </div>
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-pointer w-7 h-7 bg-[#0A3A66] rounded-full flex items-center justify-center"
                                >
                                  <FiMove className="text-white text-[16px]" />
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
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {selectedChart && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {selectedChart} Chart
          </h3>
          <ChartRenderer data={getChartData()} type={selectedChart} />
        </div>
      )}
    </div>
  );
}
