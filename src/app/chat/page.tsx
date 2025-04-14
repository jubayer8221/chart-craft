import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import { ChatProvider } from "@/components/context/ChatContext";

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <ChatSidebar />
        <div className="flex flex-col flex-1">
          <ChatWindow />
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  );
}
