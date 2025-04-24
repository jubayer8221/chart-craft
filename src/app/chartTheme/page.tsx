// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import ChartCard from "@/components/charts/ChartCard";
// import { RootState } from "@/redux/store";
// import {
//   editChart,
//   selectChart,
//   updateChartType,
// } from "@/redux/slices/chartThemeSlice";
// import type { ChartData, ChartType } from "@/types/chartTypes";

// const ChartThemePage = () => {
//   const dispatch = useDispatch();

//   const charts = useSelector((state: RootState) => state.charts.charts);
//   const selectedChartIds = useSelector(
//     (state: RootState) => state.charts.selectedCharts
//   );

//   const handleEdit = (id: string, data: ChartData) => {
//     dispatch(editChart({ id, data }));
//   };

//   const handleSelect = (id: string, isSelected: boolean) => {
//     dispatch(selectChart({ id, selected: isSelected }));
//   };

//   const handleTypeChange = (id: string, type: ChartType) => {
//     dispatch(updateChartType({ id, type }));
//   };

//   const handleExport = (id: string, format: "csv" | "image" | "pdf") => {
//     console.log(`Exporting ${id} as ${format}`);
//   };
//   console.log(
//     "Charts:",
//     charts.map((chart) => ({ id: chart.id, data: chart.data }))
//   );
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//       {charts.map((chart) => {
//         // Handle chart.data as an array, use first element or fallback
//         const chartData: ChartData =
//           Array.isArray(chart.data) && chart.data[0]
//             ? chart.data[0]
//             : {
//                 labels: [],
//                 datasets: [],
//               };

//         return (
//           <ChartCard
//             key={chart.id}
//             {...chart}
//             data={chartData}
//             selected={selectedChartIds.includes(chart.id)}
//             onEdit={handleEdit}
//             onSelect={handleSelect}
//             onTypeChange={handleTypeChange}
//             onExport={handleExport}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default ChartThemePage;
import React from "react";

const page = () => {
  return (
    <div>
      <h1>HI there!</h1>
    </div>
  );
};

export default page;
