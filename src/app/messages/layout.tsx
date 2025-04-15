"use client";

import ChatSidebar from "@/components/Chat/ChatSidebar";
import React from "react";

const currentUser = {
  avatar: "/image/user1.png", // update this if needed
  online: true,
};

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className="fixed top-1/12 left-1/6 w-full h-screen bg-white border-r border-gray-200 z-20">
        <ChatSidebar currentUser={currentUser} />
      </div>

      {/* Content Area (with left margin to avoid overlapping sidebar) */}
      <div className=" fixed top-1/12 h-screen bg-white border-r border-gray-200 z-20">
        {children}
      </div>
    </div>
  );
}
