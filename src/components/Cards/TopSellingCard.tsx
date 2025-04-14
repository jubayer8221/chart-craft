import React, { useState } from "react";

const TopSellingCard = () => {
  const items = [
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
  ];

  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 7);

  return (
    <div>
      <h1 className="text-lg font-semibold">Top Selling</h1>
      <div className="mt-4">
        <div className="overflow-y-auto max-h-64 border border-gray-300 rounded">
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border-gray-300">
              <thead>
                <tr className="text-center">
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
