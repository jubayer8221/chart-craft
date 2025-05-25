// src/app/themes/cards/sells-table/page.tsx

"use client";

import React from "react";
import dynamic from "next/dynamic";

const TableOne = dynamic(() => import("@/components/dynamicChart/TableOne"), {
  ssr: false,
});

const Page = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sells Table Page</h1>
      <TableOne />
    </div>
  );
};

export default Page;
