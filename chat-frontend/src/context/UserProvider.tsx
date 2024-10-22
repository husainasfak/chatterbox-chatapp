import React, { useContext, useEffect, useState } from "react"
import api from "../utils/axiosInstance";
import { UserAccess } from "../types";

interface User {
     id: string;
     userName: string;
     imageUrl: string
}


interface UserContextType {
     user: User | null,
     isUserLoading: boolean,
     access: UserAccess | null,
     setAccess: React.Dispatch<React.SetStateAction<UserAccess | null>>

}
interface ProviderProps {
     children?: React.ReactNode
}

const UserContext = React.createContext<UserContextType | null>(null);


export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
     const [user, setUser] = useState(null)
     const [isUserLoading, setIsUserLoading] = useState(false)
     const [access, setAccess] = useState<UserAccess | null>(null)
     const checkUser = async () => {
          try {
               const { data } = await api.get('/user/check');

               if (data?.success) {
                    setUser(data?.user);
                    setAccess(UserAccess.GRANTED)
                    setIsUserLoading(false)
               }
          } catch (err) {
               console.log(err)
               setIsUserLoading(false)
               setAccess(UserAccess.DENIED)
          }
     }

     useEffect(() => {
          setIsUserLoading(true)
          checkUser()
     }, [access])


     return (
          <UserContext.Provider value={{ user, isUserLoading, access, setAccess }}>
               {children}
          </UserContext.Provider>
     )
}



// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
     const state = useContext(UserContext)
     if (!state) throw new Error('State is undefined');
     return state;
}

