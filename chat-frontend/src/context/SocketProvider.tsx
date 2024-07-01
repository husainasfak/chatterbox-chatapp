import React, { useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client";
import { User } from "../types";

interface SocketProviderProps {
     children?: React.ReactNode
}

interface ISocketContext {
     socket: Socket | null;
     joinUser: (user: User) => void;
     connectedUser: User[]
     // sendMessage: (msg: string) => any;
     // messages: string[]

}

const SocketContect = React.createContext<ISocketContext | null>(null);


export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
     const [socket, setSocket] = useState<Socket | null>(null)
     const [connectedUser, setConnectedUser] = useState<User[] | []>([])
     // const [messages, setMessages] = useState<string[]>([])
     // const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
     //      if (socket) {
     //           socket.emit('event:message', { message: msg })
     //      }
     // }, [socket])

     useEffect(() => {
          const _socket = io('http://localhost:8000', { autoConnect: false })
          // _socket.on('message', onMessageRec)
          setSocket(_socket)
          return () => {
               _socket.disconnect()
               // _socket.off('message', onMessageRec)
               setSocket(null)
          }
     }, [])

     useEffect(() => {
          if (socket) {
               socket.on('connected-users', (users: User[]) => {
                    setConnectedUser(users);
               });
          }


          return () => {
               socket?.off('connected-users');
          };
     }, [socket]);

     const joinUser = (user: User) => {
          if (socket) {
               socket.emit('user-join', user)
          }
     }

     // const onMessageRec = useCallback((msg: string) => {
     //      console.log('From server', msg)
     //      const message = JSON.parse(msg) as { message: string }
     //      setMessages((prev) => [...prev, message])
     // }, [])
     return (
          <SocketContect.Provider value={{ socket, joinUser, connectedUser }}>
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

