// import { useState } from "react"
// import { useSocket } from "./context/SocketProvider"
import { AnimatePresence } from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom"
import Signin from "./Components/Signin"
import Onboard from "./Components/Onboard"
import { Toaster } from 'react-hot-toast';
import Dashboard from "./Components/Dashboard";
import UserChcek from "./Components/UserChcek";


const App = () => {
  // const { messages, sendMessage } = useSocket()
  // const [msg, setMsg] = useState('')
  const location = useLocation();



  return (
    <>

      <AnimatePresence mode="wait" >
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<UserChcek />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/onboard" element={<Onboard />} />
        </Routes>
      </AnimatePresence>


      {/* <div className="text-3xl">App</div>

      <input type="text" placeholder="Type" className="border" onChange={(e) => setMsg(e.target.value)} />
      <button onClick={() => {
        sendMessage(msg)
      }}>Send</button>


      <h1>Messages</h1>
      {
        messages?.length > 0 && messages?.map(m => <p>{m.message}</p>)
      } */}
      <Toaster position="top-center" reverseOrder={false} />
    </>

  )
}

export default App