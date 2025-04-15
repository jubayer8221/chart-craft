import ChatSidebar from "@/components/Chat/ChatSidebar";
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

const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <ChatSidebar currentUser={currentUser} />
        <div className="flex flex-col flex-1">
          <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
          <MessageInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
