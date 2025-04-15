"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Interfaces
interface Message {
  id: number;
  userId: number; // Recipient ID
  senderId: number; // Sender ID
  text: string;
  time: string;
  read: boolean;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

interface ChatContextProps {
  messages: Message[];
  sendMessage: (text: string) => void;
  markAsRead: (userId: number) => void;
  currentUser: User;
  selectedUserId: number;
  setSelectedUserId: (id: number) => void;
}

// Create context
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Props for Provider
export interface ChatProviderProps {
  children: ReactNode;
  currentUser: User;
  selectedUserId: number;
  setSelectedUserId: (id: number) => void;
}

// Provider Component
export const ChatProvider = ({
  children,
  currentUser,
  selectedUserId,
  setSelectedUserId,
}: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>(() => [
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
      senderId: 2,
      text: "Do you want to catch up later?",
      time: "1:50 PM",
      read: false,
    },
    {
      id: 4,
      userId: 2,
      senderId: currentUser.id,
      text: "Sure, let's do it.",
      time: "1:52 PM",
      read: false,
    },
  ]);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      userId: selectedUserId,
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
        selectedUserId,
        setSelectedUserId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use the context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
