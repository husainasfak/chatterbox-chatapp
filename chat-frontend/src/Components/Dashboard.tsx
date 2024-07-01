

import { useEffect, useState } from 'react'
import ChatBox from './Charbox'
import ChatItems from './ChatItems'
import Navbar from './Navbar'
import { UserType } from '../types'
import { useAuth } from '../context/UserProvider'
import { useSocket } from '../context/SocketProvider'


const Dashboard = () => {
     const { user } = useAuth()
     const { socket, connectedUser } = useSocket()
     const [selectedConversation, setSelectedConversation] = useState<UserType | null>(null)
     const connectToSocket = () => {
          if (socket) {
               socket.auth = { user };
               socket.connect();
               socket.emit('user-join', { user });
          }

     }
     console.log('connectedUser', connectedUser)
     useEffect(() => {
          if (user && socket) {
               connectToSocket()
               socket.onAny((event, ...args) => {
                    console.log("[SOCKET LOGS]", event, args);
               });


               // socket.on("users", (users) => {
               //      console.log("users", users);
               //      // users.forEach((user) => {
               //      //      user.self = user.userID === socket.id;
               //      // });
               //      console.log(users)
               //      // setConnectedUser(users);
               // });

               // socket.on("user connected", (user) => {
               //      console.log(`just join`, user);
               //      // setConnectedUser((prev) => [...prev, user]);
               // });
          }
     }, [user, socket])
     return (
          <div className='max-w-[1200px] w-[1200px] mx-auto flex flex-col h-full py-2 pb-3 gap-6'>
               <Navbar />
               <div className='flex-1'>
                    <div className='flex gap-10 h-full'>
                         <div className='w-[330px]'>
                              <ChatItems setSelectedConversation={setSelectedConversation} selectedConversation={selectedConversation} />
                         </div>

                         <div className='flex-1'>
                              <ChatBox selectedConversation={selectedConversation} />
                         </div>
                    </div>
               </div>


          </div>
     )
}

export default Dashboard