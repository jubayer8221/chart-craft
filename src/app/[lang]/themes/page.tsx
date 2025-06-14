"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { usePathname } from "next/navigation";
import { locales, Locale, isValidLocale } from "@/i18n/routing";

import TopSellingCard from "@/components/Cards/TopSellingCard";
import StockReportCard from "@/components/Cards/StockReportCard";
import RecentOrdersCard from "@/components/Cards/RecentOrdersCard";
import SellsTable from "@/components/Cards/SellsTable";
import FileConvert from "@/components/Cards/FileConvert";
import { useRouter } from "next/navigation";
import TableThemes from "@/components/Cards/TableThemes";
import Image from "next/image";
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
  const pathname = usePathname() || "/";
  const currentLocaleCode = (pathname.split("/")[1] ?? "en") as Locale;
  const currentLocale = isValidLocale(currentLocaleCode)
    ? currentLocaleCode
    : locales[0];

  const [t, setT] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const msgs = (await import(`@/i18n/messages/${currentLocale}.json`))
          .default;
        setT(msgs);
      } catch {
        setT({});
      }
    })();
  }, [currentLocale]);

  const [cards, setCards] = useState<CardID[]>([
    "file-Convert",
    "table-theme",
    "top-selling",
    "chart-theme",
    "recent-orders",
    "sells-table",
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
        <h1 className="text-2xl font-bold mb-2">{t["themes"] || "Themes"}</h1>

        <div className="relative w-full md:w-auto flex items-center gap-2 text-xs rounded-md ring-[1.5px] ring-gray-300 dark:ring-[#897c8f] px-2">
          <Image src="/assets/search.png" alt="search" width={14} height={14} />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search cards..."
            className="w-[200px] p-2 bg-transparent outline-none"
          />
        </div>
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
