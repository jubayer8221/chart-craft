import React, { useState } from "react";

const TopSellingCard = () => {
  const [items, setItems] = useState([
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
    { name: "Blue T-shirt", price: "$100", sold: 300 },
    { name: "Red Hoodie", price: "$150", sold: 200 },
  ]);

  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 8);

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (draggedIndex === index) return;

    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, draggedItem);

    setItems(updatedItems);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-500 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Top Selling
      </h2>
      <div className="max-h-full">
        <div className="overflow-y-auto  h-[268px] border border-gray-300 dark:border-none rounded">
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border-[#0A3A66] dark:border-none">
              <thead className="bg-[#0A3A66] text-white text-center">
                <tr
                  className="text-center"
                  draggable
                  onDragStart={(e) => handleDragStart(e, -1)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, -1)}
                >
                  <th className="border-gray-300 px-1 py-1">Item</th>
                  <th className="border-gray-300 px-1 py-1">Price</th>
                  <th className="border-gray-300 px-1 py-1">Sold</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {visibleItems.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 1
                        ? "bg-gray-200 dark:even:bg-gray-700"
                        : "bg-white dark:bg-gray-600"
                    }
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <td className="border-gray-300 py-0.5">{item.name}</td>
                    <td className="border-gray-300 py-0.5">{item.price}</td>
                    <td className="border-gray-300 py-0.5">{item.sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {!showAll && (
          <button
            className="mt-2 cursor-pointer text-sm text-blue-500 dark:text-white hover:underline"
            onClick={() => setShowAll(true)}
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default TopSellingCard;
