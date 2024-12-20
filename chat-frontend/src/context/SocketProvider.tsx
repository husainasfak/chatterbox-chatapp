import React, { useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client";
import { User } from "../types";

interface SocketProviderProps {
     children?: React.ReactNode
}

interface TypingUser extends User {
     isTyping: boolean;  // New field
}

interface ISocketContext {
     socket: Socket | null;
     joinUser: (user: User) => void;
     connectedUser: User[],
     setTypingIndicator: React.Dispatch<React.SetStateAction<User[] | []>>,
     typingIndicator: [] | User[],
     typingUser:TypingUser | null
}

const SocketContect = React.createContext<ISocketContext | null>(null);


export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
     const [socket, setSocket] = useState<Socket | null>(null)
     const [connectedUser, setConnectedUser] = useState<User[] | []>([])
     const [typingIndicator, setTypingIndicator] = useState<User[] | []>([])

     useEffect(() => {
          const _socket = io('http://localhost:8000', { autoConnect: false })
          setSocket(_socket)
          return () => {
               _socket.disconnect()

               setSocket(null)
          }
     }, [])


     const [typingUser,setTypingUser] = useState<TypingUser | null>(null)

     useEffect(() => {
          if (socket) {
               socket.on('connected-users', (users: User[]) => {
                    setConnectedUser(users);
               });
               socket?.on('typingStatus', (user: TypingUser) => {
                    setTypingUser(user);
                    
                    // Clear typing status after 2 seconds of no updates
                    setTimeout(() => {
                      setTypingUser(null);
                    }, 2000);
               });
          }
          return () => {
               socket?.off('connected-users');
               socket?.off('typingStatus');
          };
     }, [socket]);

     const joinUser = (user: User) => {
          if (socket) {
               socket.emit('user-join', user)
          }
     }

     return (
          <SocketContect.Provider value={{ socket, joinUser, connectedUser, setTypingIndicator, typingIndicator,typingUser }}>
               {children}
          </SocketContect.Provider>
     )
}



// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
     const state = useContext(SocketContect)
     if (!state) throw new Error('State is undefined');
     return state;
}

