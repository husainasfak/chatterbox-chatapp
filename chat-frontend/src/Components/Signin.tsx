
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from "react"
import api from "../utils/axiosInstance"
import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Loader } from './Loader'
import toast from "react-hot-toast";
import useDebounce from '../hooks/useDebounce'


const containerVariants = {
     hidden: {
          opacity: 0
     },
     visible: {
          opacity: 1
     },
     exit: {
          x: '-100vw',
          transition: {
               ease: 'easeInOut'
          }
     }
}


const userNameSchema = z.string().min(3, { message: 'Username must be at least 3 characters long' })
interface ErrorState {
     state: boolean;
     message: string | null;
}
const Signin = () => {
     const naviagte = useNavigate()
     const [userName, setUserName] = useState('');
     const debouncedUserName = useDebounce(userName)
     const [error, setError] = useState<ErrorState>({ state: false, message: null })
     const [isUserExist, setIsUserExist] = useState(false)
     const [showPassword, setShowPassword] = useState(false)
     const [loadingUserCheck, setLoadingUserCheck] = useState(false)
     const [password, setPassword] = useState('')
     const handleUsernameChange = async () => {


          const isSafe = userNameSchema.safeParse(debouncedUserName);


          setError({
               state: isSafe.success,
               message: fromError(isSafe.error).message.split(":")[1]
          })


          if (isSafe.success) {
               setLoadingUserCheck(true)
               const isUserExist = await checkUser(debouncedUserName)
               console.log(isUserExist?.success)
               setIsUserExist(isUserExist?.success)
          }

     }


     useEffect(() => {
          if (debouncedUserName) {
               handleUsernameChange()
          }
     }, [debouncedUserName])

     const checkUser = async (username: string) => {
          try {
               const { data } = await api.get(`/user/exist/${username}`)
               if (data) {
                    setLoadingUserCheck(false)
                    return data;
               }

          } catch (err) {
               setLoadingUserCheck(false)
               console.log(err)

          }

     }

     const signInUser = async () => {
          const { data } = await api.post('/user/signin', {
               userName,
               password
          })
          if (data) {
               if (data.success) {
                    naviagte('/')
               } else {
                    toast.error(data.message)
               }
          }
     }
     const createUser = async () => {
          naviagte(`/onboard?user=${userName}`)
     }
     return (
          <motion.div className="flex justify-center items-center h-full" variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit='exit'>
               <div className="min-w-[600px] max-w-[600px] min-h-[460px] max-h-[460px] bg-white rounded-xl shadow-md p-[40px] flex flex-col" >
                    <div>
                         <p className="font-head font-bold text-[32px]">Sign in</p>
                         <p className="text-sm mt-[4px] text-[#bbb]">We’ll check if you have an account, and help create one if you don’t.</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                         <div className="relative">
                              <div>
                                   <div className='relative'>
                                        <motion.input type="text" className="w-full border-b-2 border-black pb-2 tracking-wide outline-none" placeholder="Your Username" value={userName} onChange={(e) => setUserName(e.target.value)} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} />
                                        {
                                             loadingUserCheck && <Loader fill='black' className='absolute right-1 bottom-3' />
                                        }

                                   </div>


                                   {
                                        !error.state && <p className='text-xs mt-2 text-danger'>
                                             {error.message}
                                        </p>
                                   }

                                   {
                                        error.state && userName !== '' && <p className='text-primary text-end mt-2 cursor-pointer text-xs '>Suggest Username</p>
                                   }

                              </div>
                              <AnimatePresence>
                                   {
                                        isUserExist && !loadingUserCheck && <div className="mt-[42px] relative">
                                             {
                                                  showPassword ? <EyeOff className="absolute right-1 cursor-pointer" onClick={() => setShowPassword(false)} /> : <Eye className="absolute right-1 cursor-pointer" onClick={() => setShowPassword(true)} />
                                             }


                                             <motion.input className="w-full border-b-2 border-black pb-2 tracking-wide outline-none" placeholder="Create your password" type={showPassword ? "text" : "password"} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} value={password} onChange={(e) => setPassword(e.target.value)} />

                                        </div>
                                   }
                              </AnimatePresence>


                         </div>
                         <AnimatePresence>
                              {
                                   !(userName === '' || !error.state) && !loadingUserCheck && <div className="mt-[22px] flex justify-end">
                                        <motion.button className="px-4 py-2 bg-black text-white rounded-lg disabled:bg-gray-600" onClick={() => {
                                             if (isUserExist) {
                                                  signInUser()
                                             } else {
                                                  createUser()
                                             }
                                        }}
                                             disabled={userName === '' || !error.state} initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             exit={{ opacity: 0 }}>
                                             {
                                                  isUserExist ? 'Take me in' : 'Create new account'
                                             }

                                        </motion.button>
                                   </div>
                              }
                         </AnimatePresence>
                    </div>

               </div>
          </motion.div>

     )
}

export default Signin