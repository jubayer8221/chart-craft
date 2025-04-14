"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
}

interface ChatContextProps {
  messages: Message[];
  sendMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "me",
      text: "Can I get details of my last transaction I made last month?",
      time: "1:46 PM",
    },
    {
      id: 2,
      sender: "other",
      text: "We need to check if we can provide you such information.",
      time: "1:46 PM",
    },
    {
      id: 3,
      sender: "other",
      text: "I will inform you as I get update on this.",
      time: "1:46 PM",
    },
  ]);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
