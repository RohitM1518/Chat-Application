import React, { useState } from 'react'
import { useChatContext } from '../context/ChatContext'
import { Try } from '@mui/icons-material'
import axios from 'axios'
import { errorParser } from '../utils/errorParser'
import { useSelector } from 'react-redux'
import { useMessageContext } from '../context/MessageContext'
import { useSocketContext } from '../context/SocketContext'

const MessageInput = () => {
  const {chat}= useChatContext()
  const {messages,setMessages} = useMessageContext()
  const accessToken = useSelector(state => state?.user?.accessToken)
  const[content,setContent] = useState('')
  const {socket} = useSocketContext()

  if(socket){
  socket.on('messageReceived',(messagesRes)=>{
    console.log("new Message")
    setMessages(messagesRes);
    console.log(messages)
  })
  }
  const sendMessage=async(e)=>{
    e.preventDefault()
    try {
      const res = await axios.post(`http://localhost:8000/message/${chat?._id}`,{content},{
        withCredentials:true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setContent('')

      setMessages(res?.data?.data)
      // const messages = await axios.get('http://localhost:8000/chat')
      // console.log(res)
    } catch (error) {
      const errMsg = errorParser(error)
      console.log(errMsg)
    }
  }
  return (
    <div className=''>
        <form onSubmit={sendMessage} className='flex gap-2'>
        <input type="text" placeholder="Type here" className="input input-bordered input-info w-full sticky" value={content} onChange={(e)=>setContent(e.target.value)}/>
        <button className="btn glass text-white" >Send</button>
        </form>
    </div>
  )
}

export default MessageInput