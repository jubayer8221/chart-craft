"use client";

import Image from "next/image";
import Link from "next/link";

interface User {
  id: number; // Unique identifier for each user
  name: string;
  message: string;
  image: string; // User profile image
  isActive: boolean; // Active status
}

export const users: User[] = [
  {
    id: 1,
    name: "Harriet McBride",
    message: "If it takes long you can mail...",
    image: "/image/user2.png",
    isActive: true,
  },
  {
    id: 2,
    name: "John Doe",
    message: "Let me know when you're free.",
    image: "/image/user1.png",
    isActive: false,
  },
  {
    id: 3,
    name: "Jane Smith",
    message: "Looking forward to our meeting.",
    image: "/image/user3.png",
    isActive: true,
  },
  {
    id: 4,
    name: "Alice Johnson",
    message: "Can we reschedule our meeting?",
    image: "/image/user4.png",
    isActive: true,
  },
  {
    id: 5,
    name: "Michael Brown",
    message: "I'll call you later today.",
    image: "/image/user1.png",
    isActive: false,
  },
  {
    id: 6,
    name: "Emily Davis",
    message: "Thanks for the update!",
    image: "/image/user2.png",
    isActive: true,
  },
  {
    id: 7,
    name: "Chris Wilson",
    message: "Can you send me the files?",
    image: "/image/user3.png",
    isActive: false,
  },
  {
    id: 8,
    name: "Sophia Martinez",
    message: "Great job on the presentation!",
    image: "/image/user4.png",
    isActive: true,
  },
  {
    id: 9,
    name: "Daniel Lee",
    message: "I'll review the document soon.",
    image: "/image/user1.png",
    isActive: false,
  },
  {
    id: 10,
    name: "Olivia Taylor",
    message: "Can we discuss this tomorrow?",
    image: "/image/user2.png",
    isActive: true,
  },
  {
    id: 11,
    name: "Liam Harris",
    message: "Please check your inbox.",
    image: "/image/user2.png",
    isActive: false,
  },
  {
    id: 12,
    name: "Ava Clark",
    message: "Meeting has been rescheduled.",
    image: "/image/user3.png",
    isActive: true,
  },
  {
    id: 13,
    name: "Ethan Walker",
    message: "Let me know your thoughts.",
    image: "/image/user4.png",
    isActive: false,
  },
];

export default function ChatSidebar() {
  return (
    <div className="w-1/5 bg-gray-100 p-1 shadow-lg rounded-lg max-h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
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
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  user.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-800">{user.name}</span>
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
  );
}
