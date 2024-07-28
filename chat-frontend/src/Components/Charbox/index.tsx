
import { UserType } from "../../types";



import PrivateMessaging from "./PrivateMessaging";

type chatBoxProps = {
     selectedConversation: UserType | null;
}

const ChatBox = ({ selectedConversation }: chatBoxProps) => {

     return (
          <>
               <PrivateMessaging selectedConversation={selectedConversation} />


          </>
     )
}

export default ChatBox