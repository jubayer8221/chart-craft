"use client";
import { useState } from "react";
import { useChat } from "../context/ChatContext";

export default function MessageInput() {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-100 shadow-lg rounded-lg">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 border rounded-xl px-4 py-2"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Send
      </button>
    </div>
  );
}
