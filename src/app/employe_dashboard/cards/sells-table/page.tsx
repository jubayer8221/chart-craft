
// import TableOne from '@/components/dynamicChart/TableOne'
import TableOne from '@/components/dynamicChart/TableOne'
import React from 'react'

const SellsTable = () => {
  return (
    <div>
      <TableOne />
    </div>
  )
}

export default SellsTable

// "use client";

// import React, { useState, useRef } from "react";
// import Table from "@/components/Table";
// import ChartRenderer from "@/components/ChartRenderer";

// const chartTypes = ["Bar", "Line", "Pie", "Doughnut", "Radar"] as const;
// type ChartType = typeof chartTypes[number];

// type Item = {
//   name: string;
//   sold: number;
//   inStock: number;
// };

// const SellsTable = () => {
//   const [selectedChartType, setSelectedChartType] = useState<Record<string, ChartType | null>>({
//     default: null,
//     striped: null,
//     compact: null,
//   });
//   const [activeTable, setActiveTable] = useState<string | null>(null);
//   const printRef = useRef<HTMLDivElement>(null);

//   const defaultItems: Item[] = [
//     { name: "Phone", sold: 120, inStock: 80 },
//     { name: "Laptop", sold: 90, inStock: 60 },
//     { name: "Tablet", sold: 75, inStock: 45 },
//     { name: "Monitor", sold: 60, inStock: 40 },
//   ];
//   const stripedItems: Item[] = [
//     { name: "Chair", sold: 100, inStock: 50 },
//     { name: "Desk", sold: 80, inStock: 30 },
//     { name: "Sofa", sold: 60, inStock: 20 },
//     { name: "Bookshelf", sold: 40, inStock: 10 },
//   ];
//   const compactItems: Item[] = [
//     { name: "Novel", sold: 150, inStock: 100 },
//     { name: "Biography", sold: 130, inStock: 90 },
//     { name: "Science Fiction", sold: 110, inStock: 70 },
//     { name: "Mystery", sold: 90, inStock: 50 },
//   ];

//   const generateChartData = (items: Item[]) => ({
//     labels: items.map((item) => item.name),
//     datasets: [
//       {
//         label: "Sold",
//         data: items.map((item) => item.sold),
//         backgroundColor: [
//           "#1abc9c",
//           "#2ecc71",
//           "#3498db",
//           "#9b59b6",
//           "#f1c40f",
//           "#e67e22",
//           "#e74c3c",
//         ],
//       },
//     ],
//   });

//   const downloadCSV = (items: Item[], filename: string) => {
//     const csvContent = [
//       "Name,Sold",
//       ...items.map((item) => `${item.name},${item.sold}`)
//     ].join("\n");
    
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `${filename}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handlePrint = () => {
//     if (printRef.current) {
//       const printWindow = window.open("", "_blank");
//       if (printWindow) {
//         printWindow.document.write(`
//           <html>
//             <head>
//               <title>Print Table and Chart</title>
//               <style>
//                 body { font-family: Arial, sans-serif; padding: 20px; }
//                 table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
//                 th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                 th { background-color: #f2f2f2; }
//                 canvas { max-width: 100%; }
//               </style>
//             </head>
//             <body>
//               ${printRef.current.innerHTML}
//             </body>
//           </html>
//         `);
//         printWindow.document.close();
//         printWindow.print();
//       }
//     }
//   };

//   const renderTableWithChart = (
//     id: string,
//     title: string,
//     description: string,
//     items: Item[],
//     striped: boolean = false,
//     compact: boolean = false
//   ) => (
//     <div ref={printRef} className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//       <div>
//         <Table
//           title={title}
//           description={description}
//           columns={["Name", "Sold"]}
//           rows={items.map((item) => [item.name, item.sold.toString()])}
//           striped={striped}
//           compact={compact}
//         />
//         <div className="flex gap-2 px-4 pb-4">
//           <button
//             className="bg-[#0A3A66] text-white px-4 py-2 rounded-md"
//             onClick={() => setActiveTable(id)}
//           >
//             Choose Chart
//           </button>
//           {activeTable === id && (
//             <select
//               className="border border-gray-300 rounded px-2"
//               onChange={(e) =>
//                 setSelectedChartType((prev) => ({
//                   ...prev,
//                   [id]: e.target.value as ChartType,
//                 }))
//               }
//               value={selectedChartType[id] ?? ""}
//             >
//               <option value="">Select Chart</option>
//               {chartTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           )}
//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded-md"
//             onClick={() => downloadCSV(items, title.toLowerCase().replace(" ", "_"))}
//           >
//             Download CSV
//           </button>
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded-md"
//             onClick={handlePrint}
//           >
//             Print
//           </button>
//         </div>
//       </div>
//       {activeTable === id && selectedChartType[id] && (
//         <ChartRenderer type={selectedChartType[id] as ChartType} data={generateChartData(items)} />
//       )}
//     </div>
//   );

//   return (
//     <div className="p-4">
//       {renderTableWithChart("default", "Default Table", "All electronics products table", defaultItems)}
//       {renderTableWithChart("striped", "Striped Table", "All furniture products table", stripedItems, true)}
//       {renderTableWithChart("compact", "Compact Table", "All books products table", compactItems, false, true)}
//     </div>
//   );
// };

// export default SellsTable;