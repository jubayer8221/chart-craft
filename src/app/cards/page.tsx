import React from "react";
import CardList from "../../components/Cards/CardList";
import { myCards } from "../cards/data";

export default function CardsPage() {
  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Card Showcase</h1>
      <CardList cards={myCards} />
    </main>
  );
}
