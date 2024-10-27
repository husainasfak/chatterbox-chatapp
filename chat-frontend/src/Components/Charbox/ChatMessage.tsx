// import { CheckCheck, Circle } from "lucide-react";
import { ChatType } from "../../types";
import { useAuth } from "../../context/UserProvider";
import { format } from "date-fns";

const ChatMessage = ({ message }: { message: ChatType }) => {
     const { user } = useAuth()
     return <>
          {
               message && <div className={`py-2 flex ${user?.id !== message.senderId ? 'justify-start' : 'justify-end'}`}>
                    <div>
                         <div className={`max-w-xs p-2 px-4 rounded-xl text-[14px] flex items-end ${user?.id !== message.senderId ? 'bg-primary text-white rounded-tl-none' : 'bg-white text-black rounded-br-none '}`}>
                              <div>
                                   {message.content}
                              </div>

                              <div className={`text-xs  flex justify-end ml-3`}>
                                   <div className="flex items-center gap-1">
                                        <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{format(new Date(message?.createdAt), "hh:mm a")}</span>
                                        {/* <Circle fill="black" size={5} />
                                   <CheckCheck size={10} /> */}
                                   </div>
                              </div>
                         </div>

                    </div>
               </div>
          }


     </>
};
export default ChatMessage