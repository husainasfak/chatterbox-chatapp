// import { useState } from "react"
// import { useSocket } from "./context/SocketProvider"
import { AnimatePresence } from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom"
import Signin from "./Components/Signin"
import Onboard from "./Components/Onboard"
import { Toaster } from 'react-hot-toast';
import Dashboard from "./Components/Dashboard";
import UserChcek from "./Components/UserChcek";
import './App.css'
import PrivateRoutes from "./Components/PrivateRoutes";

const App = () => {
  // const { messages, sendMessage } = useSocket()
  // const [msg, setMsg] = useState('')
  const location = useLocation();



  return (
    <>

      <AnimatePresence mode="wait" >
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<UserChcek />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route element={<PrivateRoutes />}>
            <Route path='/dashboard' element={<Dashboard />} />

          </Route>

        </Routes>
      </AnimatePresence>
      <Toaster position="top-center" reverseOrder={false} />
    </>

  )
}

export default App