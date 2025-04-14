import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useState } from "react";
import Image from "next/image";
import StockReportCard from "../Cards/StockReportCard";

interface SellItem {
  id: number;
  title: string;
  description?: string;
  image: string;
  price: number;
  discount: string;
  sold: number;
  totalOrder: number;
}

const sellData: SellItem[] = [
  {
    id: 1,
    title: "Blue T-shirt",
    description: "A stylish blue t-shirt",
    image: "/image/blue_tshirt.png",
    price: 100,
    discount: "15%",
    sold: 300,
    totalOrder: 1000,
  },
  {
    id: 2,
    title: "Red Hoodie",
    description: "Cozy and warm red hoodie",
    image: "/image/blue_tshirt.png",
    price: 150,
    discount: "20%",
    sold: 200,
    totalOrder: 800,
  },
  {
    id: 3,
    title: "Black Jeans",
    description: "Comfortable black jeans",
    image: "/image/blue_tshirt.png",
    price: 200,
    discount: "10%",
    sold: 400,
    totalOrder: 1200,
  },
  {
    id: 4,
    title: "White Sneakers",
    description: "Trendy white sneakers",
    image: "/image/blue_tshirt.png",
    price: 250,
    discount: "25%",
    sold: 500,
    totalOrder: 1500,
  },
  {
    id: 5,
    title: "Green Jacket",
    description: "Warm green jacket",
    image: "/image/blue_tshirt.png",
    price: 300,
    discount: "30%",
    sold: 150,
    totalOrder: 600,
  },
  {
    id: 6,
    title: "Yellow Scarf",
    description: "Bright yellow scarf",
    image: "/image/blue_tshirt.png",
    price: 50,
    discount: "5%",
    sold: 600,
    totalOrder: 2000,
  },
  {
    id: 7,
    title: "Brown Boots",
    description: "Durable brown boots",
    image: "/image/blue_tshirt.png",
    price: 400,
    discount: "20%",
    sold: 250,
    totalOrder: 700,
  },
  {
    id: 8,
    title: "Purple Hat",
    description: "Stylish purple hat",
    image: "/image/blue_tshirt.png",
    price: 80,
    discount: "10%",
    sold: 350,
    totalOrder: 900,
  },
  {
    id: 9,
    title: "Orange Sunglasses",
    description: "Cool orange sunglasses",
    image: "/image/blue_tshirt.png",
    price: 120,
    discount: "15%",
    sold: 450,
    totalOrder: 1100,
  },
  {
    id: 10,
    title: "Gray Gloves",
    description: "Comfortable gray gloves",
    image: "/image/blue_tshirt.png",
    price: 60,
    discount: "5%",
    sold: 700,
    totalOrder: 2500,
  },
  {
    id: 11,
    title: "Pink Dress",
    description: "Elegant pink dress",
    image: "/image/blue_tshirt.png",
    price: 500,
    discount: "25%",
    sold: 100,
    totalOrder: 400,
  },
  {
    id: 12,
    title: "Blue Cap",
    description: "Casual blue cap",
    image: "/image/blue_tshirt.png",
    price: 40,
    discount: "10%",
    sold: 800,
    totalOrder: 3000,
  },
];

const TopSelling = () => {
  const [data, setData] = useState<SellItem[]>(sellData);
  const [filter] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [cards, setCards] = useState(["top-selling", "stock-report"]);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  const visibleData = showAll ? filteredData : filteredData.slice(0, 5);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.type === "CARD") {
      const updatedCards = Array.from(cards);
      const [movedCard] = updatedCards.splice(result.source.index, 1);
      updatedCards.splice(result.destination.index, 0, movedCard);
      setCards(updatedCards);
    }

    if (result.type === "ROW") {
      const items = Array.from(data);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setData(items);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards" direction="horizontal" type="CARD">
          {(provided) => (
            <div
              className="flex flex-col lg:flex-row gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards.map((cardId, index) => (
                <Draggable key={cardId} draggableId={cardId} index={index}>
                  {(provided) => (
                    <div
                      className="flex-1 bg-white p-4 rounded-xl shadow-md"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {cardId === "top-selling" ? (
                        <>
                          <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg font-semibold sm:text-base md:text-lg lg:text-xl">
                              Top Selling
                            </h1>
                            {filteredData.length > 6 && (
                              <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-black text-sm font-medium"
                              >
                                {showAll ? "Show Less ←" : "View All →"}
                              </button>
                            )}
                          </div>

                          <div className="overflow-y-auto max-h-64">
                            <Droppable droppableId="table" type="ROW">
                              {(provided) => (
                                <table
                                  className="w-full text-sm sm:text-xs md:text-sm lg:text-base"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <thead className="sticky top-0 z-10 bg-[#4BC0C0] text-white">
                                    <tr>
                                      <th className="p-2 text-left">Items</th>
                                      <th className="p-2">Price</th>
                                      <th className="p-2">Discount</th>
                                      <th className="p-2">Sold</th>
                                      <th className="p-2">Total Orders</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {visibleData.map((row, rowIndex) => (
                                      <Draggable
                                        key={row.title + rowIndex}
                                        draggableId={row.title + rowIndex}
                                        index={rowIndex}
                                      >
                                        {(provided, snapshot) => (
                                          <tr
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`text-center hover:text-gray-200 ${
                                              snapshot.isDragging
                                                ? "bg-[#00A9B4] text-white"
                                                : "hover:bg-[#00A9B4] hover:text-white"
                                            }`}
                                          >
                                            <td className="p-1 text-left">
                                              <div className="flex items-center gap-2">
                                                <Image
                                                  src={
                                                    row.image ||
                                                    "./image/blue_tshirt.png"
                                                  }
                                                  alt={
                                                    row.description || "Image"
                                                  }
                                                  width={20}
                                                  height={20}
                                                />
                                                <div className="flex flex-col text-left">
                                                  <span>{row.title}</span>
                                                  <span className="text-gray-400 text-xs">
                                                    Fashion
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="p-2">{row.price}</td>
                                            <td className="p-2">
                                              {row.discount}
                                            </td>
                                            <td className="p-2">{row.sold}</td>
                                            <td className="p-2">
                                              {row.totalOrder}
                                            </td>
                                          </tr>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </tbody>
                                </table>
                              )}
                            </Droppable>
                          </div>
                        </>
                      ) : (
                        <div>
                          <h1 className="text-lg font-semibold sm:text-base md:text-lg lg:text-xl">
                            Stock Report
                          </h1>
                          <StockReportCard></StockReportCard>
                        </div>
                      )}
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

export default TopSelling;
