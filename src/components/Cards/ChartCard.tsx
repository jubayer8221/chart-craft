"use client";

import React from "react";
import { ChartData, ChartType } from "@/types/chart";

interface ChartCardProps {
  id: string;
  title: string;
  type: ChartType["type"];
  data: ChartData[];
  color: string;
  onEdit: (data: ChartData[]) => void;
  onTypeChange: (type: ChartType["type"]) => void;
  onColorChange: (color: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({
  id,
  title,
  type,
  data,
  color,
  onEdit,
  onTypeChange,
  onColorChange,
}) => {
  if (!id || !title || !type || !data || !color) {
    console.warn("Invalid ChartCard props:", { id, title, type, data, color });
    return <div className="p-4 text-red-600">Invalid chart data</div>;
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ChartType["type"];
    onTypeChange(newType);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  const handleDataEdit = () => {
    const newData = data.map((item) => ({ ...item, value: item.value + 10 }));
    onEdit(newData);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2">
        <label className="text-gray-600">Type: </label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="border rounded p-1"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div className="mt-2">
        <label className="text-gray-600">Color: </label>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="border rounded"
        />
      </div>
      <button
        onClick={handleDataEdit}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Edit Data (Example)
      </button>
      <div className="mt-4">
        <p>Chart Type: {type}</p>
        <p>Data: {JSON.stringify(data)}</p>
        <p>Color: {color}</p>
      </div>
    </div>
  );
};

export default ChartCard;
