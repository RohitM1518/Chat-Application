import { Avatar } from '@mui/material'
import React from 'react'
import { useChatContext } from '../context/ChatContext'

const User = ({user}) => {
    const {chat} = useChatContext()
    console.log(chat)
  return (
    <div  className=' flex gap-5 items-center justify-around border-2 px-10 w-full py-1 border-blue-400 rounded-lg'>
        <Avatar src={user?.avatar} sx={{width: 50, height: 50}} />
        <div>
        <h3 className=' text-white text-lg font-semibold'>{user?.fullName}</h3>
        <h3 className=' text-white text-sm opacity-65'>{chat?.lastMessage}</h3>
        </div>
    </div>
  )
}

export default User