"use client";

import React, { useRef } from "react";

const tableThemes = [
  {
    title: "Basic Table",
    description:
      "Display data in a simple and structured format without complex features.",
  },
  {
    title: "Sortable Table",
    description:
      "Allows users to sort columns by ascending or descending order.",
  },
  {
    title: "Filterable Table",
    description:
      "Users can filter data based on specific criteria or keywords.",
  },
  {
    title: "Paginated Table",
    description:
      "Break large data sets into smaller pages for easier navigation.",
  },
  {
    title: "Editable Table",
    description: "Users can directly edit table cells for quick updates.",
  },
];

const TableThemes: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll left or right
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // How much to scroll
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold pb-4">Table Themes</h1>

      {/* Scroll Buttons */}
      <div className="flex justify-end space-x-2 mb-2">
        <button
          onClick={() => handleScroll("left")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ◀
        </button>
        <button
          onClick={() => handleScroll("right")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ▶
        </button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2 rounded-lg"
      >
        {tableThemes.map((theme, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {theme.title}
            </h2>
            <p className="text-gray-600">{theme.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableThemes;
