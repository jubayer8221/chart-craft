"use client";

import React from "react";
import { FC } from "react";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import Image from "next/image";
import { useChat } from "../context/ChatContext";
import MessageInput from "./MessageInput";

interface User {
  name: string;
  avatar: string;
  online: boolean;
  role: string;
}

interface ChatHeaderProps {
  currentUser: User;
  selectedUser: User;
}

const ChatWindow: FC<ChatHeaderProps> = ({ selectedUser }) => {
  const { messages, currentUser } = useChat();
  // const { currentUser, setSelectedUser, messages } = useChat();

  return (
    <div className="flex flex-col justify-between p-2 h-[80%] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto">
      {/* Header */}
      <div className="flex w-full h-[10%] items-center justify-between shadow-sm pb-2 bg-gray-100 z-10 p-3 border-b border-gray-300">
        <div className="flex items-center w-full gap-3 justify-start">
          <div className="relative">
            <Image
              src={selectedUser.avatar}
              alt="selected user"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                selectedUser.online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <div className="text-sm font-semibold">{selectedUser.name}</div>
            <div className="text-xs text-gray-500">{selectedUser.role}</div>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 w-full justify-end">
          <Phone className="w-5 h-5 cursor-pointer text-gray-600" />
          <Video className="w-5 h-5 cursor-pointer text-gray-600" />
          <Search className="w-5 h-5 cursor-pointer text-gray-600" />
          <MoreVertical className="w-5 h-5 cursor-pointer text-gray-600" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[75%] pr-3">
        {messages.map((message) => {
          const isMe = message.senderId === currentUser.id;
          return (
            <div key={message.id}>
              <div className="flex gap-4">
                {!isMe && (
                  <div className="flex items-start gap-2 bg-none">
                    <Image
                      src={selectedUser.avatar}
                      alt="receiver avatar"
                      width={30}
                      height={30}
                      className="rounded-full self-center"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[60%] px-4 py-2 rounded-xl text-sm text-wrap ${
                    isMe
                      ? "bg-blue-500 text-white ml-auto text-right"
                      : "bg-gray-200 text-gray-800 mr-auto text-left"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">
                    {message.text}
                  </p>

                  <div
                    className={`text-[10px] ${
                      isMe ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;
