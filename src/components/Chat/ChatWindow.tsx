"use client";
import React from "react";
import { useChat } from "../context/ChatContext";
// import { users } from "../Chat/ChatSidebar";
export default function ChatWindow() {
  const { messages } = useChat();

  return (
    <div className="flex-1 flex flex-col justify-between p-4 h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 max-h-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[60%] min-w-auto px-4 py-2 rounded-xl text-white ${
              msg.sender === "me"
                ? "bg-blue-500 ml-auto text-right"
                : "bg-gray-600 text-black"
            }`}
          >
            {msg.text}
            <div className="text-xs text-gray-300 mt-1">{msg.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
