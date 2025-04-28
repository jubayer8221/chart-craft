"use client";

// File: app/page.tsx
import { UploadZone } from "@/components/ConverterCompo/UploadZone";
import { DataViewer } from "@/components/ConverterCompo/DataViewer";

export default function HomePage() {
  return (
    <main className="p-6 w-full mx-auto dark:bg-[#312c4a] dark:text-white ">
      <div className="mb-5 pb-6">
        <UploadZone />
      </div>
      <div className="my-5 py-5">
        <DataViewer />
      </div>
    </main>
  );
}
