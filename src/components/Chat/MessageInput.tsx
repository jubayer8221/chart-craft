"use client";

import { useState } from "react";
import { useChat } from "../context/ChatContext";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Paperclip, Smile } from "lucide-react";

interface EmojiData {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords?: string[];
}

export default function MessageInput() {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleEmojiSelect = (emoji: EmojiData) => {
    setText((prev) => prev + emoji.native);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendMessage(`📎 File sent: ${file.name}`);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-100 shadow-lg rounded-lg flex-wrap sm:flex-nowrap relative">
      {/* Emoji button */}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="text-xl"
      >
        <Smile size={24} />
      </button>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}

      {/* File Upload */}
      <label htmlFor="fileUpload" className="cursor-pointer text-xl">
        <Paperclip size={24} />
      </label>
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Message input */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 bg-white shadow-lg border rounded-xl px-4 py-2"
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Send
      </button>
    </div>
  );
}
