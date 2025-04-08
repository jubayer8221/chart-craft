"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface CardProps {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

const Card: React.FC<CardProps> = ({ id, title, description, imageSrc }) => {
  const router = useRouter();

  const handleViewMore = () => {
    router.push(`/Cards/${id}`);
  };

  return (
    <div
      id={id}
      className="bg-white text-black shadow-md rounded-lg border-2 p-4 flex flex-col items-center justify-center"
    >
      <Image
        src={imageSrc}
        alt={`${title} Image`}
        height={100}
        width={100}
        className="rounded-lg h-auto"
        priority={true}
      />
      <h1 className="text-xl font-bold mt-4">{title}</h1>
      <p className="text-base text-center mt-2">{description}</p>
      <button
        onClick={handleViewMore}
        className="mt-4 px-4 py-2 rounded bg-blue-800 hover:bg-blue-900 active:scale-95 text-white"
      >
        View More
      </button>
    </div>
  );
};

const CardList: React.FC<{ cards: CardProps[] }> = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const defaultCards = Array.from({ length: 9 }, (_, index) => ({
    id: `placeholder-${index}`,
    title: "Placeholder Title",
    description: "This is a placeholder description.",
    imageSrc: "/placeholder-image.png",
  }));

  const finalCards = [...cards, ...defaultCards];
  const totalPages = Math.ceil(finalCards.length / cardsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = finalCards.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="w-28 px-4 py-2 mx-2 rounded bg-gray-600 hover:bg-gray-400 active:scale-95 disabled:bg-gray-200"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="w-28 px-4 py-2 mx-2 rounded bg-gray-600 hover:bg-gray-400 active:scale-95 disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CardList;
export { Card, CardList };
