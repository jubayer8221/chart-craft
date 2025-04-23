import { ChartType } from "@/types/chartTypes";

// interface ChartToolbarProps {
//   type: ChartType;
//   onTypeChange: (newType: ChartType) => void; // Made required
//   onExport: (format: "csv" | "image" | "pdf") => void;
// }

export default function ChartToolbar({
  type,
  onTypeChange,
  onExport,
}: {
  type: ChartType;
  onTypeChange: (newType: ChartType) => void;
  onExport: (format: "csv" | "image" | "pdf") => void;
}) {
  return (
    <div className="flex justify-between items-center mb-2 gap-2">
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as ChartType)}
        className="border p-1 rounded"
      >
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
      </select>
      <button onClick={() => onExport("csv")} className="btn">
        Export CSV
      </button>
      <button onClick={() => onExport("image")} className="btn">
        Export Image
      </button>
      <button onClick={() => onExport("pdf")} className="btn">
        Export PDF
      </button>
    </div>
  );
}
