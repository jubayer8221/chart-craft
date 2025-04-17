"use client";

import React, { useState } from "react";
import Image from "next/image";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Phone,
  Video,
  MoreVertical,
  Search,
  Smile,
  Paperclip,
} from "lucide-react";

// Simulated context (replace with actual useChat context if needed)
interface ChatContextType {
  currentUser: User;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  messages: Message[];
  sendMessage: (text: string) => void;
}

const ChatContext = React.createContext<ChatContextType | null>(null);

const ChatProvider = ({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User;
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (text: string) => {
    if (!selectedUser) return;
    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        selectedUser,
        setSelectedUser,
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => React.useContext(ChatContext);

interface User {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  role: string;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  time: string;
}

// Fallback users
const fallbackUsers: User[] = [
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

export default function ChatPage() {
  const currentUser = {
    id: 1,
    name: "Alice Johnson",
    avatar: "/image/user4.png",
    role: "Developer",
    online: true,
  };

  return (
    <ChatProvider currentUser={currentUser}>
      <div className="flex h-screen w-full">
        <div className="w-1/4 bg-gray-100 shadow-md">
          <ChatSidebar usersList={fallbackUsers} />
        </div>
        <div className="w-3/4">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}

function ChatSidebar({ usersList }: { usersList: User[] }) {
  const chatContext = useChat();
  if (!chatContext) {
    return <div>Error: Chat context is not available.</div>;
  }
  const { currentUser, setSelectedUser } = chatContext;

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 p-3 shadow-md flex items-center gap-2 bg-white">
        <div className="relative">
          <Image
            src={currentUser.avatar}
            alt="avatar"
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
          className="px-3 py-1 w-full rounded-full focus:outline-none shadow-sm"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {usersList.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="p-2 hover:bg-gray-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={45}
                  height={45}
                  className="rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    user.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {user.online ? "Active" : "Offline"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow() {
  const chatContext = useChat();
  if (!chatContext) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Error: Chat context is not available.
      </div>
    );
  }
  const { selectedUser, currentUser, messages } = chatContext;

  if (!selectedUser)
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a user to start chatting.
      </div>
    );

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 shadow-md bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={selectedUser.avatar}
              alt="avatar"
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
            <div className="font-semibold">{selectedUser.name}</div>
            <div className="text-xs text-gray-500">{selectedUser.role}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Phone className="text-gray-500" />
          <Video className="text-gray-500" />
          <Search className="text-gray-500" />
          <MoreVertical className="text-gray-500" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start gap-2">
                {!isMe && (
                  <Image
                    src={selectedUser.avatar}
                    alt="avatar"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}
                <div
                  className={`max-w-[60%] px-4 py-2 rounded-xl text-sm break-words overflow-wrap break-word whitespace-pre-wrap ${
                    isMe
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[10px] ${
                      isMe ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 shadow-md bg-white">
        <MessageInput />
      </div>
    </div>
  );
}

function MessageInput() {
  const chatContext = useChat();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!chatContext) {
    return <div>Error: Chat context is not available.</div>;
  }
  const { sendMessage } = chatContext;

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
    }
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setText((prev) => prev + emoji.native);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendMessage(`📎 File sent: ${file.name}`);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        <Smile size={24} />
      </button>
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}

      <label htmlFor="fileUpload" className="cursor-pointer">
        <Paperclip size={24} />
      </label>
      <input
        id="fileUpload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 rounded-xl px-4 py-2 shadow-sm break-words overflow-wrap break-word"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md"
      >
        Send
      </button>
    </div>
  );
}
