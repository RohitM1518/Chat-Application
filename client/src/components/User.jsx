import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useMessageContext } from '../context/MessageContext'
import { format } from 'date-fns';

const User = ({ user }) => {
  const [lastMessage, setLastMessage] = useState(null)
  const { messages } = useMessageContext()
  // console.log("set messages",setMessages)
  const currentUser = useSelector(state=>state.user?.currentUser)
  const refreshToken = useSelector(state => state.user?.currentUser?.refreshToken)
  const accessToken = useSelector(state => state.user?.accessToken)
  const [formattedDate, setFormattedDate] = useState('');
  useEffect(() => {
    try {
      async function getChat() {
        const res = await axios.post(`http://localhost:8000/chat/c/${user._id}`,
          { refreshToken: refreshToken },
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        setLastMessage(res?.data?.data?.lastMessage)
        console.log("Last message", lastMessage)
        // console.log("Formated date",formattedDate)
        setFormattedDate(format(new Date(lastMessage?.createdAt), 'PPpp').toString())

      }
      getChat()
    } catch (error) {
      console.log(error)
    }
  }, [user, messages])

  return (
    <div className=' flex gap-5 items-start justify-start border-2 w-full py-1 border-blue-400 rounded-lg'>
      <Avatar src={user?.avatar} sx={{ width: 50, height: 50 }} />
      <div>
        <div className=' flex w-full gap-10 items-center'>
          <h3 className=' text-white text-lg font-semibold block'>{user?.fullName}</h3>
          <p className=' text-white text-sm block'>{formattedDate}</p>
        </div>
        {lastMessage && <div>
          <h3 className=' text-white text-sm opacity-65'>{lastMessage?.sender?._id == currentUser?._id?"You: ":lastMessage?.sender?.fullName+": "}{lastMessage?.content}</h3>
        </div>}
      </div>
    </div>
  )
}

export default User