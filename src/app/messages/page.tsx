"use client";

import React, { useState } from "react";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import { ChatProvider } from "@/components/context/ChatContext";

// Define the User interface
interface User {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  role: string;
}

// Mock data for the current user
const currentUser: User = {
  id: 1,
  name: "John Doe",
  avatar: "/image/user1.png",
  online: true,
  role: "Developer",
};

// Mock data for the selected user
const selectedUser: User = {
  id: 2,
  name: "Alice Johnson",
  avatar: "/image/user1.png",
  online: true,
  role: "Designer",
};

const MessagesPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number>(selectedUser.id);

  return (
    <ChatProvider
      currentUser={currentUser}
      selectedUserId={selectedUserId}
      setSelectedUserId={setSelectedUserId}
    >
      <div className="flex h-screen">
        <div className="flex flex-col flex-1 fixed top-1/12 left-2/5 right-0 bottom-0 ml-1/5 mt-1/12">
          <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default MessagesPage;
