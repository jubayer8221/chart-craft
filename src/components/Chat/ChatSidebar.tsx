"use client";

import Image from "next/image";
import Link from "next/link";

export interface User {
  id: number;
  name: string;
  message: string;
  image: string;
  isActive: boolean;
}

export const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    message: "Hey, how are you?",
    image: "/image/user1.png",
    isActive: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    message: "Let's catch up later.",
    image: "/image/user2.png",
    isActive: false,
  },
  {
    id: 3,
    name: "Charlie Brown",
    message: "Can you send me the files?",
    image: "/image/user3.png",
    isActive: true,
  },
  {
    id: 4,
    name: "Diana Prince",
    message: "Meeting at 3 PM.",
    image: "/image/user4.png",
    isActive: false,
  },
  {
    id: 5,
    name: "Eve Adams",
    message: "Thanks for the update!",
    image: "/image/user1.png",
    isActive: true,
  },
];

interface ChatSidebarProps {
  currentUser: {
    avatar: string;
    online: boolean;
  };
}

export default function ChatSidebar({ currentUser }: ChatSidebarProps) {
  return (
    <div className="w-full md:w-1/5 h-screen bg-gray-100 shadow-lg rounded-lg flex flex-col">
      {/* Fixed Header Section */}
      <div className="sticky top-0 bg-gray-100 z-10 p-3 border-b border-gray-300">
        <div className="flex items-center gap-2">
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
          />
        </div>
      </div>

      {/* Scrollable User List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {users.map((user) => (
          <Link key={user.id} href={`/message/${user.id}`} className="block">
            <div className="mb-1 flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <div className="relative mr-3">
                <Image
                  width={45}
                  height={45}
                  src={user.image}
                  alt={user.name}
                  className="rounded-full"
                  unoptimized
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    user.isActive ? "bg-green-500" : "bg-gray-400"
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
                      user.isActive ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {user.isActive ? "Active" : "Offline"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{user.message}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
