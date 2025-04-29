"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import TopSellingCard from "@/components/Cards/TopSellingCard";
import StockReportCard from "@/components/Cards/StockReportCard";
import RecentOrdersCard from "@/components/Cards/RecentOrdersCard";
import SellsTable from "@/components/Cards/SellsTable";
import FileConvert from "@/components/Cards/FileConvert";
import { useRouter } from "next/navigation";
import TableThemes from "@/components/Cards/TableThemes";

// Define card content map
const cardContentMap = {
  "top-selling": {
    component: <TopSellingCard />,
    path: "/themes/cards/top-selling",
  },
  "chart-theme": {
    component: <StockReportCard />,
    path: "/themes/cards/chart-theme",
  },
  "recent-orders": {
    component: <RecentOrdersCard />,
    path: "/themes/cards/recent-orders",
  },
  "sells-table": {
    component: <SellsTable></SellsTable>,
    path: "/themes/cards/sells-table",
  },
  "file-Convert": {
    component: <FileConvert></FileConvert>,
    path: "/themes/cards/fileConvert",
  },
  "table-theme": {
    component: <TableThemes></TableThemes>,
    path: "/themes/cards/table-theme",
  },
  // Add more cards here if neede
};

type CardID = keyof typeof cardContentMap;

const Dashboard = () => {
  const [cards, setCards] = useState<CardID[]>([
    "top-selling",
    "chart-theme",
    "recent-orders",
    "sells-table",
    "file-Convert",
    "table-theme",
  ]);
  const [filterText, setFilterText] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedCards = Array.from(cards);
    const [movedCard] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, movedCard);
    setCards(updatedCards);
  };

  const filteredCards = cards.filter((cardId) =>
    cardId.toLowerCase().includes(filterText.toLowerCase())
  );
  const router = useRouter();

  return (
    <div className="p-4 bg-gray-50 dark:bg-[#312c4a] min-h-screen">
      {/* Header and Search */}
      <div className="mb-6 pt-2 flex flex-col justify-between sm:flex-row gap-2">
        <h1 className="text-2xl font-bold mb-2">Themes</h1>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search cards..."
          className="border-1 px-4 mb-2 rounded shadow-sm text-sm "
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="dashboard-cards"
          direction="horizontal"
          type="CARD"
        >
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredCards.map((cardId, index) => {
                const { component, path } = cardContentMap[cardId];
                return (
                  <Draggable
                    key={`${cardId}-${index}`}
                    draggableId={`${cardId}-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="bg-white dark:bg-[#463f59] p-4 rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => router.push(path)}
                      >
                        {component}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
