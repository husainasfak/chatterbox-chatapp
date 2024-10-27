
import { useSocket } from "../../context/SocketProvider";
import { useAuth } from "../../context/UserProvider";
import { UserType } from "../../types";
import Avatar from "../Avatar";


type Props = {
     chats: UserType[];
     selectedConversation?: UserType | null;
     setSelectedConversation: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const One2One = ({ chats, selectedConversation, setSelectedConversation }: Props) => {
     const {user} = useAuth()
     const { connectedUser } = useSocket()
     const isOnline = (id:string) => {
          const online = connectedUser.find(user => user.id === id)
          if (online) {
               return true
          }
          return false
     }
     return (
          <>
               {chats.filter(chat=>chat.id !== user?.id).map(chat => <div key={chat?.id} className={`transition-all delay-75 pl-4 py-1 cursor-pointer flex items-center gap-5 my-2  ${selectedConversation?.id === chat.id ? 'bg-[#000] text-white rounded-md' : 'hover:bg-[#2751ac13]'}`} onClick={() => setSelectedConversation(chat)}>
                    <Avatar src={chat?.imageUrl} />
                    <div>
                         <p className="text-lg">{chat?.userName}</p>
                         {
                              isOnline(chat.id) ? <div className="flex items-center gap-1">
                                   <div className="w-[8px] h-[8px] bg-green-700 rounded-full"></div>
                                   <p className="text-xs text-gray-400">online</p>
                              </div> : null
                         }

                    </div>
               </div>)}
          </>
     )
}

export default One2One