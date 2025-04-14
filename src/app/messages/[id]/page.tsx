// app/message/[id]/page.tsx
import { users } from "@/components/Chat/ChatSidebar"; // adjust path if needed
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default function MessagePage({ params }: PageProps) {
  const userId = parseInt(params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) return notFound();

  return (
    <div className="p-6 mt-10">
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      <p className="text-lg text-gray-700">📩 {user.message}</p>
    </div>
  );
}
