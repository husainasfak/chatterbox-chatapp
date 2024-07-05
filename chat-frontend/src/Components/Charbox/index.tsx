import { MessagesSquare, Paperclip, Smile } from "lucide-react";
import { ChatType, PrivateConversation, UserType } from "../../types";
import Avatar from "../Avatar";

import TypeWriteLoader from "../TypeWriteLoader";
import api from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/UserProvider";
import { useSocket } from "../../context/SocketProvider";
import ChatList from "./GroupMessageByDate";
import { MDXEditor, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin } from '@mdxeditor/editor'
import { headingsPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
type chatBoxProps = {
     selectedConversation: UserType | null;
}

const ChatBox = ({ selectedConversation }: chatBoxProps) => {
     const [isChatExist, setisChatExist] = useState(false);
     const [conversation, setConversation] = useState<PrivateConversation | null>(null)
     const [message, setMessage] = useState('')
     const [chat, setChats] = useState<ChatType[] | []>([])
     const { user } = useAuth()
     const { socket } = useSocket()
     const [socketConnected, setSocketConnected] = useState(false)
     const acceptConversation = async () => {
          const { data } = await api.post(`/private-conversation/accept`, {
               conversationId: conversation?.id
          });
          if (data?.success) {
               console.log(data)
          }
     }
     const getConversation = async () => {
          const { data } = await api.get(`/private-conversation/exist/${selectedConversation?.id}`);
          if (data?.success) {
               console.log(data.conversation)
               setisChatExist(true)
               setChats(data.conversation.messages)
               setConversation(data.conversation)
          } else {
               setisChatExist(false)
               setConversation(null)
               setChats([])
          }
     }

     const createConversation = async () => {
          const { data } = await api.post(`/private-conversation/create/${selectedConversation?.id}`, {
               message
          });
          if (data?.success) {
               setMessage('')
               console.log(data)
          }
     }

     // const sendMessage = async () => {
     //      const { data } = await api.post(`/private-message/send/${selectedConversation?.id}`, {
     //           content: message,
     //           conversationId: conversation?.id,
     //      });
     //      if (data?.success) {
     //           setMessage('')
     //           if (conversation && conversation.status === 'PENDING') {
     //                acceptConversation()
     //           }
     //      }
     //      return data
     // }

     const handleMessageSend = async () => {
          if (isChatExist) {
               if (socket) {
                    let data;
                    if (conversation && user && selectedConversation) {
                         data = {
                              content: message,
                              conversationId: conversation.id,
                              senderId: user.id,
                              receiverId: selectedConversation.id,
                              createdAt: new Date(),
                              isDeleted: false
                         }
                    }

                    // setChats([...chat, data])
                    socket.emit("new message", data);
                    if (conversation && conversation.status === 'PENDING') {
                         acceptConversation()
                    }
                    setMessage('')
               }

          } else {
               createConversation()
          }
     }

     useEffect(() => {
          if (selectedConversation) {
               getConversation();
               if (socket) {
                    socket.emit('create-room', user);
                    socket.on("connected", () => setSocketConnected(true));
                    socket.emit("join-room", selectedConversation.id);
               }
          }
     }, [selectedConversation])

     const handleChatAccpet = () => {
          acceptConversation()
     }

     const handleChatDecline = () => {
          console.log('Decline')
     }



     useEffect(() => {
          socket?.on("message recieved", (newMessageRecieved) => {
               setChats([...chat, newMessageRecieved])
               console.log('here is the message', newMessageRecieved)
               // if (
               //      !selectedChatCompare || // if chat is not selected or doesn't match current chat
               //      selectedChatCompare._id !== newMessageRecieved.chat._id
               // ) {
               //      if (!notification.includes(newMessageRecieved)) {
               //           setNotification([newMessageRecieved, ...notification]);
               //           setFetchAgain(!fetchAgain);
               //      }
               // } else {
               //      setMessages([...messages, newMessageRecieved]);
               // }
          });
     });
     return (
          <>
               {
                    selectedConversation ? <div className="w-full bg-white rounded-2xl h-full p-4 flex flex-col">
                         <div className="flex items-center gap-3">
                              <Avatar src={selectedConversation.imageUrl} width={35} />
                              <p className="text-2xl">
                                   {
                                        selectedConversation?.userName
                                   }
                              </p>

                         </div>
                         <div className="flex-1 mt-4">
                              <div className="flex flex-col gap-2 justify-between max-h-[510px] ">
                                   <div className="hide-scrollbar flex-1 bg-[#ECECED] w-full rounded-lg py-3 px-4 h-full overflow-y-auto relative">
                                        <div className="flex justify-center ">
                                             {
                                                  conversation && conversation?.status === "PENDING" && user?.id === conversation?.recipientId && <div className="bg-white mx-4 px-4 py-2 rounded-lg fixed flex items-center gap-20 z-10">
                                                       <p className="text-lg">{conversation?.initiator?.userName} wants to send messaage</p>
                                                       <div className="flex items-center gap-4">
                                                            <button className="px-4 py-2 border text-black rounded-lg w-[85px] h-[40px] flex justify-center items-center disabled:bg-gray-600 cursor-pointer" onClick={handleChatDecline}>Decline</button>
                                                            <button className="px-4 py-2 bg-primary text-white rounded-lg w-[85px] h-[40px] flex justify-center items-center disabled:bg-gray-600 cursor-pointer" onClick={handleChatAccpet}>Accept</button>

                                                       </div>

                                                  </div>
                                             }
                                        </div>

                                        {
                                             isChatExist ? <div className="h-full relative flex flex-col justify-end ">
                                                  {/* {chat && chat.map((message, index) => (
                                                       <ChatMessage key={index} message={message} />
                                                  ))} */}
                                                  {
                                                       chat && <ChatList messages={chat} />
                                                  }

                                             </div> : <div className="flex items-center justify-center h-full">
                                                  <p className="text-lg">Start conversation with  {selectedConversation?.userName}</p>
                                             </div>
                                        }

                                   </div>
                                   <div className="bg-[#ECECED] w-full rounded-lg py-3 px-4">
                                        {/* <div className="max-h-[60px] overflow-x-auto">
                                             <MDXEditor
                                                  markdown={message}
                                                  plugins={[headingsPlugin(), listsPlugin(), linkPlugin(), quotePlugin(), markdownShortcutPlugin()]}
                                                  placeholder={`Message to ${selectedConversation?.userName}`}
                                                  contentEditableClassName="chat-editor w-full py-1"
                                                  onChange={(content) => setMessage(content)}
                                             />
                                        </div> */}



                                        <textarea onKeyDown={(event) => {
                                             if (event.key === 'Enter') {
                                                  if (message === '') {
                                                       return;
                                                  }
                                                  handleMessageSend()
                                             }
                                        }} className="w-full bg-transparent outline-none resize-none" placeholder={`Message to ${selectedConversation?.userName}`} rows={1} value={message} onChange={(e) => setMessage(e.target.value)} />
                                        <div className="flex items-center justify-between">
                                             <div className="flex gap-6">
                                                  <Smile size={20} className="cursor-pointer" />
                                                  <Paperclip size={20} className="cursor-pointer" />
                                             </div>
                                             <button onClick={() => {
                                                  if (message === '') {
                                                       return;
                                                  }
                                                  handleMessageSend()
                                             }} className="px-4 py-2 bg-black text-white rounded-lg w-[85px] h-[40px] flex justify-center items-center disabled:bg-gray-600" disabled={message === '' ? true : false}>Send</button>
                                        </div>
                                   </div>
                              </div>


                         </div>
                    </div> : <div className="w-full bg-white rounded-2xl h-full p-4 flex flex-col items-center justify-center">

                         <TypeWriteLoader />
                         <p className="text-xl font-head font-semibold flex items-center gap-2 mt-6">Select Conversation <MessagesSquare size={20} className="mt-1" /></p>
                    </div>
               }


          </>
     )
}

export default ChatBox