"use client";

import { FC } from "react";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import Image from "next/image";

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

const ChatHeader: FC<ChatHeaderProps> = ({ currentUser, selectedUser }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white shadow-sm">
      {/* Left: Current User */}
      <div className="flex items-center gap-2 w-1/3">
        <div className="relative">
          <Image
            src={currentUser.avatar}
            alt="current user"
            width={40}
            height={40}
            className="rounded-full"
          />
          {currentUser.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 w-full border border-gray-300 rounded-full focus:outline-none focus:ring"
          onChange={(e) => {
            const searchValue = e.target.value.toLowerCase();
            const filteredUsers = [selectedUser].filter((user) =>
              user.name.toLowerCase().includes(searchValue)
            );
            console.log(filteredUsers); // Replace this with your desired action
          }}
        />
      </div>

      {/* Middle: Selected User Info */}
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
  );
};

export default ChatHeader;
