import { BotMessageSquare } from "lucide-react"
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
          <div className="bg-white h-[60px]  px-6 py-2 rounded-full flex items-center justify-between">
               <div className="flex items-center gap-2">
                    <BotMessageSquare /> <Logo />
               </div>

               <div className="flex">
                    <AvatarGroup>
                         {connectedUser && connectedUser?.map((user: User) =>
                              <Avatar src={user?.imageUrl} />
                         )}
                    </AvatarGroup>
               </div>

               {
                    user && <Avatar src={user?.imageUrl} />
               }


          </div>
     )
}

export default Navbar