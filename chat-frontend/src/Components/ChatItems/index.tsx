import { useEffect, useState } from "react"

import One2One from "./One2One"
import Search from "./Search"
import api from "../../utils/axiosInstance"
import './index.css'
import { SelectedConversationProp } from "../../types"
import { cn } from "../../utils/tailwind-utils"
import Group from "./Group"
import { Mail, Users } from "lucide-react"
const ChatItems = ({ selectedConversation, setSelectedConversation }: SelectedConversationProp) => {
     const [search, setSearch] = useState('');
     const [chats, setChats] = useState([])
     const getAllUsers = async () => {
          try {
               const { data } = await api.get(`/user/all?search=${search}`);
               console.log('userss', data)
               setChats(data?.users)
          } catch (error) {
               console.log(error)
          }

     }
     useEffect(() => {
          getAllUsers()
     }, [search])


     const [select, setSelect] = useState('people')
     const handleSelect = (type: string) => {
          setSelect(type)
     }
     return (
          <div className="flex flex-col gap-3 h-full">
               <Search search={search} setSearch={setSearch} />

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
                                   <One2One chats={chats} setSelectedConversation={setSelectedConversation} selectedConversation={selectedConversation} />
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

          </div>
     )
}

export default ChatItems