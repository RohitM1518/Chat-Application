import {  Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useMessageContext } from '../context/MessageContext'
import { format } from 'date-fns';
import { Button } from '@mui/material'
import { useChatContext } from '../context/ChatContext'
import { useChatModification } from '../context/ChatModificationContext'
import { MoreVert } from '@mui/icons-material'
import Alert from './Alert'
import { useAlertContext } from '../context/AlertContext'

const User = ({ user, deleteButton, addButton }) => {
  const [lastMessage, setLastMessage] = useState(null)
  const { messages } = useMessageContext()
  const { chat } = useChatContext()
  const { setModification } = useChatModification()
  // console.log("set messages",setMessages)
  const currentUser = useSelector(state => state.user?.currentUser)
  const refreshToken = useSelector(state => state.user?.currentUser?.refreshToken)
  const accessToken = useSelector(state => state.user?.accessToken)
  const [formattedDate, setFormattedDate] = useState('');
  const {setAlert}=useAlertContext()

  const removeParticipant = async () => {
    try {
      await axios.delete(`http://localhost:8000/chat/group/${chat._id}/${user._id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setModification('')

    } catch (error) {
      console.log(error)
    }
  }
  const addParticipant = async () => {
    try {
      console.log(accessToken)
      await axios.post(`http://localhost:8000/chat/group/${chat._id}/${user._id}`, {}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setModification('')
    } catch (error) {
      console.log(error)
    }
  }
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
        setFormattedDate(format(new Date(lastMessage?.createdAt), 'PP').toString())

      }
      getChat()
    } catch (error) {
      console.log(error)
    }
  }, [user, messages])
  const handleDeleteChat=()=>{
    setAlert(true)
    setTimeout(()=>{
      setAlert(false)
    },2000)
  }
  return (

    <div className={` relative flex gap-5 items-start justify-start border-2 w-full py-1 border-blue-400 rounded-lg ${deleteButton ? " items-center" : ""} hover:bg-slate-800`}>
      <Avatar src={user?.avatar} sx={{ width: 50, height: 50 }} />
      <div>
        <div className=' flex w-full gap-10 items-center'>
          <h3 className=' text-white text-lg font-semibold block'>{user?.fullName}</h3>
          {!deleteButton && !addButton && <p className=' text-white text-sm block'>{formattedDate}</p>}
        </div>
        {lastMessage && !deleteButton && !addButton && <div>
          <h3 className=' text-white text-sm opacity-65'>{lastMessage?.sender?._id == currentUser?._id ? "You: " : lastMessage?.sender?.fullName + ": "}{lastMessage?.content}</h3>
        </div>}
      </div>
      {
        deleteButton &&
        <Button color='error' variant='contained' sx={{ width: 30, height: 25 }} onClick={removeParticipant}>Remove</Button>
      }
      {
        addButton &&
        <Button color='success' variant='contained' sx={{ width: 30, height: 25 }} onClick={addParticipant}>Add</Button>
      }
      {
        !deleteButton && !addButton && lastMessage && <div className="dropdown dropdown-left dropdown-end absolute right-2">
        <div tabIndex={0} role="button" className="m-1"><MoreVert sx={{color:'white'}}/></div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-slate-300 text-black">
          <li className='' onClick={handleDeleteChat}><a>Delete Chat</a></li>
        </ul>
      </div>
      }
    </div>
  )
}

export default User