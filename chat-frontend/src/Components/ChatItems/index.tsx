import { useEffect, useState } from "react"

import One2One from "./One2One"
import Search from "./Search"
import api from "../../utils/axiosInstance"
import './index.css'
import { SelectedConversationProp } from "../../types"
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
     return (
          <div className="flex flex-col gap-3 h-full">
               <Search search={search} setSearch={setSearch} />


               <One2One chats={chats} setSelectedConversation={setSelectedConversation} selectedConversation={selectedConversation} />



               {/* <Group /> */}
          </div>
     )
}

export default ChatItems