"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Edit2,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";

// Interfaces
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
  read: boolean;
}

interface ChatContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  messages: Message[];
  sendMessage: (text: string) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

// Chat Context
const ChatContext = React.createContext<ChatContextType | null>(null);

const ChatProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const sendMessage = (text: string) => {
    if (!selectedUser || !text.trim()) return;
    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    console.log("New message sent:", newMessage);
    // Simulate read receipt after 2 seconds
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, read: true } : msg
        )
      );
    }, 2000);
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        selectedUser,
        setSelectedUser,
        messages,
        sendMessage,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Fallback Users
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
  {
    id: 7,
    name: "Frank Miller",
    avatar: "/image/user3.png",
    online: true,
    role: "User",
  },
  {
    id: 8,
    name: "Grace Lee",
    avatar: "/image/user1.png",
    online: false,
    role: "Moderator",
  },
  {
    id: 9,
    name: "Henry Ford",
    avatar: "/image/user4.png",
    online: true,
    role: "Admin",
  },
  {
    id: 10,
    name: "Isabella Stone",
    avatar: "/image/user2.png",
    online: false,
    role: "User",
  },
  {
    id: 11,
    name: "Jack Daniels",
    avatar: "/image/user1.png",
    online: true,
    role: "Moderator",
  },
];

function InnerMessagesPage() {
  const {
    currentUser,
    setCurrentUser,
    selectedUser,
    setSelectedUser,
    messages,
    sendMessage,
    searchQuery,
    setSearchQuery,
  } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser.name);
  const [messageSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameChange = () => {
    const newName = tempName.trim();
    if (newName) {
      setCurrentUser((prev) => ({ ...prev, name: newName }));
      console.log(`Updated user name to: ${newName}`);
    }
    setIsEditingName(false);
  };

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
      setShowEmojiPicker(false);
      console.log("Message sent, text:", text);
    }
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setText((prev) => prev + emoji.native);
    console.log("Emoji selected:", emoji.native);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendMessage(`📎 File sent: ${file.name}`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      console.log("File uploaded:", file.name);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (selectedUser) {
      const timer = setTimeout(() => setIsTyping(false), 3000);
      setIsTyping(true);
      return () => clearTimeout(timer);
    }
  }, [selectedUser, selectedUser?.id]);

  const filteredUsers = fallbackUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(
    (msg) =>
      msg.text.toLowerCase().includes(messageSearchQuery.toLowerCase()) &&
      (msg.senderId === selectedUser?.id || msg.receiverId === selectedUser?.id)
  );

  return (
    <div className="sticky sm:p-0">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md w-full">
        <div className="flex items-center justify-between p-3 sm:p-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="md:hidden text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="relative">
              <Image
                src={currentUser.avatar}
                alt="Current user avatar"
                width={32}
                height={32}
                className="rounded-full sm:w-10 sm:h-10"
              />
              {currentUser.online && (
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-900" />
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {isEditingName ? (
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNameChange();
                    if (e.key === "Escape") {
                      setTempName(currentUser.name);
                      setIsEditingName(false);
                    }
                  }}
                  className="px-2 py-1 bg-transparent text-xs sm:text-sm font-semibold border-none focus:border-b focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-gray-800 dark:text-white"
                  autoFocus
                  aria-label="Edit user name"
                />
              ) : (
                <span
                  onClick={handleNameEdit}
                  className="text-xs sm:text-sm font-semibold cursor-text hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-white"
                >
                  {currentUser.name}
                </span>
              )}
              <Edit2
                size={14}
                className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 sm:w-5 sm:h-5"
                onClick={handleNameEdit}
                aria-label="Edit name"
              />
            </div>
          </div>
          <div className="justify-between xl:min-w-[130vh]">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              {selectedUser && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative">
                    <Image
                      src={selectedUser.avatar}
                      alt="Selected user avatar"
                      width={28}
                      height={28}
                      className="rounded-full sm:w-8 sm:h-8"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white dark:border-gray-900 ${
                        selectedUser.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="hidden sm:block w-[120px] justify-start">
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white">
                      {selectedUser.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedUser.role}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex lg:gap-6 sm:gap-2">
                <Phone
                  size={18}
                  className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 sm:w-5 sm:h-5"
                  aria-label="Phone call"
                />
                <Video
                  size={18}
                  className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 sm:w-5 sm:h-5"
                  aria-label="Video call"
                />
                <MoreVertical
                  size={18}
                  className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 sm:w-5 sm:h-5"
                  aria-label="More options"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 sm:pt-0 md:pt-0 sm:p-0">
        {/* Sidebar */}
        <div
          className={`w-full md:w-72 max-h-[80vh] lg:w-80 bg-gray-100 dark:bg-gray-900 shadow-md flex flex-col
            ${isSidebarOpen ? "block" : "hidden md:block"}
            fixed md:static top-16 left-0 z-40 md:z-auto
            h-[calc(100vh-4rem)] transition-transform duration-300
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            } scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900`}
        >
          <div className="p-3 sm:p-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 sm:w-5 sm:h-5"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border-none focus:ring-0 focus:border-b focus:border-blue-500 transition-colors duration-200 text-xs sm:text-sm text-gray-800 dark:text-white dark:placeholder-gray-400"
                aria-label="Search users"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[72vh] scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsSidebarOpen(false);
                  }}
                  className="p-3 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedUser(user);
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={36}
                        height={36}
                        className="rounded-full sm:w-12 sm:h-12"
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full border border-white dark:border-gray-900 ${
                          user.online ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.online ? "Active" : "Offline"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 max-h-[85vh] min-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-50 dark:scrollbar-track-gray-800">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm sm:text-base">
              Select a user to start chatting
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-3 sm:p-2 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-50 dark:scrollbar-track-gray-800">
                {filteredMessages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    {messageSearchQuery
                      ? "No messages match your search"
                      : "No messages yet"}
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        } animate-fade-in`}
                      >
                        <div className="flex items-end gap-1 sm:gap-2 max-w-[70%] sm:max-w-[60%]">
                          {!isMe && (
                            <Image
                              src={selectedUser.avatar}
                              alt="avatar"
                              width={28}
                              height={28}
                              className="rounded-full sm:w-8 sm:h-8"
                            />
                          )}
                          <div
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm shadow-md flex flex-col gap-1 ${
                              isMe
                                ? "bg-blue-500 dark:bg-blue-600 text-white"
                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            }`}
                          >
                            <div className="font-semibold">
                              {isMe ? "You" : selectedUser.name}
                            </div>
                            <p className="break-words">{msg.text}</p>
                            <div className="flex items-center gap-1 self-end text-[8px] sm:text-[10px] text-gray-300">
                              {msg.time}
                              {isMe && (
                                <CheckCircle
                                  size={10}
                                  className={
                                    msg.read
                                      ? "text-green-300"
                                      : "text-gray-400"
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    <Image
                      src={selectedUser.avatar}
                      alt="avatar"
                      width={28}
                      height={28}
                      className="rounded-full sm:w-8 sm:h-8"
                    />
                    <span>{selectedUser.name} is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 sm:p-2 bg-white dark:bg-gray-900 shadow-md">
                <div className="flex items-center gap-2 sm:gap-3 relative">
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 sm:bottom-16 left-0 z-50 shadow-lg animate-slide-up max-h-[40vh] sm:max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-white dark:scrollbar-track-gray-900">
                      <div className="flex justify-end p-2">
                        <button
                          onClick={() => setShowEmojiPicker(false)}
                          className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                          aria-label="Close emoji picker"
                        >
                          <X size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="auto"
                        previewPosition="none"
                        maxFrequentRows={2}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1"
                    aria-label="Toggle emoji picker"
                  >
                    <Smile size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <label htmlFor="fileUpload" className="cursor-pointer p-1">
                    <Paperclip
                      size={18}
                      className="text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors sm:w-5 sm:h-5"
                      aria-label="Attach file"
                    />
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 shadow-sm border-none focus:ring-0 focus:border-b focus:border-blue-500 transition-colors duration-200 text-xs sm:text-sm text-gray-800 dark:text-white dark:placeholder-gray-400"
                    aria-label="Message input"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-blue-600 dark:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-xs sm:text-sm"
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .scrollbar-thin {
          scrollbar-color: #4b5563 #1f2937;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default function MessagesPage() {
  const currentUser = {
    id: 1,
    name: "Jubayer Al Mahmud",
    avatar: "/image/mainuser.png",
    role: "Developer",
    online: true,
  };

  return (
    <ChatProvider initialUser={currentUser}>
      <InnerMessagesPage />
    </ChatProvider>
  );
}
