import { useState,useEffect } from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import { useDispatch,useSelector } from 'react-redux'
import { loginSuccess,logout } from './redux/userSlice'
import axios from 'axios'
import { useSocketContext } from './context/SocketContext'
import {persistor} from './redux/store.js'
import {LinearProgress} from '@mui/material'
import { useLoadingContext } from './context/LoadingContext'
import { useResponseContext } from './context/ResponseContext'
import { useErrorContext } from './context/ErrorContext'


function App() {
  const dispatch = useDispatch()
  const refreshToken = useSelector(state => state?.user?.currentUser?.refreshToken)
  const accessToken = useSelector(state => state?.user?.accessToken)
  const {socket} = useSocketContext();
  // console.log("socket",socket)
  // persistor.purge();
  useEffect(()=>{
    if(socket){
      socket.on('connect',()=>{
        console.log('Connected to socket server')
      })
    }
  },[socket])
  const { response, setResponse } = useResponseContext()
  const {error,setError}=useErrorContext()
  const {isLoading}=useLoadingContext()

  if(error){
    setTimeout(()=>{
      setError('')
    },5000)
  }
  if(response){
    setTimeout(()=>{
      setResponse('')
    },5000)
  }

// useEffect(()=>{
//   const refreshTheToken = async () => {
//     try {
//       if(refreshTheToken && accessToken){
//       const res = await axios.post('http://localhost:8000/user/refresh-token',
//         { refreshToken: refreshToken },
//         {
//           withCredentials: true,
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         }
//       );
//       console.log(res.data.data.data)
//       dispatch(loginSuccess(res.data.data.data))
//     }
//     } catch (error) {
//       dispatch(logout())
//       throw error
//     }

//   }
//   refreshTheToken();
// },[])
  return (
    <div className=' relative'>
   <Header />
   {response && <div className="toast toast-bottom toast-start z-50">
        <div className="alert bg-green-500">
          <span className=' text-black'>{response}</span>
        </div>
      </div>}
      {error && <div className="toast toast-bottom toast-start z-50">
        <div className="alert bg-red-400">
          <span className=' text-black'>{error}</span>
        </div>
      </div>}
      {isLoading && <div className=''>
      <LinearProgress />
      </div>}
   <Outlet />
   <Footer />
   </div>
  )
}

export default App
