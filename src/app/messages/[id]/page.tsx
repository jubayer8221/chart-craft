"use client";

import { users } from "@/components/Chat/ChatSidebar";
import { notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function MessagePage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);
  const user = users.find((u) => u.id === userId);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([user?.message || ""]);

  if (!user) return notFound();

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={user.image}
          alt={user.name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="bg-gray-100 p-3 rounded-lg w-fit max-w-lg shadow"
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
