import { useState,useEffect } from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import { useDispatch,useSelector } from 'react-redux'
import { loginSuccess,logout } from './redux/userSlice'
import axios from 'axios'
import { useSocketContext } from './context/SocketContext'

function App() {
  const dispatch = useDispatch()
  const refreshToken = useSelector(state => state?.user?.currentUser?.refreshToken)
  const accessToken = useSelector(state => state?.user?.accessToken)
  const {socket} = useSocketContext();
  // console.log("socket",socket)
  useEffect(()=>{
    if(socket){
      socket.on('connect',()=>{
        console.log('Connected to socket server')
      })
    }
  },[])

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
   <Outlet />
   <Footer />
   </div>
  )
}

export default App
