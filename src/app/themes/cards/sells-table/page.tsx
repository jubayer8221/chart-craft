"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import TableOne with SSR disabled
const TableOne = dynamic(() => import("@/components/dynamicChart/TableOne"), {
  ssr: false,
});

const SellsTable = () => {
  return (
    <div>
      <TableOne />
    </div>
  );
};

export default SellsTable;
