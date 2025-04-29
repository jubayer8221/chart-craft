"use client";

import { TableCard } from "@/components/TableCompo/TableCard";
import React from "react";
import { TableColumn, TableData } from "@/components/TableCompo/types"; // adjust path as needed

const variants = [
  "bordered",
  "striped",
  "minimal",
  "zebra",
  "shadow",
  "rounded",
  "fancy",
  "darkmode",
] as const;

const data: TableData[] = [
  { name: "Alice", role: "Developer", country: "USA" },
  { name: "Bob", role: "Designer", country: "Canada" },
  { name: "Charlie", role: "Manager", country: "UK" },
  { name: "David", role: "Tester", country: "Germany" },
];

const columns: TableColumn[] = [
  { header: "Name", accessor: "name" },
  { header: "Role", accessor: "role" },
  { header: "Country", accessor: "country" },
];

// const page = [
//   {
//     title: "Basic Table",
//     description:
//       "Display data in a simple and structured format without complex features.",
//   },
//   {
//     title: "Sortable Table",
//     description:
//       "Allows users to sort columns by ascending or descending order.",
//   },
//   {
//     title: "Filterable Table",
//     description:
//       "Users can filter data based on specific criteria or keywords.",
//   },
//   {
//     title: "Paginated Table",
//     description:
//       "Break large data sets into smaller pages for easier navigation.",
//   },
//   {
//     title: "Editable Table",
//     description: "Users can directly edit table cells for quick updates.",
//   },
// ];

// Sample columns and data for the table
// const columns: TableColumn[] = [
//   { header: "Name", accessor: "name" },
//   { header: "Role", accessor: "role" },
//   { header: "Country", accessor: "country" },
// ];

// const data: TableData[] = [
//   { name: "Alice", role: "Developer", country: "USA" },
//   { name: "Bob", role: "Designer", country: "Canada" },
//   { name: "Charlie", role: "Manager", country: "UK" },
// ];

const Page: React.FC = () => {
  return (
    <div className="">
      <h1 className="text-lg font-semibold pb-2">Table Themes</h1>
      <div>
        {/* <TableCard
          title="Preview Table"
          columns={columns}
          data={data}
          variant="rounded"
        /> */}
      </div>

      {/* ✅ Correct TableCard usage */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {page.map((theme, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {theme.title}
            </h2>
            <p className="text-gray-600">{theme.description}</p>
          </div>
        ))}
      </div> */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Table Variants</h1>

        {variants.map((variant) => (
          <TableCard
            key={variant}
            title={`${
              variant.charAt(0).toUpperCase() + variant.slice(1)
            } Table`}
            data={data}
            columns={columns}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
