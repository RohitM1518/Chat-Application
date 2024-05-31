import React from 'react'
import { UserList } from '../components'
import Chat from '../components/Chat'
import { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { ChatContextProvider } from '../context/ChatContext'

const Main = () => {
  const accessToken = useDispatch(state=>state?.user?.accessToken)
  const [users,setUsers]=useState([])
//   useEffect(() => {
//     try {
//         async function userlist() {
//             const res = await axios.get("http://localhost:8000/chat/users", {
//                 withCredentials: true,
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`
//                 }
//             })
//             console.log(res.data.data)
//             setUsers(res.data.data)
//         }
//         userlist()
//     } catch (error) {
//       console.log(error)
//     }
// }, [])

  return (
    <div className=' w-full flex'>
      <ChatContextProvider>
      <div className='flex h-screen'>
        {users && <div>
          <UserList users={users}/>
        </div>}
      </div>
      <div className='w-full'>
        <Chat />
      </div>
      </ChatContextProvider>
    </div>
  )
}

export default Main