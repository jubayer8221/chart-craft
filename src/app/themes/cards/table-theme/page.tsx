"use client";

import { TableCard } from "@/components/TableCompo/TableCard";
import React from "react";
import { TableColumn, TableData } from "@/components/TableCompo/types";

const variants = [
  "bordered",
  "striped",
  "minimal",
  "zebra",
  "shadow",
  "rounded",
  "fancy",
  "darkmode",
  "lightmode",
  "hoverable",
] as const;

const data: TableData[] = [
  { id: "01", name: "Alice", role: "Developer", country: "USA" },
  { id: "02", name: "Bob", role: "Designer", country: "Canada" },
  { id: "03", name: "Charlie", role: "Manager", country: "UK" },
  { id: "04", name: "David", role: "Tester", country: "Germany" },
];

const columns: TableColumn[] = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Role", accessor: "role" },
  { header: "Country", accessor: "country" },
];

const Page: React.FC = () => {
  return (
    <div>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Table Themes</h1>

        {variants.map((variant) => (
          <TableCard
            key={variant}
            title={`${variant} Theme`}
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
