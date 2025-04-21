// import ChartRenderer from "./ChartRenderer";
// import ChartToolbar from "./ChartToolbar";
// import EditableChartTable from "./EditableChartTable";
// import { ChartCardProps } from "@/types/chartTypes";

// export interface ChartCardComponentProps extends ChartCardProps {
//   onSelect?: (id: string, selected: boolean) => void;
//   onEdit?: (id: string, data: ChartCardProps["data"]) => void;
//   onExport?: (id: string, format: "csv" | "image" | "pdf") => void;
// }

// const ChartCard = ({
//   id,
//   title,
//   type,
//   data,
//   editable,
//   selected,
//   selectable,
//   onSelect,
//   onEdit,
//   onExport,
// }: ChartCardComponentProps) => {
//   const handleTypeChange = (newType: ChartCardProps["type"]) => {
//     if (onEdit) onEdit(id, data, newType);
//   };

//   const handleDataChange = (newData: ChartCardProps["data"]) => {
//     if (onEdit) onEdit(id, newData, type);
//   };

//   return (
//     <div
//       className={`rounded-xl shadow p-4 border ${
//         selected ? "border-blue-500" : "border-gray-300"
//       }`}
//     >
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="text-lg font-semibold">{title || "Chart"}</h3>
//         {selectable && (
//           <input
//             type="checkbox"
//             checked={selected}
//             onChange={(e) => onSelect?.(id, e.target.checked)}
//           />
//         )}
//       </div>

//       <ChartToolbar
//         type={type}
//         onTypeChange={handleTypeChange}
//         onExport={(format) => onExport?.(id, format)}
//       />
//       <ChartRenderer type={type} data={data} />
//       {editable && (
//         <EditableChartTable data={data} onDataChange={handleDataChange} />
//       )}
//     </div>
//   );
// };

// export default ChartCard;
