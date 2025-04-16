"use client";

// import ChatSidebar from "@/components/Chat/ChatSidebar";
import React from "react";

// const currentUser = {
//   avatar: "/image/user1.png", // update this if needed
//   online: true,
// };

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar Area */}
      {/* <div className="w-64 bg-gray-800 text-white">Sidebar</div> */}
      {/* Content Area (with left margin to avoid overlapping sidebar) */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
