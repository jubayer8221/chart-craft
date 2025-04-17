"use client";

import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatWindow from "@/components/Chat/ChatWindow";
import { ChatProvider } from "@/components/context/ChatContext";
import { useChat } from "@/components/context/ChatContext";

export default function ChatPage() {
  return (
    <ChatProvider
      currentUser={{
        id: 1,
        name: "Alice Johnson",
        avatar: "/image/user4.png",
        role: "Developer",
        online: true,
      }}
    >
      <ChatPageContent />
    </ChatProvider>
  );
}

function ChatPageContent() {
  // const { currentUser, selectedUser } = useChat();
  const { currentUser, selectedUser, setSelectedUser, messages } = useChat();
  return (
    <div className="flex h-screen w-full">
      <div className="fixed top-1/12 left-2/12 h-screen z-20">
        <ChatSidebar
          currentUser={currentUser}
          onSelectUser={setSelectedUser}
          messages={messages}
        />
      </div>
      <div className="fixed top-[6%] left-[11%] w-[100%] h-[106%] z-10 flex flex-col">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chat
          </div>
        )}
      </div>
    </div>
  );
}
