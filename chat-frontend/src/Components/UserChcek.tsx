import { useEffect } from "react";
import { useAuth } from "../context/UserProvider";
import TypeWriteLoader from "./TypeWriteLoader"
import { useNavigate } from "react-router-dom";
import { UserAccess } from "../types";

const UserChcek = () => {
     const navigate = useNavigate()
     const { user, isUserLoading, access } = useAuth();
     useEffect(() => {
          if (!isUserLoading && access === UserAccess.GRANTED && user) {
               navigate('/dashboard')

          } else if (!isUserLoading && access === UserAccess.DENIED && !user) {
               navigate('/sign-in')
          }
     }, [user, isUserLoading, access])
     return (
          <div className="flex h-full w-full items-center justify-center">
               <div className="flex flex-col justify-center items-center">
                    <TypeWriteLoader />
                    <p className="text-center font-head font-bold text-[18px] mt-3">Loading...</p>
               </div>
          </div>
     )
}

export default UserChcek