"use client";

import Image from "next/image";
// At top of ChatSidebar.tsx
import { User } from "../context/ChatContext"; // use this consistently

import { User as ContextUser } from "../context/ChatContext"; // Import shared User type
import { Message, User as ChatUser } from "../context/ChatContext";

interface ChatSidebarProps {
  currentUser: {
    avatar: string;
    online: boolean;
  };
  onSelectUser: (user: ChatUser) => void;
  messages: Message[];
  usersList?: ContextUser[];
}

// Fallback static list if not passed via props
const fallbackUsers: ContextUser[] = [
  {
    id: 2,
    name: "Alice Johnson",
    avatar: "/image/user2.png",
    online: true,
    role: "Admin",
  },
  {
    id: 3,
    name: "Bob Smith",
    avatar: "/image/user3.png",
    online: false,
    role: "User",
  },
  {
    id: 4,
    name: "Charlie Brown",
    avatar: "/image/user4.png",
    online: true,
    role: "Moderator",
  },
  {
    id: 5,
    name: "Diana Prince",
    avatar: "/image/user1.png",
    online: false,
    role: "User",
  },
  {
    id: 6,
    name: "Eve Adams",
    avatar: "/image/user2.png",
    online: true,
    role: "Admin",
  },
];

export default function ChatSidebar({
  currentUser,
  onSelectUser,
  usersList = fallbackUsers,
}: ChatSidebarProps) {
  return (
    <div className="w-full h-screen bg-gray-100 shadow-lg rounded-lg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 h-16 bg-gray-100 z-10 p-3 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={currentUser.avatar}
              alt="Current user"
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
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {usersList.map((user: User) => (
          <div
            key={user.id}
            className="cursor-pointer"
            onClick={() => onSelectUser(user)}
          >
            <div className="mb-1 flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <div className="relative mr-3">
                <Image
                  width={45}
                  height={45}
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    user.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-800">
                    {user.name}
                  </span>
                  <span
                    className={`text-xs ${
                      user.online ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {user.online ? "Active" : "Offline"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {/* {getLastMessage(user.id)} */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
