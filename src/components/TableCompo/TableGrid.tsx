"use client";

import { TableCard } from "./TableCard";
import { useEffect, useState } from "react";
import { getTableData } from "./useTableData";
import { TableData, TableColumn } from "./types";

const columns: TableColumn[] = [
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" },
  { header: "Country", accessor: "country" },
];

const variants = [
  "bordered",
  "striped",
  "minimal",
  "zebra",
  "shadow",
  "rounded",
] as const;

export const TableGrid = () => {
  const [data, setData] = useState<TableData[]>([]);

  useEffect(() => {
    (async () => {
      const loadedData = await getTableData("api", "/api/sample-data"); // or 'excel'
      setData(loadedData || []);
    })();
  }, []);

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {variants.map((variant, idx) => (
        <TableCard
          key={variant}
          title={`Table ${idx + 1}`}
          columns={columns}
          data={data}
          variant={variant}
        />
      ))}
    </div>
  );
};
