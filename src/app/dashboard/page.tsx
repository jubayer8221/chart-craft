"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  ArrowsRightLeftIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

import TopSellingCard from "@/components/Cards/TopSellingCard";
import StockReportCard from "@/components/Cards/StockReportCard";
import RecentOrdersCard from "@/components/Cards/RecentOrdersCard";

const cardContentMap = {
  "top-selling": <TopSellingCard />,
  "stock-report": <StockReportCard />,
  "recent-orders": <RecentOrdersCard />,
};

type CardID = keyof typeof cardContentMap;

const Dashboard = () => {
  const [cards, setCards] = useState<CardID[]>([
    "top-selling",
    "stock-report",
    "recent-orders",
  ]);
  const [filterText, setFilterText] = useState("");
  const [layoutDirection, setLayoutDirection] = useState<
    "horizontal" | "vertical"
  >("vertical");
  const [isMobileView, setIsMobileView] = useState(false);

  // Handle window resize for mobile detection
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const toggleLayoutDirection = () => {
    setLayoutDirection((prev) =>
      prev === "vertical" ? "horizontal" : "vertical"
    );
  };

  // Responsive grid classes based on direction and screen size
  const getGridClasses = () => {
    if (layoutDirection === "horizontal") {
      return "flex overflow-x-auto pb-4 space-x-4";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
  };

  // Card size classes based on direction
  const getCardClasses = () => {
    const baseClasses =
      "bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all";
    if (layoutDirection === "horizontal") {
      return `${baseClasses} min-w-[300px] sm:min-w-[350px]`;
    }
    return baseClasses;
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search cards..."
            className="border px-4 py-2 rounded-md shadow-sm text-sm w-full"
          />

          {/* Layout Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={toggleLayoutDirection}
              className={`p-2 rounded-md ${
                layoutDirection === "vertical"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200"
              }`}
              title={
                layoutDirection === "vertical"
                  ? "Switch to horizontal"
                  : "Switch to vertical"
              }
              disabled={isMobileView}
            >
              {layoutDirection === "vertical" ? (
                <ArrowsRightLeftIcon className="h-5 w-5" />
              ) : (
                <ListBulletIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setLayoutDirection("vertical")}
              className={`p-2 rounded-md ${
                layoutDirection === "vertical"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200"
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="dashboard-cards"
          direction={isMobileView ? "vertical" : layoutDirection}
          type="CARD"
        >
          {(provided) => (
            <div
              className={getGridClasses()}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredCards.map((cardId, index) => (
                <Draggable key={cardId} draggableId={cardId} index={index}>
                  {(provided) => (
                    <div
                      className={getCardClasses()}
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
