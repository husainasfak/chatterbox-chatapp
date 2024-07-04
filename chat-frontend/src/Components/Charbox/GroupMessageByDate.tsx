import { ChatType } from "../../types";

import { format } from "date-fns";
import ChatMessage from "./ChatMessage";
import { cn } from "../../utils/tailwind-utils";
import { useEffect, useRef } from "react";

const ChatList = ({ messages }: { messages: ChatType[] }) => {

    const lastMessageRef = useRef<HTMLDivElement>(null);
  const groupedMessages = messages.reduce((acc, message) => {
    const date = format(new Date(message.createdAt), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, ChatType[]>);

  useEffect(() => {
    if (lastMessageRef && lastMessageRef.current) {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages]);

  return (
    <div className="chat-list">
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date}>
          <div className={cn("flex justify-center mt-4",)}>
            <p className={cn("bg-gray-600 text-white rounded-md p-1 px-3 text-sm")}>{format(new Date(date), "MMMM d, yyyy")}</p>
          </div>
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={lastMessageRef}/>
    </div>
  );
};

export default ChatList;