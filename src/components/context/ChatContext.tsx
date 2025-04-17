"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
  id: number;
  userId: number; // Recipient ID
  senderId: number; // Sender ID
  text: string;
  time: string;
  read: boolean;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
}

export interface ChatContextProps {
  messages: Message[];
  sendMessage: (text: string) => void;
  markAsRead: (userId: number) => void;
  currentUser: User;
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  usersList: User[];
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export interface ChatProviderProps {
  children: ReactNode;
  currentUser: User;
}

// Dummy users list (you can load this from a real source)
export const dummyUsers: User[] = [
  {
    id: 2,
    name: "Alice",
    avatar: "/image/user2.png",
    role: "Admin",
    online: true,
  },
  {
    id: 3,
    name: "Bob",
    avatar: "/image/user3.png",
    role: "User",
    online: false,
  },
  {
    id: 4,
    name: "Charlie",
    avatar: "/image/user4.png",
    role: "Moderator",
    online: true,
  },
  {
    id: 5,
    name: "Diana",
    avatar: "/image/user5.png",
    role: "User",
    online: true,
  },
  {
    id: 6,
    name: "Eve",
    avatar: "/image/user6.png",
    role: "Admin",
    online: true,
  },
  {
    id: 7,
    name: "Frank",
    avatar: "/image/user7.png",
    role: "User",
    online: true,
  },
  {
    id: 8,
    name: "Grace",
    avatar: "/image/user8.png",
    role: "Moderator",
    online: true,
  },
  {
    id: 9,
    name: "Henry",
    avatar: "/image/user9.png",
    role: "User",
    online: false,
  },
];

export const ChatProvider = ({ children, currentUser }: ChatProviderProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      userId: currentUser.id,
      senderId: 2,
      text: "Hey, how are you?",
      time: "1:46 PM",
      read: true,
    },
    {
      id: 2,
      userId: 2,
      senderId: currentUser.id,
      text: "I'm good, thanks!",
      time: "1:47 PM",
      read: true,
    },
    {
      id: 3,
      userId: currentUser.id,
      senderId: 3,
      text: "Do you want to catch up later?",
      time: "1:50 PM",
      read: false,
    },
    {
      id: 4,
      userId: 4,
      senderId: currentUser.id,
      text: "Sure, let's do it.",
      time: "1:52 PM",
      read: false,
    },
    {
      id: 5,
      userId: currentUser.id,
      senderId: 5,
      text: "Are you coming to the meeting?",
      time: "2:00 PM",
      read: false,
    },
    {
      id: 6,
      userId: 6,
      senderId: currentUser.id,
      text: "Yes, I'll be there in 10 minutes.",
      time: "2:05 PM",
      read: false,
    },
    {
      id: 7,
      userId: currentUser.id,
      senderId: 7,
      text: "Can you review the document I sent?",
      time: "2:10 PM",
      read: false,
    },
    {
      id: 8,
      userId: 8,
      senderId: currentUser.id,
      text: "Sure, I'll check it out now.",
      time: "2:15 PM",
      read: false,
    },
    {
      id: 9,
      userId: currentUser.id,
      senderId: 9,
      text: "Don't forget about the deadline tomorrow.",
      time: "2:20 PM",
      read: false,
    },
  ]);

  const sendMessage = (text: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: messages.length + 1,
      userId: selectedUser.id,
      senderId: currentUser.id,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };
    setMessages([...messages, newMessage]);
  };

  const markAsRead = (userId: number) => {
    setMessages(
      messages.map((msg) =>
        msg.userId === currentUser.id && msg.senderId === userId && !msg.read
          ? { ...msg, read: true }
          : msg
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        markAsRead,
        currentUser,
        selectedUser,
        setSelectedUser,
        usersList: dummyUsers, // ✅ Provide it here
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
