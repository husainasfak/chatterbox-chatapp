import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UserProvider";
import { UserAccess } from "../types";


const PrivateRoutes = () => {
    const { user, isUserLoading, access } = useAuth();
    return !isUserLoading && access === UserAccess.GRANTED && user ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoutes