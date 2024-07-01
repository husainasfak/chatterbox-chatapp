import { useState } from "react";
import { UserType } from "../../types";
import Avatar from "../Avatar";
import Group from "./Group";
import { cn } from "../../utils/tailwind-utils";
import { Mail, Users } from "lucide-react";


type Props = {
     chats: UserType[];
     selectedConversation?: UserType | null;
     setSelectedConversation: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const One2One = ({ chats, selectedConversation, setSelectedConversation }: Props) => {
     const [select, setSelect] = useState('people')
     const handleSelect = (type: string) => {
          setSelect(type)
     }
     return (
          <div className="bg-white rounded-2xl overflow-hidden h-full">
               <div className="flex sticky top-0">
                    <div className={cn(`px-4 py-4 bg-white cursor-pointer`, `${select === 'people' && ' border-b-primary border-b-2'}`)} onClick={() => handleSelect('people')}>
                         <p className={cn(`tracking-wide`, `${select === 'people' && 'font-bold text-primary'}`)}>People</p>
                    </div>
                    <div className={cn(`px-4 py-4 bg-white cursor-pointer`, `${select === 'group' && ' border-b-primary border-b-2'}`)} onClick={() => handleSelect('group')}>
                         <p className={cn(`tracking-wide`, `${select === 'group' && 'font-bold text-primary'}`)}>Group</p>
                    </div>
               </div>
               <hr />
               <div className="overflow-y-auto max-h-[430px] min-h-[430px]">
                    {
                         select === 'people' ? <>
                              {chats.map(chat => <div key={chat?.id} className={`transition-all delay-75 pl-4 py-1 cursor-pointer flex items-center gap-5 my-2  ${selectedConversation?.id === chat.id ? 'bg-[#000] text-white rounded-md' : 'hover:bg-[#2751ac13]'}`} onClick={() => setSelectedConversation(chat)}>
                                   <Avatar src={chat?.imageUrl} />
                                   <div>
                                        <p className="text-lg">{chat?.userName}</p>
                                        <p className="text-xs text-gray-400">last online at </p>
                                   </div>
                              </div>)}
                         </> : <Group />
                    }

               </div>
               <hr />
               {
                    select === 'people' ? <div className="flex items-center gap-2 justify-center px-4 pt-3 cursor-pointer">
                         <Mail size={18} />
                         <p className="mb-[3px]"> Invite people</p>
                    </div> : <div className="flex items-center gap-2 justify-center px-4 pt-3 cursor-pointer">
                         <Users size={18} />
                         <p className="mb-[3px]">Create a group</p>
                    </div>
               }

          </div>
     )
}

export default One2One