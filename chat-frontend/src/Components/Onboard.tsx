import { useEffect, useState } from "react"
import { getRandomValues } from "../utils/getRandomValueFromArr"
import { Eye, EyeOff } from "lucide-react"
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Loader } from "./Loader";
import { UserAccess } from "../types";
import { useAuth } from "../context/UserProvider";

const avatarContainerVariant = {
     hidden: {
          opacity: 0,
     },
     visible: {
          opacity: 1,
     },
     exit: {
          x: -40,
          opacity: 0,


     }
}

const SingleAvtarVariant = {
     hidden: {
          opacity: 0,
          x: 40,
     },
     visible: {
          opacity: 1,
          x: 0,
          transition: {
               delay: 0.4,

          }
     },
}

const containerVariants = {
     hidden: {
          opacity: 0
     },
     visible: {
          opacity: 1,
     },
     exit: {
          x: '-100vw',
          transition: {
               ease: 'easeInOut'
          }
     }
}
const Onboard = () => {
     const { setAccess } = useAuth()
     const navigate = useNavigate()
     const [showPassword, setShowPassword] = useState(false)
     const [searchParams] = useSearchParams();
     const userName = searchParams.get("user")
     const profilepic = [
          'https://utfs.io/f/11e8b197-33d5-4044-99ff-c04dce582477-hzt98r.jpeg',
          'https://utfs.io/f/cf5acb76-114d-47cf-8874-7afd71b98127-v5vqs5.jpeg',
          'https://utfs.io/f/a25602f8-8471-4b09-bf99-4169acd8fe32-v5vqm4.jpeg',
          'https://utfs.io/f/2614532b-a877-42de-abf9-f17506e4286e-v5vql9.jpeg',
          'https://utfs.io/f/7397f6dc-e7da-45c7-bd01-c76ccb77c187-v5vqpk.jpeg',
          'https://utfs.io/f/e3b0d871-f2c4-4dcc-bf9c-5d25b54ab3d1-v5vqqf.jpeg',
          'https://utfs.io/f/4b24595b-0c1e-4062-b4bd-27124ff9d3d6-v5vqra.jpeg',
          'https://utfs.io/f/9dd3e8dd-d6b7-4ca6-a300-9c5b706338e3-v5vqnu.jpeg',
          'https://utfs.io/f/911d8023-c705-4adb-8cae-8c9e94407a30-sd8ppv.jpeg',
          'https://utfs.io/f/114b77c7-9b3b-4370-aec1-4d887a1006eb-sd8pqq.jpeg',
          'https://utfs.io/f/7b8f37b3-87ae-438c-9a98-8d6b1d1198fa-sd8prl.jpeg',
          'https://utfs.io/f/869319fe-1faa-4101-b31e-bc4c4b1a4dfe-v5vqmz.jpeg',
     ]
     const [showRandom, setShowRandom] = useState<string[] | []>([])
     useEffect(() => {
          setShowRandom(getRandomValues(profilepic));
     }, [])

     const [imageUrl, setImageUrl] = useState('')
     const [password, setPassword] = useState('')
     const [isSigningIn, setIsSigningIn] = useState(false)
     const createUser = async () => {
          setIsSigningIn(true)

          try {
               const user = await api.post('/user/create', {
                    userName,
                    imageUrl,
                    password
               })
               if (user) {
                    toast.success('Account created successfully! Enjoy exploring!');
                    setAccess(UserAccess.GRANTED)
                    navigate('/')
                    setIsSigningIn(false)
               }
          } catch (err) {
               toast.error('Somthing went wrong!');
               console.log(err)
               setIsSigningIn(false)
          }


     }
     return (
          <motion.div className="flex justify-center items-center h-full" variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit='exit'>
               <div className="min-w-[600px] max-w-[600px] min-h-[460px] max-h-[460px] bg-white rounded-xl  shadow-md p-[40px] flex flex-col" >
                    <div>
                         <p className="font-head font-bold text-[32px]">Hello, {userName} </p>
                         <p className="text-sm mt-[4px] text-[#bbb]">Please complete your onboarding process.</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center mt-2">
                         <div>
                              <div className="flex items-center justify-between">
                                   <p className="text-[18px]">Choose your avatar</p>
                                   <p className="text-primary text-xs border-b-2 border-primary cursor-pointer">View All</p>
                              </div>

                              <div className="flex justify-center mt-[20px]">

                                   <AnimatePresence mode="sync">
                                        {!imageUrl && showRandom?.length > 0 && showRandom.map(pic =>
                                             <motion.div
                                                  className="relative group"
                                                  onClick={() => setImageUrl(pic)}
                                                  variants={avatarContainerVariant}
                                                  initial="hidden"
                                                  animate="visible"
                                                  exit={"exit"}

                                             >
                                                  <img src={pic} alt="Avatar" className="w-[70px] h-[70px] rounded-full mx-4 cursor-pointer group-hover:blur-sm" />
                                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity w-[70px] h-[70px] rounded-full mx-4 cursor-pointer">
                                                       <span className="text-white text-sm">Select</span>
                                                  </div>
                                             </motion.div>)}


                                   </AnimatePresence>

                                   <AnimatePresence mode="sync">
                                        {
                                             imageUrl && <motion.div
                                                  variants={SingleAvtarVariant}
                                                  initial="hidden"
                                                  animate="visible"
                                                  exit={"exit"}

                                             >
                                                  <img src={imageUrl} alt="Avatar" className="w-[70px] h-[70px] rounded-full mx-4 cursor-pointer group-hover:blur-sm border-2 border-black p-1" />
                                             </motion.div>
                                        }
                                   </AnimatePresence>

                              </div>
                         </div>

                         <div className="mt-[48px] relative">
                              {
                                   showPassword ? <EyeOff className="absolute right-1 cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="absolute right-1 cursor-pointer" onClick={() => setShowPassword(true)} />
                              }


                              <input className="w-full border-b-2 border-black pb-2 tracking-wide outline-none" placeholder="Create your password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />

                         </div>
                         <div className="mt-[22px] flex justify-end">
                              <button className="px-4 py-2 bg-black text-white rounded-lg w-[170px] h-[40px] flex justify-center items-center disabled:bg-gray-600" onClick={createUser} disabled={isSigningIn}>
                                   {isSigningIn ? <Loader /> : 'Complete sign in'}
                              </button>
                         </div>
                    </div>
               </div>
          </motion.div>
     )
}

export default Onboard