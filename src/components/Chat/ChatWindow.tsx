"use client";
import React from "react";
import { FC } from "react";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import Image from "next/image";
import { useChat } from "../context/ChatContext";
// import { users } from "../Chat/ChatSidebar";

interface User {
  name: string;
  avatar: string;
  online: boolean;
  role: string;
}

interface ChatHeaderProps {
  currentUser: User;
  selectedUser: User;
}

const User = {
  avatar: "/image/user1.png",
  online: true,
};

const ChatWindow: FC<ChatHeaderProps> = ({ selectedUser }) => {
  const { messages } = useChat();

  return (
    <div className="flex-1 flex flex-col justify-between p-2 py-2 h-[500px]">
      <div className="flex w-full items-center justify-between mb-4 shadow-lg pb-2">
        <div className="flex items-center gap-3 w-1/3 justify-center">
          <div className="relative">
            <Image
              src={selectedUser.avatar}
              alt="selected user"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                selectedUser.online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <div className="text-sm font-semibold">{selectedUser.name}</div>
            <div className="text-xs text-gray-500">{selectedUser.role}</div>
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-4 w-1/3 justify-end">
          <Phone className="w-5 h-5 cursor-pointer text-gray-600" />
          <Video className="w-5 h-5 cursor-pointer text-gray-600" />
          <Search className="w-5 h-5 cursor-pointer text-gray-600" />
          <MoreVertical className="w-5 h-5 cursor-pointer text-gray-600" />
        </div>
      </div>
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
};

export default ChatWindow;
