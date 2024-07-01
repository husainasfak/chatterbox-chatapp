import { CheckCheck, Circle } from "lucide-react";
import { ChatType } from "../../types";
import { useAuth } from "../../context/UserProvider";

const ChatMessage = ({ message }: { message: ChatType }) => {
     const { user } = useAuth()
     return <>
          <div className={`py-2 flex ${user?.id !== message.senderId ? 'justify-start' : 'justify-end'}`}>
               <div>
                    <div className={`text-xs ${user?.id !== message.senderId && 'flex justify-end'}`}>
                         <div className="flex items-center gap-1">
                              <p className="text-[12px]">1m ago</p> <Circle fill="black" size={5} />
                              <CheckCheck size={10} />
                         </div>
                    </div>
                    <div className={`max-w-xs p-2 px-4 rounded-xl text-sm ${user?.id !== message.senderId ? 'bg-primary text-white rounded-tl-none' : 'bg-white text-black rounded-br-none'}`}>
                         {message.content}
                    </div>

               </div>
          </div>

     </>
};
export default ChatMessage