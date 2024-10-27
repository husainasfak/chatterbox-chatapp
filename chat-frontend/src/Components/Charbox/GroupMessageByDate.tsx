import { ChatType } from "../../types";

import { format } from "date-fns";
import ChatMessage from "./ChatMessage";
import { cn } from "../../utils/tailwind-utils";
import { useEffect, useRef } from "react";
import TypingLoader from "../TypingLoader";
import { useSocket } from "@/context/SocketProvider";
import { useAuth } from "@/context/UserProvider";

const ChatList = ({ messages }: { messages: ChatType[] }) => {
  const { typingUser } = useSocket();
  const { user } = useAuth()
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

          {
            typingUser?.id === user?.id && typingUser?.isTyping && <div className={`py-2 flex justify-start`}>
              <div>
                <div className={`max-w-xs py-3 px-4 rounded-xl text-[14px] flex items-end bg-primary text-white rounded-tl-none`}>
                  <div>
                    <TypingLoader />
                  </div>
                </div>
              </div>
            </div>
          }

        </div>
      ))}
      <div ref={lastMessageRef} />
    </div>
  );
};

export default ChatList;