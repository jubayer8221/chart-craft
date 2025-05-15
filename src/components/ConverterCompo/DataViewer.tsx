"use client";

import { useAppSelector } from "@/redux/hooks";
import Table from "@/components/ConverterCompo/Table";
import { Chart } from "@/components/ConverterCompo/Chart";

export function DataViewer() {
  const data = useAppSelector((state) => state.data.data);
  const tableTitle = useAppSelector((state) => state.data.tableTitle);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full max-w-full mx-auto p-2 dark:bg-gray-800 dark:text-white rounded-md shadow-md">
      <div className="p-2 rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Your Data as Table</h1>
        <Table data={data} title={tableTitle} />
      </div>
      <div className="p-2 rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Data as Chart</h1>
        <Chart data={data} />
      </div>
    </div>
  );
}
