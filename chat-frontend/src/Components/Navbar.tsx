import { BellElectric, BotMessageSquare } from "lucide-react"
import { useAuth } from "../context/UserProvider"
import Avatar from "./Avatar"
import Logo from "./Logo"
import { useSocket } from "../context/SocketProvider"
import { User } from "../types"
import AvatarGroup from "./Avatar/AvatarGroup"



const Navbar = () => {
     const { user } = useAuth()
     const { connectedUser } = useSocket()
     return (
          <div className="bg-white h-[60px]  px-3 py-2 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-2">
                    <BotMessageSquare /> <Logo />
               </div>

               <div className="flex">
                    <AvatarGroup>
                         {connectedUser && connectedUser?.filter(u => u.id !== user?.id)?.map((user: User) =>
                              <Avatar key={user?.id} src={user?.imageUrl} className="border-black border-[2.5px]" isOnline={true} />
                         )}
                    </AvatarGroup>
               </div>
               {
                    user && <div className="flex items-center gap-5">
                         <BellElectric className="cursor-pointer"/>
                         <Avatar src={user?.imageUrl} />
                    </div>
               }







          </div>
     )
}

export default Navbar