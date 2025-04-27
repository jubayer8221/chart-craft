"use client";

import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ChartCard from "@/components/Cards/ChartCard";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  setCharts,
  editChartData,
  changeChartType,
  changeChartColor,
  toggleSelectedChart,
  toggleExportType,
} from "@/redux/slices/chartSlice";

export interface ChartData {
  label: string;
  value: number;
}

export interface ChartType {
  id: string;
  title: string;
  type: "bar" | "line" | "pie";
  data: ChartData[];
  color: string;
}

export default function ChartDashboard() {
  const dispatch = useAppDispatch();
  const { charts, selectedCharts, exportTypes } = useAppSelector(
    (state) => state.charts
  );
  const chartRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load charts from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedCharts = localStorage.getItem("charts");
      if (savedCharts) {
        const parsedCharts: unknown = JSON.parse(savedCharts);
        if (Array.isArray(parsedCharts)) {
          dispatch(setCharts(parsedCharts));
        } else {
          console.warn(
            "Invalid charts data in localStorage, resetting to default."
          );
          dispatch(setCharts([]));
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage charts:", error);
      dispatch(setCharts([])); // Reset to default on error
    }
  }, [dispatch]);

  const handleExport = async () => {
    if (exportTypes.length === 0) {
      alert("Please select at least one export type.");
      return;
    }
    if (selectedCharts.length === 0) {
      alert("Please select at least one chart to export.");
      return;
    }

    // Handle PDF and Image exports
    if (exportTypes.includes("pdf") || exportTypes.includes("image")) {
      const pdf = new jsPDF();
      for (let i = 0; i < selectedCharts.length; i++) {
        const id = selectedCharts[i];
        const el = chartRefs.current[id];
        if (el) {
          try {
            const canvas = await html2canvas(el);
            const img = canvas.toDataURL("image/png");
            if (exportTypes.includes("image")) {
              const link = document.createElement("a");
              link.href = img;
              link.download = `${id}.png`;
              link.click();
            }
            if (exportTypes.includes("pdf")) {
              if (i !== 0) pdf.addPage();
              pdf.addImage(img, "PNG", 10, 10, 190, 100);
            }
          } catch (error) {
            console.error("Error generating canvas for chart", id, error);
            alert(`Failed to export chart ${id}. Please try again.`);
          }
        }
      }
      if (exportTypes.includes("pdf")) {
        try {
          pdf.save("charts.pdf");
        } catch (error) {
          console.error("Error saving PDF:", error);
          alert("Failed to save PDF. Please try again.");
        }
      }
    }

    // Handle CSV export
    if (exportTypes.includes("csv")) {
      const csvData = selectedCharts.flatMap(
        (id) => charts.find((chart) => chart.id === id)?.data || []
      );
      const csvContent = [
        ["Label", "Value"],
        ...csvData.map((item) => [item.label, item.value]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      try {
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "charts.csv");
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating CSV:", error);
        alert("Failed to export CSV. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <label className="text-gray-700">Select Export Types:</label>
        {["image", "pdf", "csv"].map((type) => (
          <label key={type} className="flex items-center">
            <input
              type="checkbox"
              value={type}
              checked={exportTypes.includes(type)}
              onChange={() => dispatch(toggleExportType(type))}
              className="mx-2 accent-teal-600"
            />
            <span className="text-gray-600">{type.toUpperCase()}</span>
          </label>
        ))}
        <button
          onClick={handleExport}
          className="ml-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
        >
          Export
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {charts.length === 0 ? (
          <p className="text-gray-600">No charts available.</p>
        ) : (
          charts.map((chart) =>
            chart ? (
              <div
                key={chart.id}
                ref={(el) => {
                  if (el) {
                    chartRefs.current = {
                      ...chartRefs.current,
                      [chart.id]: el,
                    };
                  }
                }}
                className="border p-4 rounded-xl shadow bg-white"
              >
                <input
                  type="checkbox"
                  className="mb-2 accent-teal-600"
                  onChange={() => dispatch(toggleSelectedChart(chart.id))}
                  checked={selectedCharts.includes(chart.id)}
                />
                <ChartCard
                  {...chart}
                  onEdit={(data) =>
                    dispatch(editChartData({ id: chart.id, data }))
                  }
                  onTypeChange={(type) =>
                    dispatch(changeChartType({ id: chart.id, type }))
                  }
                  onColorChange={(color) =>
                    dispatch(changeChartColor({ id: chart.id, color }))
                  }
                />
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
}
