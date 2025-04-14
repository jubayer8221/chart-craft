import React from "react";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import { ChatProvider } from "@/components/context/ChatContext";

const MessagesPage = () => {
  return (
    <>
      <ChatProvider>
        <div className="flex h-screen">
          <div className="fixed w-full h-full">
            <ChatSidebar />
          </div>
          <div className="flex flex-col flex-1 fixed top-1/12 left-2/5 right-0 bottom-0 ml-1/5 mt-1/12">
            <ChatWindow />
            <MessageInput />
          </div>
        </div>
      </ChatProvider>
    </>
  );
};

export default MessagesPage;
