"use client";

import React from "react";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import { ChatProvider } from "@/components/context/ChatContext";

// Define the User interface
interface User {
  name: string;
  avatar: string;
  online: boolean;
  role: string;
}

// Define the props for ChatWindow

// Mock data for the current user
const currentUser: User = {
  name: "John Doe",
  avatar: "/image/user1.png",
  online: true,
  role: "Developer",
};

// Mock data for the selected user
const selectedUser: User = {
  name: "Alice Johnson",
  avatar: "/image/user1.png",
  online: true,
  role: "Designer",
};

const MessagesPage: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        {/* Uncomment the ChatSidebar if needed */}
        {/* <div className="fixed w-full h-full">
          <ChatSidebar />
        </div> */}
        <div className="flex flex-col flex-1 fixed top-1/12 left-2/5 right-0 bottom-0 ml-1/5 mt-1/12">
          {/* Pass currentUser and selectedUser to ChatWindow */}
          <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default MessagesPage;
