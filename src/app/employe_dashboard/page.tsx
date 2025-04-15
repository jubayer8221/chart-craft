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

// Define card content map
const cardContentMap = {
  "top-selling": <TopSellingCard />,
  "stock-report": <StockReportCard />,
  "recent-orders": <RecentOrdersCard />,
  // Add more cards here if needed
};

type CardID = keyof typeof cardContentMap;

const Dashboard = () => {
  const [cards, setCards] = useState<CardID[]>([
    "top-selling",
    "stock-report",
    "recent-orders",
    "top-selling",
    "stock-report",
    "recent-orders",
    "top-selling",
    "stock-report",
    "recent-orders",
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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Input to Filter Cards */}
      <div className="mb-6 flex flex-col justify-between sm:flex-row gap-2">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search cards..."
          className="border-1 px-4 py-1 rounded shadow-sm text-sm "
        />
      </div>

      {/* Draggable Card Layout */}
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
              {filteredCards.map((cardId, index) => (
                <Draggable
                  key={`${cardId}-${index}`}
                  draggableId={`${cardId}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {cardContentMap[cardId]}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
