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

  const visibleItems = showAll ? items : items.slice(0, 7);

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
    <div>
      <h1 className="text-lg font-semibold">Top Selling</h1>
      <div className="mt-4">
        <div className="overflow-y-auto max-h-64 border border-gray-300 rounded">
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border-gray-300">
              <thead>
                <tr
                  className="text-center"
                  draggable
                  onDragStart={(e) => handleDragStart(e, -1)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, -1)}
                >
                  <th className="border-gray-300 px-2 py-2">Item</th>
                  <th className="border-gray-300 px-2 py-2">Price</th>
                  <th className="border-gray-300 px-2 py-2">Sold</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {visibleItems.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 1 ? "bg-gray-200" : "bg-white"}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <td className="border-gray-300 py-2">{item.name}</td>
                    <td className="border-gray-300 py-2">{item.price}</td>
                    <td className="border-gray-300 py-2">{item.sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {!showAll && (
          <button
            className="mt-2 text-blue-500 hover:underline"
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
