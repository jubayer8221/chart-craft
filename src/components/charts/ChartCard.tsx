import React from "react";
import ChartRenderer from "./ChartRenderer";
import ChartToolbar from "./ChartToolbar";
import EditableChartTable from "./EditableChartTable";
import type { ChartData, ChartType } from "@/types/chartTypes";

interface ChartCardProps {
  id: string;
  title?: string;
  type: ChartType;
  data: ChartData;
  editable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onEdit: (id: string, data: ChartData) => void;
  onSelect: (id: string, selected: boolean) => void;
  onExport: (id: string, format: "csv" | "image" | "pdf") => void;
  onTypeChange: (id: string, type: ChartType) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  id,
  title = "Chart",
  type,
  data,
  editable = false,
  selected = false,
  selectable = false,
  onEdit,
  onSelect,
  onExport,
  onTypeChange,
}) => {
  return (
    <div
      className={`rounded-xl shadow p-4 border transition-colors ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {selectable && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">Select</span>
          </label>
        )}
      </div>

      <ChartToolbar
        type={type}
        onTypeChange={(newType) => onTypeChange(id, newType)}
        onExport={(format) => onExport(id, format)}
      />

      <div className="my-4 h-64">
        <ChartRenderer type={type} data={data} />
      </div>

      {editable && (
        <EditableChartTable
          data={data}
          onDataChange={(newData) => onEdit(id, newData)}
        />
      )}
    </div>
  );
};

export default ChartCard;
